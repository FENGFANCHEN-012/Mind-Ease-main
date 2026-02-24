<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/login', [UserController::class, 'login']);
Route::post('/user/signup',[UserController::class ,'store']);

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});
