<?php
/*

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;



return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('alarm_id')->constrained()->onDelete('cascade');
            $table->string('goal')->nullable();
             $table->integer('priority')->default(1); // e.g., 1-5
            $table->string('description')->nullable();
            $table->string("label");
            $table->boolean('is_completed')->default(false);
            $table->date('due_date');
            $table->time('due_time');
            $table->timestamps();
        });
    }

 
    public function down(): void
    {
        Schema::dropIfExists('goals');
      
    }
};
    */