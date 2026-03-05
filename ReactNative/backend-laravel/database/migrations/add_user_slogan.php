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

            DB::table('profiles')->addColumn('slogan', 'string', ['nullable' => true]);
        
            DB::table('profiles')->insert([
                'user_id' => 1,
                'location' => json_encode(['city' => 'New York', 'country' => 'USA']),
                'goal' => 'Improve mental health',
                'interests' => json_encode(['meditation', 'journaling']),
                'language' => 'en',
                'slogan' => "Your mental health, our priority.",
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
