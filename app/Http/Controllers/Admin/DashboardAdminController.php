<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatLog;
use App\Models\ChatMessage;
use App\Models\User;
use App\Models\ChatSession;
use App\Models\ChatbotSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardAdminController extends Controller
{
    public function index()
    {
        // Ambil statistik utama dengan caching untuk performa
        $stats = $this->getDashboardStats();
        
        // Ambil aktivitas terbaru (lebih spesifik untuk dashboard)
        $recentActivities = $this->getRecentActivities();
        
        // Data untuk chart/grafik sederhana
        $chartData = $this->getChartData();

        return Inertia::render('Admin/AdminDashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'chartData' => $chartData,
        ]);
    }

    private function getDashboardStats()
    {
        // Cache selama 5 menit untuk performa
        return Cache::remember('admin.dashboard.stats', 300, function() {
            // Total Users (semua user kecuali admin)
            $totalUsers = User::where('role', '!=', 'admin')->count();
            
            // Total Camaba (user yang pernah berinteraksi dengan sistem chatbot atau chat admin)
            $totalCamaba = User::where('role', 'user')
                ->where(function($query) {
                    $query->whereExists(function($subQuery) {
                        $subQuery->select('id')
                                ->from('chatbot_sessions')
                                ->whereColumn('chatbot_sessions.user_id', 'users.id');
                    })
                    ->orWhereExists(function($subQuery) {
                        $subQuery->select('id')
                                ->from('chat_sessions')
                                ->whereColumn('chat_sessions.user_id', 'users.id');
                    });
                })
                ->distinct()
                ->count();
            
            // Chat Aktif - berdasarkan chat sessions yang aktif dalam 24 jam terakhir
            $activeChatSessions = 0;
            
            // Cek dari ChatSession (untuk chat admin) yang aktif dalam 24 jam
            if (class_exists('App\Models\ChatSession')) {
                $activeChatSessions += ChatSession::whereHas('messages', function($query) {
                    $query->where('created_at', '>=', now()->subDay());
                })->count();
            }
            
            // Cek dari ChatbotSession yang aktif dalam 24 jam
            if (class_exists('App\Models\ChatbotSession')) {
                $activeChatSessions += ChatbotSession::whereHas('chatLogs', function($query) {
                    $query->where('created_at', '>=', now()->subDay());
                })->count();
            }

            // Jika tidak ada model session, hitung dari aktivitas chat langsung
            if ($activeChatSessions === 0) {
                // Hitung dari ChatMessage yang aktif dalam 24 jam
                $activeChatFromMessages = ChatMessage::where('created_at', '>=', now()->subDay())
                    ->distinct('chat_session_id')
                    ->count('chat_session_id');
                
                // Hitung dari ChatLog yang aktif dalam 24 jam (asumsi ada session_id)
                $activeChatFromLogs = ChatLog::where('created_at', '>=', now()->subDay())
                    ->when(class_exists('App\Models\ChatbotSession'), function($query) {
                        return $query->join('chatbot_sessions', 'chat_logs.chatbot_session_id', '=', 'chatbot_sessions.id')
                                     ->distinct('chatbot_sessions.id')
                                     ->count('chatbot_sessions.id');
                    }, function($query) {
                        // Fallback jika tidak ada ChatbotSession
                        return $query->distinct('user_id')->count('user_id');
                    });
                
                $activeChatSessions = $activeChatFromMessages + $activeChatFromLogs;
            }

            return [
                'total_users' => $totalUsers,
                'total_camaba' => $totalCamaba,
                'active_chats' => $activeChatSessions,
                'today_stats' => $this->getTodayStats(),
                'growth' => $this->calculateGrowth(),
            ];
        });
    }

    private function getTodayStats()
    {
        $today = today();
        
        return [
            'chatbot_today' => ChatLog::whereDate('created_at', $today)->count(),
            'admin_chat_today' => ChatMessage::whereDate('created_at', $today)->count(),
            'new_users_today' => User::whereDate('created_at', $today)->count(),
            'chatbot_sessions_today' => ChatbotSession::whereDate('created_at', $today)->count(),
        ];
    }

    private function getRecentActivities()
    {
        $activities = collect();

        try {
            // User baru (3 terbaru)
            $newUsers = User::where('role', '!=', 'admin')
                ->latest()
                ->take(2)
                ->get()
                ->map(function($user) {
                    return [
                        'type' => 'new_user',
                        'action' => 'User baru mendaftar',
                        'user' => $user->name,
                        'time' => $user->created_at->diffForHumans(),
                        'icon' => 'Users',
                        'color' => 'text-blue-500',
                        'timestamp' => $user->created_at
                    ];
                });

            // Chat admin terbaru (3 terbaru) - ambil dari pesan user yang memulai chat
            $recentChats = ChatMessage::with(['session.user'])
                ->where('sender_type', 'user')
                ->whereHas('session.user') // Pastikan user masih ada
                ->latest()
                ->take(2)
                ->get()
                ->map(function($msg) {
                    return [
                        'type' => 'chat_started',
                        'action' => 'Chat admin dimulai',
                        'user' => $msg->session->user->name ?? 'User Anonim',
                        'time' => $msg->created_at->diffForHumans(),
                        'icon' => 'MessageCircle',
                        'color' => 'text-purple-500',
                        'timestamp' => $msg->created_at
                    ];
                });

            // Chat bot terbaru (2 terbaru)
            $recentChatbotSessions = ChatbotSession::with(['user', 'chatLogs'])
                ->whereHas('chatLogs')
                ->latest()
                ->take(2)
                ->get()
                ->map(function($session) {
                    $latestLog = $session->chatLogs->sortByDesc('created_at')->first();
                    return [
                        'type' => 'chatbot_interaction',
                        'action' => 'Interaksi dengan AI Chatbot',
                        'user' => $session->user->name ?? 'User Anonim',
                        'time' => $latestLog ? $latestLog->created_at->diffForHumans() : $session->created_at->diffForHumans(),
                        'icon' => 'MessageCircle',
                        'color' => 'text-green-500',
                        'timestamp' => $latestLog ? $latestLog->created_at : $session->created_at
                    ];
                });

            // Gabungkan semua aktivitas
            $activities = $newUsers
                ->merge($recentChats)
                ->merge($recentChatbotSessions)
                ->sortByDesc('timestamp')
                ->take(6)
                ->map(function($item) {
                    // Remove timestamp dari output final
                    unset($item['timestamp']);
                    return $item;
                })
                ->values();

        } catch (\Exception $e) {
            // Fallback jika ada error
            $activities = collect([
                [
                    'type' => 'system',
                    'action' => 'Sistem berjalan normal',
                    'user' => 'System',
                    'time' => 'Baru saja',
                    'icon' => 'Activity',
                    'color' => 'text-green-500'
                ]
            ]);
        }

        return $activities;
    }

    private function getChartData()
    {
        // Data untuk chart 7 hari terakhir
        $chartData = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // Hitung interaksi chatbot
            $chatbotCount = ChatLog::whereDate('created_at', $date)->count();
            
            // Hitung chat admin
            $adminChatCount = ChatMessage::whereDate('created_at', $date)->count();
            
            // Hitung session chatbot baru
            $chatbotSessionCount = ChatbotSession::whereDate('created_at', $date)->count();
            
            // Hitung user baru
            $newUserCount = User::where('role', '!=', 'admin')
                ->whereDate('created_at', $date)
                ->count();
            
            $chartData[] = [
                'date' => $date->format('d/m'),
                'day' => $date->format('l'), // Nama hari
                'chatbot' => $chatbotCount,
                'chatbot_sessions' => $chatbotSessionCount,
                'admin_chat' => $adminChatCount,
                'new_users' => $newUserCount,
                'total' => $chatbotCount + $adminChatCount
            ];
        }

        return $chartData;
    }

    private function calculateGrowth()
    {
        try {
            // Hitung pertumbuhan user bulan ini vs bulan lalu
            $thisMonth = User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->where('role', '!=', 'admin')
                ->count();
                
            $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->where('role', '!=', 'admin')
                ->count();

            $userGrowth = $lastMonth > 0 ? (($thisMonth - $lastMonth) / $lastMonth) * 100 : ($thisMonth > 0 ? 100 : 0);

            // Hitung pertumbuhan chat bulan ini vs bulan lalu (gabungan chatbot + admin)
            $chatThisMonth = ChatLog::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count() + 
                ChatMessage::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
                
            $chatLastMonth = ChatLog::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count() +
                ChatMessage::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count();

            $chatGrowth = $chatLastMonth > 0 ? (($chatThisMonth - $chatLastMonth) / $chatLastMonth) * 100 : ($chatThisMonth > 0 ? 100 : 0);

            // Hitung pertumbuhan session chatbot
            $sessionThisMonth = ChatbotSession::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
                
            $sessionLastMonth = ChatbotSession::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count();

            $sessionGrowth = $sessionLastMonth > 0 ? (($sessionThisMonth - $sessionLastMonth) / $sessionLastMonth) * 100 : ($sessionThisMonth > 0 ? 100 : 0);

            return [
                'users' => round($userGrowth, 1),
                'chats' => round($chatGrowth, 1),
                'sessions' => round($sessionGrowth, 1),
            ];
        } catch (\Exception $e) {
            // Return default values jika ada error
            return [
                'users' => 0,
                'chats' => 0,
                'sessions' => 0,
            ];
        }
    }

    // API endpoint untuk real-time updates
    public function realTimeStats()
    {
        try {
            $data = [
                'active_chats' => $this->getActiveChatCount(),
                'online_users' => $this->getOnlineUserCount(),
                'today_interactions' => $this->getTodayInteractionCount(),
                'today_chatbot_sessions' => ChatbotSession::whereDate('created_at', today())->count(),
                'today_new_users' => User::where('role', '!=', 'admin')->whereDate('created_at', today())->count(),
                'timestamp' => now()->toISOString(),
                'server_time' => now()->format('H:i:s')
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal mengambil data real-time',
                'message' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }
    }

    private function getActiveChatCount()
    {
        // Cek chat yang aktif dalam 10 menit terakhir
        $adminChatCount = ChatMessage::where('created_at', '>=', now()->subMinutes(10))
            ->distinct('chat_session_id')
            ->count('chat_session_id');

        // Cek chatbot sessions yang aktif dalam 10 menit terakhir
        $chatbotActiveCount = ChatLog::where('created_at', '>=', now()->subMinutes(10))
            ->when(class_exists('App\Models\ChatbotSession'), function($query) {
                return $query->join('chatbot_sessions', 'chat_logs.chatbot_session_id', '=', 'chatbot_sessions.id')
                             ->distinct('chatbot_sessions.id')
                             ->count('chatbot_sessions.id');
            }, function($query) {
                return $query->distinct('user_id')->count('user_id');
            });

        return $adminChatCount + $chatbotActiveCount;
    }

    private function getOnlineUserCount()
    {
        // Jika ada field last_seen_at di users table
        if (\Schema::hasColumn('users', 'last_seen_at')) {
            return User::where('last_seen_at', '>=', now()->subMinutes(10))
                ->where('role', '!=', 'admin')
                ->count();
        }
        
        // Alternatif: hitung dari aktivitas chat recent (10 menit terakhir)
        $userFromChatMessages = ChatMessage::where('created_at', '>=', now()->subMinutes(10))
            ->where('sender_type', 'user')
            ->join('chat_sessions', 'chat_messages.chat_session_id', '=', 'chat_sessions.id')
            ->distinct('chat_sessions.user_id')
            ->count('chat_sessions.user_id');

        $userFromChatLogs = ChatLog::where('created_at', '>=', now()->subMinutes(10))
            ->when(class_exists('App\Models\ChatbotSession'), function($query) {
                return $query->join('chatbot_sessions', 'chat_logs.chatbot_session_id', '=', 'chatbot_sessions.id')
                             ->distinct('chatbot_sessions.user_id')
                             ->count('chatbot_sessions.user_id');
            }, function($query) {
                return $query->distinct('user_id')->count('user_id');
            });

        return $userFromChatMessages + $userFromChatLogs;
    }

    private function getTodayInteractionCount()
    {
        $chatLogCount = ChatLog::whereDate('created_at', today())->count();
        $chatMessageCount = ChatMessage::whereDate('created_at', today())->count();
        
        return $chatLogCount + $chatMessageCount;
    }

    // Method untuk clear cache dashboard (jika diperlukan)
    public function clearCache()
    {
        Cache::forget('admin.dashboard.stats');
        
        return response()->json([
            'message' => 'Cache dashboard berhasil dibersihkan',
            'timestamp' => now()->toISOString()
        ]);
    }

    // Method untuk mendapatkan summary quick stats
    public function quickStats()
    {
        return response()->json([
            'total_users_today' => User::where('role', '!=', 'admin')->whereDate('created_at', today())->count(),
            'total_chats_today' => ChatMessage::whereDate('created_at', today())->count() + ChatLog::whereDate('created_at', today())->count(),
            'active_sessions' => $this->getActiveChatCount(),
            'chatbot_sessions_today' => ChatbotSession::whereDate('created_at', today())->count(),
            'response_time' => '< 1 menit', // Bisa dihitung dari data real jika diperlukan
        ]);
    }

    // Method untuk mendapatkan popular questions dari chatbot
    public function getPopularQuestions($limit = 5)
    {
        try {
            $popularQuestions = ChatLog::select('question')
                ->selectRaw('COUNT(*) as count')
                ->whereNotNull('question')
                ->where('question', '!=', '')
                ->groupBy('question')
                ->orderByDesc('count')
                ->limit($limit)
                ->get()
                ->map(function($item) {
                    return [
                        'question' => substr($item->question, 0, 100) . (strlen($item->question) > 100 ? '...' : ''),
                        'count' => $item->count,
                    ];
                });

            return response()->json([
                'success' => true,
                'popular_questions' => $popularQuestions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching popular questions: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Method untuk mendapatkan admin performance
    public function getAdminPerformance()
    {
        try {
            $adminPerformance = ChatMessage::where('sender_type', 'admin')
                ->whereDate('created_at', '>=', now()->subDays(7))
                ->with('sender')
                ->get()
                ->groupBy('sender_id')
                ->map(function($messages, $senderId) {
                    $admin = $messages->first()->sender;
                    return [
                        'admin_name' => $admin ? $admin->name : 'Admin #' . $senderId,
                        'total_responses' => $messages->count(),
                        'avg_per_day' => round($messages->count() / 7, 1),
                        'last_active' => $messages->max('created_at'),
                    ];
                })
                ->sortByDesc('total_responses')
                ->values();

            return response()->json([
                'success' => true,
                'admin_performance' => $adminPerformance,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching admin performance: ' . $e->getMessage(),
            ], 500);
        }
    }
}