<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('chatbot_session_id')->nullable()->after('user_id');

            $table->foreign('chatbot_session_id')
                  ->references('id')
                  ->on('chatbot_sessions')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('chat_logs', function (Blueprint $table) {
            $table->dropForeign(['chatbot_session_id']);
            $table->dropColumn('chatbot_session_id');
        });
    }
};
