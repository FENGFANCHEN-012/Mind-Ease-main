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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('location')->nullable();
            $table->string('goal')->nullable();
            $table->json('interests')->nullable();
            $table->string('language')->default('en');
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
      
    }
};
