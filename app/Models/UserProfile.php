<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $table = 'user_profiles';

    protected $fillable = [
        'user_id',
        'avatar_path',
        'rank_title',
        'online_status',
        'last_active',
        'preferred_font',
        'dark_mode',
    ];

    protected $attributes = [
        'avatar_path'   => '/avatar/default-7.svg',
        'online_status' => 'offline',
        'preferred_font'=> 'System UI',
        'dark_mode'     => 0,
    ];

    protected $casts = [
        'dark_mode' => 'boolean',
        'last_active' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
