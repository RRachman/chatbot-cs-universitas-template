<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('knowledge_bases', function (Blueprint $table) {
        $table->json('entity')->change();
    });
}
public function down()
{
    Schema::table('knowledge_bases', function (Blueprint $table) {
        $table->text('entity')->change();
    });
}

};
