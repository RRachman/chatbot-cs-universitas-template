<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ChatAdminController extends Controller
{
    public function index(Request $request, $sessionId = null)
    {
        $user = auth()->user()->load('role'); // Load relasi role
        $isAdmin = $user->role->nama_role === 'admin'; // Gunakan nama_role dari tabel roles

        if ($isAdmin) {
            // Admin dapat melihat semua chat sessions
            $chatSessions = ChatSession::with(['user.role', 'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->withCount(['messages as unread_count' => function($query) {
                $query->where('sender_type', '!=', 'admin');
                // Bisa ditambahkan kondisi untuk unread
            }])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function($session) {
                $lastMessage = $session->messages->first();
                $session->last_message = $lastMessage ? $lastMessage->message : null;
                $session->last_message_at = $lastMessage ? $lastMessage->created_at : null;
                unset($session->messages); // Remove messages to reduce payload
                return $session;
            });

            // If no specific session, get the first one or create new
            if (!$sessionId && $chatSessions->count() > 0) {
                $sessionId = $chatSessions->first()->id;
            }

            $currentSession = null;
            $messages = [];

            if ($sessionId) {
                $currentSession = ChatSession::with('user.role')->find($sessionId);
                if ($currentSession) {
                    $messages = $currentSession->messages()
                        ->with('sender.role') // Load sender dengan role
                        ->orderBy('created_at')
                        ->get()
                        ->map(function($message) {
                            // Pastikan setiap message punya sender_id yang benar
                            return [
                                'id' => $message->id,
                                'message' => $message->message,
                                'sender_id' => $message->sender_id,
                                'sender_type' => $message->sender_type,
                                'created_at' => $message->created_at,
                                'sender' => $message->sender ? [
                                    'id' => $message->sender->id,
                                    'name' => $message->sender->name,
                                    'role' => $message->sender->role->nama_role ?? null
                                ] : null
                            ];
                        });
                }
            }

            return Inertia::render('ChatAdmin/ChatAdmin', [
                'sessionId' => $sessionId,
                'messages' => $messages,
                'chatSessions' => $chatSessions,
                'currentSession' => $currentSession,
                'auth' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role->nama_role, // Kirim nama role
                        'role_id' => $user->role_id
                    ]
                ]
            ]);

        } else {
            // Camaba hanya dapat melihat chat mereka sendiri
            $session = ChatSession::firstOrCreate([
                'user_id' => $user->id,
            ]);

            $messages = $session->messages()
                ->with('sender.role') // Load sender dengan role
                ->orderBy('created_at')
                ->get()
                ->map(function($message) {
                    return [
                        'id' => $message->id,
                        'message' => $message->message,
                        'sender_id' => $message->sender_id,
                        'sender_type' => $message->sender_type,
                        'created_at' => $message->created_at,
                        'sender' => $message->sender ? [
                            'id' => $message->sender->id,
                            'name' => $message->sender->name,
                            'role' => $message->sender->role->nama_role ?? null
                        ] : null
                    ];
                });

            return Inertia::render('ChatAdmin/ChatAdmin', [
                'sessionId' => $session->id,
                'messages' => $messages,
                'chatSessions' => [], // Camaba tidak perlu melihat chat lain
                'currentSession' => $session,
                'auth' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role->nama_role, // Kirim nama role
                        'role_id' => $user->role_id
                    ]
                ]
            ]);
        }
    }

    public function show($sessionId)
    {
        $user = auth()->user()->load('role');
        
        // Pastikan admin dapat mengakses session manapun, camaba hanya milik mereka
        if ($user->role->nama_role !== 'admin') {
            $session = ChatSession::where('user_id', $user->id)->findOrFail($sessionId);
        } else {
            $session = ChatSession::findOrFail($sessionId);
        }

        return $this->index(request(), $sessionId);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'sessionId' => 'required|exists:chat_sessions,id',
        ]);

        $user = auth()->user()->load('role');
        $session = ChatSession::find($request->sessionId);

        // Pastikan user bisa mengirim pesan ke session ini
        if ($user->role->nama_role !== 'admin' && $session->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        $message = $session->messages()->create([
            'sender_id' => $user->id,
            'sender_type' => $user->role->nama_role === 'admin' ? 'admin' : 'user',
            'message' => $request->message,
        ]);

        // Update session timestamp
        $session->touch();

        // Return updated data untuk Inertia
        return redirect()->back();
    }
}