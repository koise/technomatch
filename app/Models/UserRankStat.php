<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRankStat extends Model
{
    use HasFactory;

    protected $table = 'user_ranked_stats';

    protected $fillable = [
        'user_id',
        'tier',
        'points',
        'mmr',
        'position',
        'wins',
        'losses',
        'draws',
        'win_streak',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
