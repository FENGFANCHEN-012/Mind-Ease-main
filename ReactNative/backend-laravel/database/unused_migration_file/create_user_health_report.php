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
        Schema::create('health_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId("sleep_report_id")->constrained()->onDelete("cascade");
            $table->date('date');
            $table->integer('mood')->nullable(); // e.g., 1-5
            $table->integer('stress_level')->nullable(); // e.g., 1-5
            $table->string('notes')->nullable();
            $table->string("heart_rate_quality")->nullable();
            $table->float("task_performance")->nullable();
            $table->integer('health_index');
   

            $table->timestamps();
        });

    
   

            DB::table('health_reports')->insert([
                'user_id' => 1,
                'sleep_report_id' => 1,
                'date' => '2024-01-01',
                'mood' => 4,
                'stress_level' => 2,
                'notes' => 'Had a good day with some stress at work.',
                'heart_rate_quality' => "good",
                'task_performance' => 0.85,
                'health_index' => 80,
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_reports');
      
    }
};
