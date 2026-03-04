<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recommended_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('task_name');
            $table->text('description')->nullable();
            $table->boolean('completed')->default(false);
            $table->date('due_date')->nullable();
            $table->time('due_time')->nullable();
            $table->integer('frequency')->default(1); // e.g., 1-5
            $table->timestamps();
        });

    
   

            DB::table('recommended_tasks')->insert([
                'task_name' => 'Morning Meditation',
                'description' => 'Practice 10 minutes of meditation in the morning.',
                'completed' => false,
                'due_date' => '2024-01-01',
                'due_time' => '07:00:00',
                'frequency' => 3,
            ]);
            
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommended_tasks');
      
    }
};
