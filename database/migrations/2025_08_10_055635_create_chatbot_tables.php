<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table chatbot_sessions
        Schema::create('chatbot_sessions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // kalau mau link ke user table
            $table->uuid('session_token')->unique();
            $table->timestamps();

            // Jika ada tabel users, bisa tambahkan:
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Table chat_logs
        Schema::create('chat_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('chatbot_session_id');
            $table->text('question')->nullable();
            $table->text('answer')->nullable();
            $table->string('source')->nullable(); // user / rasa / error
            $table->timestamps();

            // Relasi ke chatbot_sessions
            $table->foreign('chatbot_session_id')
                ->references('id')
                ->on('chatbot_sessions')
                ->onDelete('cascade');

            // Kalau ada tabel users
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_logs');
        Schema::dropIfExists('chatbot_sessions');
    }
};
