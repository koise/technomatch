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
        'email_verified_at',
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
        'email_verified_at' => 'datetime',
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

    public function userProfile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function userRankStat()
    {
        return $this->hasOne(UserRankStat::class);
    }

    public function userProgressiveStat()
    {
        return $this->hasOne(UserProgressiveStat::class);
    }

    /**
     * Get the friendships where this user is the initiator
     */
    public function friendsOfMine()
    {
        return $this->hasMany(Friend::class, 'user_id');
    }

    /**
     * Get the friendships where this user is the friend
     */
    public function friendOf()
    {
        return $this->hasMany(Friend::class, 'friend_id');
    }

    /**
     * Get all friend requests sent by this user
     */
    public function sentFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    /**
     * Get all friend requests received by this user
     */
    public function receivedFriendRequests()
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id');
    }

    /**
     * Get all friends of the user (combines friendsOfMine and friendOf)
     */
    public function friends()
    {
        return $this->friendsOfMine->pluck('friend')
            ->merge($this->friendOf->pluck('user'));
    }

    /**
     * Check if a user is friends with another user
     */
    public function isFriendsWith(User $user)
    {
        return $this->friendsOfMine()->where('friend_id', $user->id)->exists()
            || $this->friendOf()->where('user_id', $user->id)->exists();
    }

    /**
     * Check if the user has verified their email
     */
    public function hasVerifiedEmail()
    {
        return $this->email_verified;
    }

    /**
     * Mark the user's email as verified
     */
    public function markEmailAsVerified()
    {
        return $this->forceFill([
            'email_verified' => true,
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }
}
