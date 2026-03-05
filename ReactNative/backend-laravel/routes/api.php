<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/login', [UserController::class, 'login']);
Route::post('/user/signup',[UserController::class ,'store']);
Route::get('/users/info/{id}', [UserController::class, 'getUserInfo']);
Route::match(['put', 'patch'], '/user/update/{id}', [UserController::class, 'updateUserInfo']);


Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});
