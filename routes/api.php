<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KnowledgeApiController;
use App\Http\Controllers\Api\ChatbotController;

// ==========================
// ROUTE BEBAS AKSES (PUBLIC)
// ==========================

Route::get('/knowledge', [KnowledgeApiController::class, 'index']);

Route::get('/knowledge/{id}', [KnowledgeApiController::class, 'show']);
Route::post('/chatbot/ask', [ChatbotController::class, 'ask']);
Route::get('/debug/rasa-conn', [ChatbotController::class, 'debugRasa']);



// Contoh route public sederhana
Route::get('/ping', function () {
    return response()->json(['message' => 'API aktif!']);
});

Route::get('/chatbot/health', function () {
    return response()->json(['status' => 'ok']);
});







// // 🤖 CHATBOT ROUTES
// Route::prefix('chatbot')->group(function () {


//     // ✅ TAMBAH INI - ROUTE CHAT YANG HILANG
//     Route::post('/chat', [ChatbotController::class, 'chat']);
//     Route::get('/getKnowledgeBase', [ChatbotController::class, 'getKnowledgeBase']);

//     Route::post('/chat', [ChatbotController::class, 'chat']);
// });






// // 🔧 PERFORMANCE HELPER FUNCTION (define once only)
// if (!function_exists('getPerformanceRecommendations')) {
//     function getPerformanceRecommendations($profile) {
//         $recommendations = [];

//         // Memory recommendations
//         if (isset($profile['memory_usage']['peak_real'])) {
//             $memoryMB = $profile['memory_usage']['peak_real'] / 1024 / 1024;
            
//             if ($memoryMB > 100) {
//                 $recommendations[] = [
//                     'type' => 'memory',
//                     'level' => 'warning',
//                     'message' => "High memory usage: {$memoryMB}MB. Consider optimizing queries or using pagination.",
//                     'suggestion' => 'Reduce query limit or implement caching'
//                 ];
//             }
//         }

//         // Response time recommendations
//         if (isset($profile['response_time_ms'])) {
//             if ($profile['response_time_ms'] > 5000) {
//                 $recommendations[] = [
//                     'type' => 'performance',
//                     'level' => 'error',
//                     'message' => "Very slow response: {$profile['response_time_ms']}ms",
//                     'suggestion' => 'Check database indexes and query optimization'
//                 ];
//             } elseif ($profile['response_time_ms'] > 2000) {
//                 $recommendations[] = [
//                     'type' => 'performance',
//                     'level' => 'warning',
//                     'message' => "Slow response: {$profile['response_time_ms']}ms",
//                     'suggestion' => 'Consider implementing caching or query optimization'
//                 ];
//             }
//         }

//         return $recommendations;
//     }



