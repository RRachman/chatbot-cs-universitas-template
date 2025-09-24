<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return inertia('Auth/Login');
    }

    public function store(Request $request)
    {
        // validasi sederhana
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            if ($request->header('X-Inertia')) {
                return Inertia::render('Auth/Login', [
                    'errors' => [
                        'email' => 'Username atau password salah.',
                    ],
                    'auth' => ['user' => null],
                ])->toResponse($request)->setStatusCode(422);
            }

            return back()->withErrors(['email' => 'Username atau password salah.']);
        }

        // regenerate session setelah berhasil login
        $request->session()->regenerate();

        $user = Auth::user();

        // kalau ada relasi role, muat (tidak fatal kalau tidak ada)
        if (method_exists($user, 'role')) {
            $user->loadMissing('role');
        }

        // tentukan nama role dengan beberapa fallback
        $roleName = null;

        if (!empty($user->role)) {
            // relasi Role model: coba atribut umum
            $roleName = $user->role->nama_role ?? $user->role->name ?? null;
        }

        // fallback ke kolom langsung di users (jika ada)
        $roleName = $roleName ?? $user->role ?? $user->role_name ?? null;

        // atau fallback pakai role_id (jika Anda tahu id 1 = admin)
        $isAdmin = false;
        if (!empty($roleName)) {
            $isAdmin = strtolower($roleName) === 'admin';
        } elseif (isset($user->role_id)) {
            $isAdmin = intval($user->role_id) === 1; // ubah angka 1 kalau di DB beda
        }

        // Redirect sesuai role — gunakan route bernama bila ada, atau path fallback
        if ($isAdmin) {
            // jika route bernama admin.dashboard ada, pakai itu; kalau tidak pakai URL
            if (app('router')->has('admin.dashboard')) {
                return redirect()->intended(route('admin.dashboard'));
            }
            return redirect()->intended('/admin/dashboard');
        }

        if (app('router')->has('dashboard')) {
            return redirect()->intended(route('dashboard'));
        }

        return redirect()->intended('/dashboard');
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
