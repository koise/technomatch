<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'first_name', 
        'last_name', 
        'role', 
        'email', 
        'email_verified', 
        'verify_at', 
        'username', 
        'password', 
        'remember_token', 
        'school', 
        'programming_language', 
        'bio'
    ];

    protected $dates = [
        'verify_at', 
        'created_at', 
        'updated_at'
    ];

    protected $hidden = [
        'password', 
        'remember_token',
    ];

    // Optional: add casts
    protected $casts = [
        'email_verified' => 'boolean',
    ];
}
