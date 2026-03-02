<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\UserModel;

class UserController extends Controller
{
    
    public function index()
    {
        return response()->json(User::all());
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user, 201);
    }

    
     public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function updateUserInfo(Request $request, $id) {
        $request->validate([
            'username' => 'required|string',
            'age' => 'required|integer',
            'gender' => 'required|string',
        ]);
        $result = UserModel::updateUser($id, $request->username, $request->gender, $request->age);
        if ($result) {
            return response()->json([
                'message' => 'Information Set Successfully',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Failed to update user information',   
            ], 500);    
        }
    }


}

class ProfileController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }
}

