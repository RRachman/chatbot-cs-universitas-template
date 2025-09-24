<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\KnowledgeBaseController;
use App\Http\Controllers\Api\KnowledgeApiController;
use App\Http\Controllers\ChatAdminController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Auth\GoogleLoginController;


/*
|--------------------------------------------------------------------------
| ⛔ Redirect Halaman Utama ke Login
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| 🏠 Dashboard User Camaba
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Camaba/CamabaDashboard', [
            'auth' => [
                'user' => Auth::user()
            ],
            'totalUsers' => \App\Models\User::count(),
        ]);
    })->name('dashboard');

    Route::get('/camaba/chatbot', function () {
        return Inertia::render('Camaba/Chatbot');
    })->name('Camaba.chatbot');

    Route::get('/chat', function () {
        return Inertia::render('Chatbot');
    });
});

 
    /*
    |--------------------------------------------------------------------------
    | 🛠️ Admin Routes (prefix: /admin)
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->name('admin.')->group(function () {

        // Admin Dashboard
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/AdminDashboard', [
                'auth' => [
                    'user' => Auth::user()
                ],
                'totalUsers' => \App\Models\User::count(),
            ]);
        })->name('dashboard');


    // User Management - Simple POST Routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::post('/users/{user}/update', [UserController::class, 'update'])->name('users.update');
    Route::post('/users/{user}/delete', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggleStatus');


        // Knowledge Base Management - Simple POST Routes
    Route::get('/knowledge', [KnowledgeBaseController::class, 'index'])->name('knowledge.index');
    Route::post('/knowledge', [KnowledgeBaseController::class, 'store'])->name('knowledge.store');
    Route::post('/knowledge/{knowledge}/update', [KnowledgeBaseController::class, 'update'])->name('knowledge.update');
    Route::post('/knowledge/{knowledge}/delete', [KnowledgeBaseController::class, 'destroy'])->name('knowledge.destroy');
    });

  Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/laporan', [LaporanController::class, 'index'])->name('admin.laporan.index');
});


    Route::middleware(['auth'])->prefix('admin')->group(function () {
        
        Route::get('/laporan', [LaporanController::class, 'index'])->name('admin.laporan.index');
        
        Route::post('/laporan/export', [LaporanController::class, 'export'])->name('admin.laporan.export');
        
        Route::get('/laporan/realtime', [LaporanController::class, 'realtime'])->name('admin.laporan.realtime');
        
        Route::get('/laporan/conversation/{sessionId}', [LaporanController::class, 'conversationDetail'])
            ->name('admin.laporan.conversation');
            
        Route::get('/laporan/filter', [LaporanController::class, 'index'])->name('admin.laporan.filter');
    });


Route::middleware(['auth'])->group(function () {
    // Main chat routes - hanya perlu ini saja untuk Inertia
    Route::get('/chat-admin/{sessionId?}', [ChatAdminController::class, 'index'])->name('chat-admin.index');
    Route::post('/chat-admin/send', [ChatAdminController::class, 'sendMessage'])->name('chat-admin.send');
});
/*
|--------------------------------------------------------------------------
| 🔐 Auth Routes (login, register, forgot password, dll)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| 👤 Manajemen Profil
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| 🔓 Logout Route
|--------------------------------------------------------------------------
*/
Route::post('/logout', function (Request $request) {
    auth()->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');



//login google
Route::get('/auth/google/redirect', [GoogleLoginController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleLoginController::class, 'callback']);

