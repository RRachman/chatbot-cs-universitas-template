<?php
// app/Models/ChatbotSession.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatbotSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_token',
        'is_active',
    ];

    public function chatLogs()
    {
        return $this->hasMany(ChatLog::class);
    }

      // ✅ TAMBAHKAN RELASI INI
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
