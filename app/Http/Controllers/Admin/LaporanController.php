<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatLog;
use App\Models\ChatbotSession;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class LaporanController extends Controller
{
  public function index(Request $request)
  {
      // Validasi input
      $request->validate([
          'date_from' => 'nullable|date',
          'date_to' => 'nullable|date|after_or_equal:date_from',
      ]);

      // Ambil data chatbot dengan relasi user dan session
      $chatbotReports = $this->getChatbotReportsData($request);
      
      // Ambil data chat admin dengan relasi lengkap
      $chatAdminReports = $this->getChatAdminReportsData($request);

      // Statistik tambahan
      $statistics = $this->generateStatistics($chatbotReports, $chatAdminReports);

      return Inertia::render('Admin/Laporan/Laporan', [
          'chatbotReports' => $chatbotReports,
          'chatAdminReports' => $chatAdminReports,
          'statistics' => $statistics,
          'filters' => [
              'date_from' => $request->date_from,
              'date_to' => $request->date_to,
          ]
      ]);
  }

  /**
   * Public method untuk API endpoint chatbot reports
   */
  public function getChatbotReports(Request $request)
  {
      try {
          // Validasi input
          $request->validate([
              'date_from' => 'nullable|date',
              'date_to' => 'nullable|date|after_or_equal:date_from',
              'limit' => 'nullable|integer|min:1|max:1000',
              'page' => 'nullable|integer|min:1',
          ]);

          // Ambil data chatbot reports
          $chatbotReports = $this->getChatbotReportsData($request);
          
          // Pagination jika diminta
          $limit = $request->get('limit', 50);
          $page = $request->get('page', 1);
          $offset = ($page - 1) * $limit;
          
          $paginatedReports = $chatbotReports->slice($offset, $limit)->values();
          
          // Statistik singkat
          $stats = [
              'total_interactions' => $chatbotReports->count(),
              'unique_sessions' => $chatbotReports->pluck('session_id')->unique()->count(),
              'unique_users' => $chatbotReports->pluck('user_name')->unique()->count(),
              'date_range' => [
                  'from' => $request->date_from,
                  'to' => $request->date_to,
              ],
          ];

          return response()->json([
              'success' => true,
              'data' => $paginatedReports,
              'pagination' => [
                  'current_page' => $page,
                  'per_page' => $limit,
                  'total' => $chatbotReports->count(),
                  'last_page' => ceil($chatbotReports->count() / $limit),
              ],
              'statistics' => $stats,
          ]);

      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'message' => 'Error fetching chatbot reports: ' . $e->getMessage(),
              'error' => config('app.debug') ? $e->getTrace() : null,
          ], 500);
      }
  }

  /**
   * Public method untuk API endpoint chat admin reports
   */
  public function getChatAdminReports(Request $request)
  {
      try {
          // Validasi input
          $request->validate([
              'date_from' => 'nullable|date',
              'date_to' => 'nullable|date|after_or_equal:date_from',
              'limit' => 'nullable|integer|min:1|max:1000',
              'page' => 'nullable|integer|min:1',
          ]);

          // Ambil data chat admin reports
          $chatAdminReports = $this->getChatAdminReportsData($request);
          
          // Pagination jika diminta
          $limit = $request->get('limit', 50);
          $page = $request->get('page', 1);
          $offset = ($page - 1) * $limit;
          
          $paginatedReports = $chatAdminReports->slice($offset, $limit)->values();
          
          // Statistik singkat
          $stats = [
              'total_messages' => $chatAdminReports->count(),
              'admin_messages' => $chatAdminReports->where('sender_type', 'admin')->count(),
              'user_messages' => $chatAdminReports->where('sender_type', 'user')->count(),
              'unique_admins' => $chatAdminReports->where('sender_type', 'admin')->pluck('admin_name')->unique()->filter()->count(),
          ];

          return response()->json([
              'success' => true,
              'data' => $paginatedReports,
              'pagination' => [
                  'current_page' => $page,
                  'per_page' => $limit,
                  'total' => $chatAdminReports->count(),
                  'last_page' => ceil($chatAdminReports->count() / $limit),
              ],
              'statistics' => $stats,
          ]);

      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'message' => 'Error fetching chat admin reports: ' . $e->getMessage(),
              'error' => config('app.debug') ? $e->getTrace() : null,
          ], 500);
      }
  }

  /**
   * Private method untuk mengambil data chatbot reports (renamed dari getChatbotReports)
   */
  private function getChatbotReportsData(Request $request)
  {
      // Query untuk mendapatkan sesi chatbot dengan semua log-nya
      $chatbotSessions = ChatbotSession::with(['user', 'chatLogs'])
          ->whereHas('chatLogs') // Hanya ambil sesi yang memiliki chat logs
          ->when($request->date_from, function($query, $date) {
              return $query->whereDate('created_at', '>=', $date);
          })
          ->when($request->date_to, function($query, $date) {
              return $query->whereDate('created_at', '<=', $date);
          })
          ->latest()
          ->get();

      // Transform data untuk frontend
      $reports = [];
      
      foreach ($chatbotSessions as $session) {
          foreach ($session->chatLogs as $log) {
              $reports[] = [
                  'id' => $log->id,
                  'session_id' => $session->id,
                  'session_token' => $session->session_token,
                  'user_name' => $session->user->name ?? 'Anonim',
                  'user_email' => $session->user->email ?? null,
                  'user_message' => $log->question,
                  'bot_reply' => $log->answer,
                  'created_at' => $log->created_at->format('d-m-Y H:i:s'),
                  'created_at_raw' => $log->created_at->toISOString(),
                  'source' => $log->source ?? 'chatbot',
                  'category' => $this->categorizeMessage($log->question),
              ];
          }
      }

      return collect($reports)->sortByDesc('created_at_raw')->values();
  }

  /**
   * Private method untuk mengambil data chat admin reports (renamed dari getChatAdminReports)
   */
  private function getChatAdminReportsData(Request $request)
  {
      return ChatMessage::with(['session.user', 'sender'])
          ->when($request->date_from, function($query, $date) {
              return $query->whereDate('created_at', '>=', $date);
          })
          ->when($request->date_to, function($query, $date) {
              return $query->whereDate('created_at', '<=', $date);
          })
          ->latest()
          ->get()
          ->map(function ($msg) {
              $isFromAdmin = $msg->sender_type === 'admin';
              
              return [
                  'id' => $msg->id,
                  'user_name' => $msg->session->user->name ?? 'User Tidak Dikenal',
                  'user_email' => $msg->session->user->email ?? null,
                  'message' => $msg->message,
                  'admin_name' => $isFromAdmin ? ($msg->sender->name ?? 'Admin') : null,
                  'sender_type' => $msg->sender_type,
                  'created_at' => $msg->created_at->format('d-m-Y H:i:s'),
                  'created_at_raw' => $msg->created_at->toISOString(),
              ];
          });
  }

  // Method untuk mendapatkan detail sesi chatbot
  public function chatbotSessionDetail($sessionId)
  {
      try {
          $session = ChatbotSession::with(['user', 'chatLogs'])
              ->findOrFail($sessionId);

          $conversation = $session->chatLogs->map(function($log) use ($session) {
              return [
                  'id' => $log->id,
                  'question' => $log->question,
                  'answer' => $log->answer,
                  'source' => $log->source,
                  'created_at' => $log->created_at->format('H:i:s'),
                  'created_at_full' => $log->created_at->format('d-m-Y H:i:s'),
                  'category' => $this->categorizeMessage($log->question),
              ];
          });

          return response()->json([
              'success' => true,
              'session' => [
                  'id' => $session->id,
                  'session_token' => $session->session_token,
                  'user_name' => $session->user->name ?? 'Anonim',
                  'user_email' => $session->user->email ?? null,
                  'created_at' => $session->created_at->format('d-m-Y H:i:s'),
              ],
              'conversation' => $conversation,
              'session_info' => [
                  'user_name' => $session->user->name ?? 'Anonim',
                  'total_messages' => $conversation->count(),
                  'duration' => $this->calculateChatbotSessionDuration($conversation),
                  'categories' => $conversation->pluck('category')->unique()->values(),
              ]
          ]);

      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'message' => 'Session not found or error occurred: ' . $e->getMessage(),
          ], 404);
      }
  }

  private function categorizeMessage($message)
  {
      if (!$message) return 'Umum';

      $categories = [
          'Pendaftaran' => ['daftar', 'registrasi', 'pendaftaran', 'snbp', 'snbt'],
          'Keuangan' => ['biaya', 'ukt', 'bayar', 'beasiswa', 'gratis'],
          'Jadwal' => ['jadwal', 'waktu', 'kapan', 'tanggal', 'deadline'],
          'Persyaratan' => ['syarat', 'dokumen', 'berkas', 'ijazah', 'transkrip'],
          'Jurusan' => ['jurusan', 'prodi', 'fakultas', 'program studi'],
      ];

      $lowerMessage = strtolower($message);
      
      foreach ($categories as $category => $keywords) {
          foreach ($keywords as $keyword) {
              if (str_contains($lowerMessage, $keyword)) {
                  return $category;
              }
          }
      }

      return 'Umum';
  }

  private function generateStatistics($chatbotReports, $chatAdminReports)
  {
      // Total interaksi
      $totalChatbot = $chatbotReports->count();
      $totalChatAdmin = $chatAdminReports->count();
      
      // Unique users
      $chatbotUsers = $chatbotReports->pluck('user_name')->unique();
      $chatAdminUsers = $chatAdminReports->pluck('user_name')->unique();
      $allUsers = $chatbotUsers->merge($chatAdminUsers)->unique();
      
      // Unique sessions
      $uniqueChatbotSessions = $chatbotReports->pluck('session_id')->unique()->count();
      
      // Active admins
      $activeAdmins = $chatAdminReports
          ->where('sender_type', 'admin')
          ->whereNotNull('admin_name')
          ->pluck('admin_name')
          ->unique();

      // FAQ Analysis - pertanyaan yang sering diajukan
      $frequentQuestions = $chatbotReports
          ->groupBy('user_message')
          ->map(function ($group) {
              return [
                  'question' => $group->first()['user_message'],
                  'count' => $group->count(),
              ];
          })
          ->sortByDesc('count')
          ->take(10)
          ->values();

      // Aktivitas harian (7 hari terakhir)
      $dailyActivity = $this->generateDailyActivity($chatbotReports, $chatAdminReports);

      // Response time analysis
      $adminResponseStats = $this->generateAdminStats($chatAdminReports);

      // Session statistics
      $sessionStats = $this->generateSessionStats($chatbotReports);

      return [
          'totals' => [
              'chatbot_interactions' => $totalChatbot,
              'chatbot_sessions' => $uniqueChatbotSessions,
              'admin_chats' => $totalChatAdmin,
              'unique_users' => $allUsers->count(),
              'active_admins' => $activeAdmins->count(),
          ],
          'frequent_questions' => $frequentQuestions,
          'daily_activity' => $dailyActivity,
          'admin_performance' => $adminResponseStats,
          'categories' => $this->categorizeQuestions($chatbotReports),
          'session_stats' => $sessionStats,
      ];
  }

  private function generateSessionStats($chatbotReports)
  {
      $sessionGroups = $chatbotReports->groupBy('session_id');
      
      $sessionStats = $sessionGroups->map(function($sessionLogs) {
          return [
              'session_id' => $sessionLogs->first()['session_id'],
              'user_name' => $sessionLogs->first()['user_name'],
              'total_interactions' => $sessionLogs->count(),
              'categories' => $sessionLogs->pluck('category')->unique()->count(),
              'duration' => $this->calculateSessionDuration($sessionLogs),
              'first_interaction' => $sessionLogs->sortBy('created_at_raw')->first()['created_at'],
              'last_interaction' => $sessionLogs->sortByDesc('created_at_raw')->first()['created_at'],
          ];
      });

      return [
          'total_sessions' => $sessionStats->count(),
          'avg_interactions_per_session' => round($sessionStats->avg('total_interactions'), 2),
          'most_active_sessions' => $sessionStats->sortByDesc('total_interactions')->take(5)->values(),
      ];
  }

  private function generateDailyActivity($chatbotReports, $chatAdminReports)
  {
      $dailyActivity = [];
      for ($i = 6; $i >= 0; $i--) {
          $date = Carbon::now()->subDays($i);
          $dateStr = $date->format('d-m-Y');
          
          $chatbotCount = $chatbotReports->filter(function($item) use ($date) {
              return Carbon::parse($item['created_at_raw'])->isSameDay($date);
          })->count();
          
          $chatAdminCount = $chatAdminReports->filter(function($item) use ($date) {
              return Carbon::parse($item['created_at_raw'])->isSameDay($date);
          })->count();
          
          // Hitung unique sessions untuk chatbot
          $uniqueSessions = $chatbotReports->filter(function($item) use ($date) {
              return Carbon::parse($item['created_at_raw'])->isSameDay($date);
          })->pluck('session_id')->unique()->count();
          
          $dailyActivity[] = [
              'date' => $dateStr,
              'chatbot' => $chatbotCount,
              'chatbot_sessions' => $uniqueSessions,
              'chat_admin' => $chatAdminCount,
              'total' => $chatbotCount + $chatAdminCount
          ];
      }

      return $dailyActivity;
  }

  private function generateAdminStats($chatAdminReports)
  {
      return $chatAdminReports
          ->where('sender_type', 'admin')
          ->whereNotNull('admin_name')
          ->groupBy('admin_name')
          ->map(function ($group) {
              return [
                  'admin_name' => $group->first()['admin_name'],
                  'total_responses' => $group->count(),
                  'avg_daily' => round($group->count() / 7, 2),
              ];
          })
          ->sortByDesc('total_responses')
          ->values();
  }

  private function categorizeQuestions($chatbotReports)
  {
      $categories = [
          'Pendaftaran' => ['daftar', 'registrasi', 'pendaftaran', 'snbp', 'snbt'],
          'Keuangan' => ['biaya', 'ukt', 'bayar', 'beasiswa', 'gratis'],
          'Jadwal' => ['jadwal', 'waktu', 'kapan', 'tanggal', 'deadline'],
          'Persyaratan' => ['syarat', 'dokumen', 'berkas', 'ijazah', 'transkrip'],
          'Jurusan' => ['jurusan', 'prodi', 'fakultas', 'program studi'],
      ];

      $results = [];
      
      foreach ($categories as $category => $keywords) {
          $count = $chatbotReports->filter(function($item) use ($keywords) {
              $message = strtolower($item['user_message'] ?? '');
              return collect($keywords)->some(function($keyword) use ($message) {
                  return str_contains($message, $keyword);
              });
          })->count();
          
          if ($count > 0) {
              $results[] = [
                  'category' => $category,
                  'count' => $count,
                  'percentage' => $chatbotReports->count() > 0 ? 
                      round(($count / $chatbotReports->count()) * 100, 1) : 0,
              ];
          }
      }

      // Tambahkan kategori "Umum"
      $categorizedCount = collect($results)->sum('count');
      $uncategorizedCount = $chatbotReports->count() - $categorizedCount;
      
      if ($uncategorizedCount > 0) {
          $results[] = [
              'category' => 'Umum',
              'count' => $uncategorizedCount,
              'percentage' => $chatbotReports->count() > 0 ? 
                  round(($uncategorizedCount / $chatbotReports->count()) * 100, 1) : 0,
          ];
      }

      return collect($results)->sortByDesc('count')->values();
  }

  private function calculateChatbotSessionDuration($conversation)
  {
      if ($conversation->count() < 2) return '0 menit';
      
      $first = Carbon::parse($conversation->first()['created_at_full']);
      $last = Carbon::parse($conversation->last()['created_at_full']);
      
      $diffInMinutes = $first->diffInMinutes($last);
      
      if ($diffInMinutes < 60) {
          return $diffInMinutes . ' menit';
      } else {
          $hours = floor($diffInMinutes / 60);
          $minutes = $diffInMinutes % 60;
          return $hours . ' jam ' . $minutes . ' menit';
      }
  }

  private function calculateSessionDuration($sessionLogs)
  {
      if ($sessionLogs->count() < 2) return '0 menit';
      
      $first = Carbon::parse($sessionLogs->sortBy('created_at_raw')->first()['created_at_raw']);
      $last = Carbon::parse($sessionLogs->sortByDesc('created_at_raw')->first()['created_at_raw']);
      
      $diffInMinutes = $first->diffInMinutes($last);
      
      if ($diffInMinutes < 60) {
          return $diffInMinutes . ' menit';
      } else {
          $hours = floor($diffInMinutes / 60);
          $minutes = $diffInMinutes % 60;
          return $hours . ' jam ' . $minutes . ' menit';
      }
  }

  // Method untuk export data
  public function export(Request $request)
  {
      try {
          $format = $request->get('format', 'csv');
          
          // Implementasi export bisa ditambahkan di sini
          // Misalnya menggunakan Laravel Excel atau export manual
          
          return response()->json([
              'success' => true,
              'message' => 'Export feature akan segera tersedia',
              'format' => $format,
              'requested_at' => now()->toISOString(),
          ]);
          
      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'message' => 'Export failed: ' . $e->getMessage(),
          ], 500);
      }
  }

  // Method untuk mendapatkan data realtime
  public function realtime()
  {
      try {
          $todayChatbot = ChatLog::whereDate('created_at', today())->count();
          $todayChatbotSessions = ChatbotSession::whereDate('created_at', today())->count();
          $todayChatAdmin = ChatMessage::whereDate('created_at', today())->count();
          $onlineUsers = User::where('last_seen_at', '>=', now()->subMinutes(5))->count();
          
          // Data tambahan untuk realtime monitoring
          $recentActivity = ChatLog::with(['chatbotSession.user'])
              ->latest()
              ->take(5)
              ->get()
              ->map(function($log) {
                  return [
                      'id' => $log->id,
                      'user_name' => $log->chatbotSession->user->name ?? 'Anonim',
                      'question' => substr($log->question, 0, 50) . '...',
                      'created_at' => $log->created_at->diffForHumans(),
                  ];
              });
          
          return response()->json([
              'success' => true,
              'data' => [
                  'today_chatbot' => $todayChatbot,
                  'today_chatbot_sessions' => $todayChatbotSessions,
                  'today_chat_admin' => $todayChatAdmin,
                  'online_users' => $onlineUsers,
                  'recent_activity' => $recentActivity,
              ],
              'timestamp' => now()->toISOString(),
          ]);
          
      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'message' => 'Error fetching realtime data: ' . $e->getMessage(),
          ], 500);
      }
  }

  // Method untuk mendapatkan detail percakapan chat admin
  public function conversationDetail($sessionId)
  {
      try {
          // Existing implementation untuk chat admin
          $conversation = ChatMessage::with(['session.user', 'sender'])
              ->where('chat_session_id', $sessionId)
              ->orderBy('created_at')
              ->get()
              ->map(function($msg) {
                  return [
                      'id' => $msg->id,
                      'message' => $msg->message,
                      'sender_type' => $msg->sender_type,
                      'sender_name' => $msg->sender_type === 'admin' 
                          ? ($msg->sender->name ?? 'Admin') 
                          : ($msg->session->user->name ?? 'User'),
                      'created_at' => $msg->created_at->format('H:i:s'),
                      'created_at_full' => $msg->created_at->format('d-m-Y H:i:s'),
                  ];
              });

          if ($conversation->isEmpty()) {
              return response()->json([
                  'success' => false,
                  'message' => 'Conversation not found',
              ], 404);
          }

          return response()->json([
              'success' => true,
              'conversation' => $conversation,
              'session_info' => [
                  'session_id' => $sessionId,
                  'user_name' => $conversation->first()['sender_name'] ?? 'Unknown',
                  'total_messages' => $conversation->count(),
                  'duration' => $this->calculateConversationDuration($conversation),
                  'participants' => $conversation->pluck('sender_name')->unique()->values(),
              ]
          ]);
          
      } catch (\Exception $e) {
          return response()->json([
              'success' => false,
              'message' => 'Error fetching conversation: ' . $e->getMessage(),
          ], 500);
      }
  }

  private function calculateConversationDuration($conversation)
  {
      if ($conversation->count() < 2) return '0 menit';
      
      $first = Carbon::parse($conversation->first()['created_at_full']);
      $last = Carbon::parse($conversation->last()['created_at_full']);
      
      $diffInMinutes = $first->diffInMinutes($last);
      
      if ($diffInMinutes < 60) {
          return $diffInMinutes . ' menit';
      } else {
          $hours = floor($diffInMinutes / 60);
          $minutes = $diffInMinutes % 60;
          return $hours . ' jam ' . $minutes . ' menit';
      }
  }
}