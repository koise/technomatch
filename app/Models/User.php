<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'role',
        'email',
        'email_verified',
        'verify_at',
        'username',
        'password',
        'school',
        'programming_language',
        'bio',
        'display_title_id',
        'active_contest_key_id',
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'verify_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function displayTitle()
    {
        return $this->belongsTo(DisplayTitle::class, 'display_title_id');
    }

    public function activeContest()
    {
        return $this->belongsTo(Contest::class, 'active_contest_key_id');
    }
}
