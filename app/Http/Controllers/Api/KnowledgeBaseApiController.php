<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KnowledgeBase;



class KnowledgeBaseApiController extends Controller
{
     public function index(Request $request)
    {
        dd('masuk');
        $query = KnowledgeBase::query();

        // Optional filter
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }
        if ($request->has('q')) {
            $query->where('pertanyaan', 'like', '%' . $request->q . '%');
        }

        $knowledge = $query->latest()->get();

        // Konsistensi atribut
        $knowledge = $knowledge->map(function ($item) {
            return [
                'id'         => $item->id,
                'pertanyaan' => $item->pertanyaan ?? '',
                'jawaban'    => $item->jawaban ?? '',
                'kategori'   => $item->kategori ?? '',
                'entity'     => is_array($item->entity) ? $item->entity : [],
                'intent'     => $item->intent ?? '',
                'is_active'  => (bool) $item->is_active,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $knowledge
        ]);
    }

    // GET /api/knowledge/{id}
    public function show($id)
    {
        $item = KnowledgeBase::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
                'data' => null
            ], 404);
        }

        // Konsistensi atribut
        $data = [
            'id'         => $item->id,
            'pertanyaan' => $item->pertanyaan ?? '',
            'jawaban'    => $item->jawaban ?? '',
            'kategori'   => $item->kategori ?? '',
            'entity'     => is_array($item->entity) ? $item->entity : [],
            'intent'     => $item->intent ?? '',
            'is_active'  => (bool) $item->is_active,
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
