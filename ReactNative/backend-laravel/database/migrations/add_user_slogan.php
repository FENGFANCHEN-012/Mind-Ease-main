<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
       
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('slogan')->nullable();
        });

     
        DB::table('profiles')->updateOrInsert(
            ['user_id' => 1],
            [
                'location' => json_encode(['city' => 'New York', 'country' => 'USA']),
                'goal' => 'Improve mental health',
                'interests' => json_encode(['meditation', 'journaling']),
                'language' => 'en',
                'slogan' => 'Your mental health, our priority.',
            ]
        );
    }

    public function down(): void
    {
    
        DB::table('profiles')->where('user_id', 1)->delete();

       
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('slogan');
        });
    }
};