<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('alarms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('time');
            $table->string('label')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('recurrence')->nullable(); // e.g., "daily", "weekly", "weekdays", "weekends"
            $table->string('music')->nullable(); // Store the music file name or path
            $table->timestamps();
        });

    
   

            DB::table('profiles')->insert([
                'user_id' => 1,
                'location' => json_encode(['city' => 'New York', 'country' => 'USA']),
                'goal' => 'Improve mental health',
                'interests' => json_encode(['meditation', 'journaling']),
                'language' => 'en',
            ]);
    }


    public function down(): void
    {
        Schema::dropIfExists('profiles');
      
    }
  
};
  
