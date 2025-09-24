<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
{

public function index()
{
    $users = User::with('role')->get(); // Pastikan relasi role ikut di-load
    $roles = Role::all();
    
    return Inertia::render('Admin/Users/IndexUser', [
        'users' => $users,
        'roles' => $roles,
        'routes' => [
            'updateUser' => route('admin.users.update', ['user' => '__user_id__']),
            'storeUser' => route('admin.users.store'),
            'toggleStatus' => route('admin.users.toggleStatus', ['user' => '__user_id__']),
        ]
    ]);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'status' => 'aktif',
        ]);

        
        return redirect()->back()->with('success', 'User berhasil ditambahkan');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->back()->with('success', 'User berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User berhasil dihapus');
    }

    public function toggleStatus(User $user)
    {
        try {
            $newStatus = $user->status === 'aktif' ? 'nonaktif' : 'aktif';
            $user->status = $newStatus;
            $user->save();

            return redirect()->back()->with('success', 'Status user berhasil diubah');
            
        } catch (\Exception $e) {
            Log::error('Error toggling user status: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengubah status user');
        }
    }
}

