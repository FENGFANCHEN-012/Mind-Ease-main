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
        Schema::create('sleep_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('bedtime');
            $table->time('wake_time');
            $table->integer('sleep_quality')->nullable(); // e.g., 1-5
            $table->time('sleep_duration')->nullable();
            $table->time("deep_sleep_duration")->nullable();
            $table->string('notes')->nullable();
            $table->string("breath_quality")->nullable();
            $table->timestamps();
        });

    
   

            DB::table('sleep_reports')->insert([
                'user_id' => 1,
                'date' => '2024-01-01',
                'bedtime' => '22:00:00',
                'wake_time' => '06:00:00',
                'sleep_quality' => 4,
                'sleep_duration' => '08:00:00',
                'deep_sleep_duration' => '02:00:00',
                'notes' => 'Felt rested in the morning.',
                'breath_quality' => "good",
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sleep_reports');
      
    }
};
