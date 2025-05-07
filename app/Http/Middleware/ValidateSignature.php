<?php

namespace App\Http\Middleware;

use Illuminate\Routing\Middleware\ValidateSignature as Middleware;

class ValidateSignature extends Middleware
{
    /**
     * The names of the query string parameters that should be ignored.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Parameters that should be excluded from the signature verification
        'fbclid',
        'utm_campaign',
        'utm_medium',
        'utm_source',
        'utm_content',
        'utm_term',
    ];
} 