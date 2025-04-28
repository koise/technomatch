<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    use HasFactory;
    protected $table = 'email_verifications';
    protected $fillable = [
        'user_id',
        'email',
        'verification_code',
        'is_verified',
        'sent_at',
        'verified_at',
        'expires_at',
        'attempts',
        'created_at',
        'updated_at',
    ];

 
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $casts = [
        'sent_at' => 'datetime',
        'verified_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_verified' => 'boolean',
    ];
}
