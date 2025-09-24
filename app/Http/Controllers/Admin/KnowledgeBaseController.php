<?php
// namespace App\Http\Controllers\Admin;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use App\Models\KnowledgeBase;
// use Inertia\Inertia;


// class KnowledgeBaseController extends Controller
// {
//     public function index()
//     {
//         $knowledge = KnowledgeBase::latest()->get();

//        return Inertia::render('Admin/KnowledgeBase/IndexKnowledge', [
//                   'knowledge' => $knowledge, // <-- data dikirim ke React
//         ]);
//     }

//     public function create()
//     {
//         return Inertia::render('Admin/KnowledgeBase/CreateKnowledge');
//     }

//     public function store(Request $request)
//     {
//         $request->validate([
//             'pertanyaan' => 'required|string|max:255',
//             'jawaban' => 'required|string',
//             'kategori' => 'required|string|max:100',
//         ]);

//         KnowledgeBase::create($request->only(['pertanyaan', 'jawaban', 'kategori']));

//         return redirect()->route('admin.knowledge.index')->with('success', 'Data berhasil ditambahkan');
//     }

//     public function edit($id)
//     {
//         $item = KnowledgeBase::findOrFail($id);

//         return Inertia::render('Admin/KnowledgeBase/EditKnowledge', [
//             'item' => $item
//         ]);
//     }

//     public function update(Request $request, $id)
//     {
//         $request->validate([
//             'pertanyaan' => 'required|string|max:255',
//             'jawaban' => 'required|string',
//             'kategori' => 'required|string|max:100',
//         ]);

//         $item = KnowledgeBase::findOrFail($id);
//         $item->update($request->only(['pertanyaan', 'jawaban', 'kategori']));

//         return redirect()->route('admin.knowledge.index')->with('success', 'Data berhasil diperbarui');
//     }

//     public function destroy($id)
//     {
//         $item = KnowledgeBase::findOrFail($id);
//         $item->delete();

//         return redirect()->route('admin.knowledge.index')->with('success', 'Data berhasil dihapus');
//     }
  
// }


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KnowledgeBase;
use Inertia\Inertia;

class KnowledgeBaseController extends Controller
{
    public function index()
    {
        $knowledge = KnowledgeBase::latest()->get();

        return Inertia::render('Admin/KnowledgeBase/IndexKnowledge', [
            'knowledge' => $knowledge, // <-- data dikirim ke React
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/KnowledgeBase/CreateKnowledge');
    }

    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban'    => 'required|string',
            'kategori'   => 'required|string|max:100',
            'entity'     => 'nullable|array',    // Tambahan untuk entity (array)
            'is_active'  => 'nullable|boolean',  // Tambahan untuk is_active (boolean)
        ]);

        KnowledgeBase::create([
            'pertanyaan' => $request->pertanyaan,
            'jawaban'    => $request->jawaban,
            'kategori'   => $request->kategori,
            'entity'     => $request->entity ?? [],      // Default array kosong jika tidak diisi
            'is_active'  => $request->is_active ?? true, // Default true jika tidak diisi
        ]);

        return redirect()->route('admin.knowledge.index')->with('success', 'Data berhasil ditambahkan');
    }

    public function edit($id)
    {
        $item = KnowledgeBase::findOrFail($id);

        return Inertia::render('Admin/KnowledgeBase/EditKnowledge', [
            'item' => $item
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'pertanyaan' => 'required|string|max:255',
            'jawaban'    => 'required|string',
            'kategori'   => 'required|string|max:100',
            'entity'     => 'nullable|array',    // Tambahan untuk entity (array)
            'is_active'  => 'nullable|boolean',  // Tambahan untuk is_active (boolean)
        ]);

        $item = KnowledgeBase::findOrFail($id);
        $item->update([
            'pertanyaan' => $request->pertanyaan,
            'jawaban'    => $request->jawaban,
            'kategori'   => $request->kategori,
            'entity'     => $request->entity ?? [],
            'is_active'  => $request->is_active ?? true,
        ]);

        return redirect()->route('admin.knowledge.index')->with('success', 'Data berhasil diperbarui');
    }

    public function destroy($id)
    {
        $item = KnowledgeBase::findOrFail($id);
        $item->delete();

        return redirect()->route('admin.knowledge.index')->with('success', 'Data berhasil dihapus');
    }
}
