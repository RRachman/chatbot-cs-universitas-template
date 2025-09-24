<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KnowledgeApiController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->q;

        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Parameter q wajib diisi.'
            ], 400);
        }

        $knowledge = KnowledgeBase::where('is_active', true)->get();

        // Preprocessing semua pertanyaan
        $documents = $knowledge->map(function ($item) {
            return [
                'id' => $item->id,
                'pertanyaan' => strtolower($item->pertanyaan),
                'jawaban' => $item->jawaban,
                'kategori' => $item->kategori,
                'entity' => $item->entity,
            ];
        });

        // Gabungkan semua dokumen
        $queryTokens = $this->tokenize($query);
        $docTokens = $documents->map(fn ($doc) => $this->tokenize($doc['pertanyaan']));

        // Buat kumpulan kata unik
        $vocab = collect($docTokens->flatten()->merge($queryTokens))->unique()->values();

        // Hitung TF-IDF dan Cosine Similarity
        $queryVector = $this->tfidf($queryTokens, $docTokens, $vocab);
        $scores = $docTokens->map(function ($tokens, $i) use ($queryVector, $docTokens, $vocab) {
            $docVector = $this->tfidf($tokens, $docTokens, $vocab);
            return $this->cosineSimilarity($queryVector, $docVector);
        });

        $bestIndex = $scores->search($scores->max());

        if ($scores[$bestIndex] >= 0.3) {
            $match = $documents[$bestIndex];
            return response()->json([
                'success' => true,
                'data' => [$match]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }

    private function tokenize($text)
    {
        return collect(preg_split('/\s+/', strtolower($text)))
            ->map(fn($word) => trim(preg_replace('/[^a-z0-9]/', '', $word)))
            ->filter()
            ->values();
    }

    private function tf($tokens, $term)
    {
        $count = $tokens->filter(fn($t) => $t === $term)->count();
        return $count / max(1, $tokens->count());
    }

    private function idf($term, $allDocs)
    {
        $docCount = $allDocs->filter(fn($doc) => $doc->contains($term))->count();
        return log(($allDocs->count() + 1) / ($docCount + 1));
    }

    private function tfidf($tokens, $allDocs, $vocab)
    {
        return $vocab->map(function ($term) use ($tokens, $allDocs) {
            return $this->tf($tokens, $term) * $this->idf($term, $allDocs);
        });
    }

    private function cosineSimilarity($vecA, $vecB)
    {
        $dotProduct = $vecA->zip($vecB)->reduce(fn($carry, $pair) => $carry + ($pair[0] * $pair[1]), 0);
        $magnitudeA = sqrt($vecA->reduce(fn($c, $v) => $c + $v * $v, 0));
        $magnitudeB = sqrt($vecB->reduce(fn($c, $v) => $c + $v * $v, 0));
        return $magnitudeA && $magnitudeB ? $dotProduct / ($magnitudeA * $magnitudeB) : 0.0;
    }


}




// namespace App\Http\Controllers\Api;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Log;

// class KnowledgeApiController extends Controller
// {
//     /**
//      * 🤖 Main endpoint untuk RASA chatbot
//      */
//     public function getKBForRasa(Request $request)
//     {
//         try {
//             $startTime = microtime(true);
//             $startMemory = memory_get_usage(true);
            
//             $question = $request->input('question', '');
//             $limit = $request->input('limit', 5);
            
//             if (empty($question)) {
//                 return response()->json([
//                     'status' => 'error',
//                     'message' => 'Question parameter is required',
//                     'data' => []
//                 ], 400);
//             }

//             // 🔍 Search dengan similarity matching
//             $results = DB::table('knowledge_bases')
//                 ->select('id', 'pertanyaan', 'jawaban', 'kategori')
//                 ->where(function($query) use ($question) {
//                     $keywords = explode(' ', strtolower($question));
//                     foreach ($keywords as $keyword) {
//                         if (strlen($keyword) > 2) {
//                             $query->orWhere('pertanyaan', 'LIKE', "%{$keyword}%")
//                                   ->orWhere('jawaban', 'LIKE', "%{$keyword}%")
//                                   ->orWhere('kategori', 'LIKE', "%{$keyword}%");
//                         }
//                     }
//                 })
//                 ->limit($limit)
//                 ->get();

//             $endTime = microtime(true);
//             $endMemory = memory_get_usage(true);

//             return response()->json([
//                 'status' => 'success',
//                 'query' => $question,
//                 'total_found' => $results->count(),
//                 'data' => $results,
//                 'performance' => [
//                     'response_time_ms' => round(($endTime - $startTime) * 1000, 2),
//                     'memory_used_mb' => round(($endMemory - $startMemory) / 1024 / 1024, 2)
//                 ],
//                 'timestamp' => now()->toISOString()
//             ]);

//         } catch (\Exception $e) {
//             Log::error('KnowledgeAPI Error: ' . $e->getMessage());
            
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Internal server error',
//                 'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
//             ], 500);
//         }
//     }

//     /**
//      * 📊 Get all knowledge base (untuk admin)
//      */
//     public function getKB(Request $request)
//     {
//         try {
//             $page = $request->input('page', 1);
//             $limit = $request->input('limit', 10);
//             $category = $request->input('category', '');

//             $query = DB::table('knowledge_bases');

//             if (!empty($category)) {
//                 $query->where('kategori', $category);
//             }

//             $total = $query->count();
//             $results = $query->orderBy('id', 'desc')
//                            ->offset(($page - 1) * $limit)
//                            ->limit($limit)
//                            ->get();

//             return response()->json([
//                 'status' => 'success',
//                 'data' => $results,
//                 'pagination' => [
//                     'current_page' => $page,
//                     'per_page' => $limit,
//                     'total' => $total,
//                     'last_page' => ceil($total / $limit)
//                 ],
//                 'timestamp' => now()->toISOString()
//             ]);

//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Failed to fetch knowledge base',
//                 'error' => config('app.debug') ? $e->getMessage() : null
//             ], 500);
//         }
//     }

//     /**
//      * 🏥 Health check endpoint
//      */
//     public function health()
//     {
//         try {
//             $dbStatus = DB::connection()->getPdo() ? 'connected' : 'disconnected';
//             $tableExists = DB::getSchemaBuilder()->hasTable('knowledge_bases');
//             $recordCount = $tableExists ? DB::table('knowledge_bases')->count() : 0;

//             return response()->json([
//                 'status' => 'healthy',
//                 'database' => $dbStatus,
//                 'table_exists' => $tableExists,
//                 'total_records' => $recordCount,
//                 'timestamp' => now()->toISOString()
//             ]);

//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'unhealthy',
//                 'error' => $e->getMessage(),
//                 'timestamp' => now()->toISOString()
//             ], 500);
//         }
//     }

//     /**
//      * 🔍 Search endpoint
//      */
//     public function search(Request $request)
//     {
//         try {
//             $query = $request->input('q', '');
//             $category = $request->input('category', '');
//             $limit = $request->input('limit', 10);

//             if (empty($query)) {
//                 return response()->json([
//                     'status' => 'error',
//                     'message' => 'Search query is required'
//                 ], 400);
//             }

//             $searchQuery = DB::table('knowledge_bases')
//                 ->select('id', 'pertanyaan', 'jawaban', 'kategori');

//             if (!empty($category)) {
//                 $searchQuery->where('kategori', $category);
//             }

//             $results = $searchQuery->where(function($q) use ($query) {
//                     $q->where('pertanyaan', 'LIKE', "%{$query}%")
//                       ->orWhere('jawaban', 'LIKE', "%{$query}%");
//                 })
//                 ->limit($limit)
//                 ->get();

//             return response()->json([
//                 'status' => 'success',
//                 'query' => $query,
//                 'category_filter' => $category,
//                 'total_found' => $results->count(),
//                 'results' => $results,
//                 'timestamp' => now()->toISOString()
//             ]);

//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Search failed',
//                 'error' => config('app.debug') ? $e->getMessage() : null
//             ], 500);
//         }
//     }

//     /**
//      * 📈 Statistics endpoint
//      */
//     public function stats()
//     {
//         try {
//             $totalRecords = DB::table('knowledge_bases')->count();
//             $categories = DB::table('knowledge_bases')
//                 ->select('kategori', DB::raw('count(*) as count'))
//                 ->groupBy('kategori')
//                 ->get();

//             return response()->json([
//                 'status' => 'success',
//                 'statistics' => [
//                     'total_records' => $totalRecords,
//                     'categories' => $categories,
//                     'last_updated' => DB::table('knowledge_bases')
//                         ->orderBy('updated_at', 'desc')
//                         ->first(['updated_at'])->updated_at ?? null
//                 ],
//                 'timestamp' => now()->toISOString()
//             ]);

//         } catch (\Exception $e) {
//             return response()->json([
//                 'status' => 'error',
//                 'message' => 'Failed to get statistics',
//                 'error' => config('app.debug') ? $e->getMessage() : null
//             ], 500);
//         }
//     }
// }
