<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        $validated = $request->validate([
            // users table
            'name' => 'sometimes|required|string',
            'age' => 'sometimes|nullable|integer',
            'sex' => 'sometimes|nullable|string',
            'phone_number' => 'sometimes|nullable|string',
            'username' => 'sometimes|nullable|string',
            'role' => 'sometimes|nullable|string',
            'ProfilePicture' => 'sometimes|nullable|string',
            'profilePicture' => 'sometimes|nullable|string',

            // profiles table
            'slogan' => 'sometimes|nullable|string',
            'goal' => 'sometimes|nullable|string',
            'language' => 'sometimes|nullable|string',
            'location' => 'sometimes|nullable|array',
            'interests' => 'sometimes|nullable|array',
        ]);

        /** @var \App\Models\User|null $user */
        $user = User::with('profile')->find($id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $userData = collect($validated)->only([
            'name',
            'age',
            'sex',
            'phone_number',
            'username',
            'role',
            'ProfilePicture',
            'profilePicture',
        ])->toArray();

        $profileData = collect($validated)->only([
            'slogan',
            'goal',
            'language',
            'location',
            'interests',
        ])->toArray();

        if (!empty($userData)) {
            // Normalize possible mismatched casing for profile picture
            if (array_key_exists('profilePicture', $userData) && !array_key_exists('ProfilePicture', $userData)) {
                $userData['ProfilePicture'] = $userData['profilePicture'];
                unset($userData['profilePicture']);
            }

            $user->fill($userData);
            $user->save();
        }

        if (!empty($profileData)) {
            $profile = $user->profile;
            if (!$profile) {
                $profile = new Profile();
                $profile->user_id = $user->id;
            }

            $profile->fill($profileData);
            $profile->save();
        }

        $user->load('profile');

        return response()->json([
            'message' => 'Information Set Successfully',
            'user' => array_merge($user->toArray(), [
                // backward compatibility: some clients still expect slogan on user
                'slogan' => $user->profile?->slogan,
            ]),
            'profile' => $user->profile,
        ], 200);
    }

    public function getUserInfo($id) {
        /** @var \App\Models\User|null $user */
        $user = User::with('profile')->find($id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'user' => array_merge($user->toArray(), [
                'slogan' => $user->profile?->slogan,
            ]),
            'profile' => $user->profile,
        ], 200);
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

