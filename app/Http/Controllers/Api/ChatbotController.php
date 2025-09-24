<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\ChatbotSession;
use App\Models\ChatLog;

class ChatbotController extends Controller
{
    public function ask(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string',
                'sender'  => 'nullable|string',
                'user_id' => 'nullable|integer',
            ]);

            $message = $request->input('message');
            $sender  = $request->input('sender');
            
            // ✅ AUTO-DETECT USER ID dengan fallback
            $userId = $request->input('user_id') 
                    ?? auth()->id() 
                    ?? $this->getOrCreateGuestUser();

            // Debug log
            Log::info('Chatbot Request:', [
                'message' => $message,
                'sender' => $sender,
                'user_id' => $userId,
                'auth_id' => auth()->id()
            ]);

            $rasaUrl = config('services.rasa.url');
            $timeout = (int) config('services.rasa.timeout', 20);
            $maxRetries = (int) config('services.rasa.retries', 1);

            if (empty($rasaUrl)) {
                return response()->json([
                    'ok' => false,
                    'error' => 'RASA_URL not configured'
                ], 500);
            }

            // 1️⃣ Buat / cari session
            if ($sender) {
                $session = ChatbotSession::firstOrCreate(
                    ['session_token' => $sender],
                    ['user_id' => $userId]
                );
            } else {
                $session = ChatbotSession::create([
                    'user_id' => $userId,
                    'session_token' => Str::uuid(),
                ]);
                $sender = $session->session_token;
            }

            // 2️⃣ Simpan pesan user (answer null dulu)
            $chatLog = ChatLog::create([
                'user_id' => $userId,
                'chatbot_session_id' => $session->id,
                'question' => $message,
                'answer' => null,
                'source' => 'user',
            ]);

            // 3️⃣ Panggil Rasa
            $attempt = 0;
            $lastException = null;

            while ($attempt <= $maxRetries) {
                try {
                    $attempt++;

                    $response = Http::timeout($timeout)
                        ->acceptJson()
                        ->post($rasaUrl, [
                            'sender' => $sender,
                            'message' => $message,
                        ]);

                    if ($response->successful()) {
                        $rasaJson = $response->json();
                        $texts = collect($rasaJson)->pluck('text')->filter()->values()->all();
                        $answerText = count($texts) ? implode("\n\n", $texts) : 'Maaf, saya tidak mengerti.';

                        // Simpan jawaban Rasa
                        ChatLog::create([
                            'user_id' => $userId,
                            'chatbot_session_id' => $session->id,
                            'question' => null,
                            'answer' => $answerText,
                            'source' => 'rasa',
                        ]);

                        return response()->json([
                            'ok' => true,
                            'text' => $texts,
                            'session_token' => $session->session_token,
                            'user_id' => $userId, // ✅ Return user_id untuk debug
                        ]);
                    } else {
                        ChatLog::create([
                            'user_id' => $userId,
                            'chatbot_session_id' => $session->id,
                            'question' => null,
                            'answer' => 'Rasa returned non-success status',
                            'source' => 'error',
                        ]);

                        return response()->json([
                            'ok' => false,
                            'error' => 'Rasa returned non-success status',
                            'status' => $response->status(),
                            'body' => $response->body(),
                        ], 500);
                    }
                } catch (\Throwable $e) {
                    $lastException = $e;

                    if ($attempt <= $maxRetries) {
                        usleep(200000); // tunggu 0.2 detik lalu retry
                        continue;
                    }

                    ChatLog::create([
                        'user_id' => $userId,
                        'chatbot_session_id' => $session->id,
                        'question' => null,
                        'answer' => 'Error contacting Rasa: ' . $e->getMessage(),
                        'source' => 'error',
                    ]);
                }
            }

            return response()->json([
                'ok' => false,
                'error' => 'Failed to contact Rasa',
                'exception' => $lastException ? $lastException->getMessage() : 'unknown',
            ], 500);

        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'error' => 'Server Error',
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    // ✅ Helper method untuk guest user
    private function getOrCreateGuestUser()
    {
        $guestUser = \App\Models\User::firstOrCreate([
            'email' => 'guest@system.local'
        ], [
            'name' => 'Guest User',
            'password' => bcrypt('guest123'),
            'email_verified_at' => now()
        ]);
        
        return $guestUser->id;
    }

    public function health()
    {
        return response()->json(['status' => 'ok']);
    }
}
