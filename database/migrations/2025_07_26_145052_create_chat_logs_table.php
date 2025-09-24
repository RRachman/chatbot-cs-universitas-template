<?php

// database/migrations/xxxx_xx_xx_create_chat_logs_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChatLogsTable extends Migration
{
    public function up()
    {
        Schema::create('chat_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // user/camaba yang bertanya
            $table->text('question');  // pertanyaan dari user
            $table->text('answer')->nullable();  // jawaban dari chatbot
            $table->string('source')->default('local'); // local (dari knowledge base) / rasa (NLP)
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('chat_logs');
    }
}

