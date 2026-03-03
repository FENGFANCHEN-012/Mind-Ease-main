<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class UserModel extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'sex',
        'username',
        'ProfilePicture',
        'role',
        'phone_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function updateUser($id, $username, $gender, $age) {

        $sql = "
            UPDATE users
            SET username = :username,
                gender = :gender,
                age = :age
            WHERE id = :id
        ";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":username" => $username,
            ":gender" => $gender,
            ":age" => $age,
            ":id" => $id,
            ":first_login" => false
        ]);
    }

    public function getUserInfo($id) {
        $sql = "SELECT username, gender, age, phone_number,sex,slogan,ProfilePicture FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([":id" => $id]);
        return $stmt->fetch();
    
    }    
    
    
    
    
    }
