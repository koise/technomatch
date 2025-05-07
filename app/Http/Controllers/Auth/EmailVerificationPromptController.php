<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerification;
use App\Models\User;
use App\Services\PHPMailService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EmailVerificationPromptController extends Controller
{
    protected $mailService;

    public function __construct(PHPMailService $mailService)
    {
        $this->mailService = $mailService;
    }

    /**
     * Show the email verification prompt.
     */
    public function __invoke(Request $request)
    {
        if ($request->user() && $request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        // If user is logged in but email not verified, auto-send verification code
        if ($request->user() && !$request->user()->hasVerifiedEmail()) {
            // Prepare a request with the user's email
            $verificationRequest = new Request(['email' => $request->user()->email]);
            
            // Send verification code
            $this->sendVerificationCode($verificationRequest);
            
            // Pass user email to the view
            return Inertia::render('Auth/VerifyUser', [
                'email' => $request->user()->email,
                'message' => 'A verification code has been sent to your email.',
            ]);
        }

        return Inertia::render('Auth/VerifyUser');
    }

    /**
     * Show the email verification prompt.
     */
    public function send(Request $request)
    {
        $email = $request->input('email');
        if (!$email && $request->user()) {
            $email = $request->user()->email;
        }

        $user = User::where('email', $email)->first();
        if ($user) {
            return $this->sendVerificationCode($request);
        }

        return redirect('/verify');
    }

    /**
     * Send verification code to the specified email
     */
    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;
        $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user = User::where('email', $email)->first();
        $userId = $user ? $user->id : null;

        $verification = EmailVerification::updateOrCreate(
            ['email' => $email],
            [
                'user_id' => $userId,
                'verification_code' => $verificationCode,
                'is_verified' => false,
                'sent_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addMinutes(30),
                'attempts' => 0,
            ]
        );

        // Build email content
        $subject = 'Your Verification Code';
        $body = $this->buildVerificationEmail($verificationCode);
        
        try {
            // Send email with verification code
            $result = $this->mailService->sendMail(
                $email, 
                $user ? $user->first_name . ' ' . $user->last_name : 'User', 
                $subject, 
                $body
            );

            Log::info('Email sending attempt', [
                'email' => $email,
                'result' => $result,
                'verification_id' => $verification->id,
                'verification_code' => $verificationCode
            ]);

            if ($result['status']) {
                return response()->json([
                    'sent' => true,
                    'message' => 'Verification code sent successfully'
                ], 200);
            } else {
                Log::error('Failed to send verification email: ' . $result['message']);
                
                // For debugging purposes in dev environment
                if (config('app.debug')) {
                    return response()->json([
                        'sent' => false,
                        'message' => 'Failed to send verification code: ' . $result['message'],
                        'debug_info' => $result
                    ], 500);
                }
                
                return response()->json([
                    'sent' => false,
                    'message' => 'Failed to send verification code. Please try again.'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Exception while sending verification email', [
                'email' => $email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // For debugging purposes in dev environment
            if (config('app.debug')) {
                return response()->json([
                    'sent' => false,
                    'message' => 'An error occurred: ' . $e->getMessage(),
                    'debug_info' => [
                        'file' => $e->getFile(),
                        'line' => $e->getLine()
                    ]
                ], 500);
            }
            
            return response()->json([
                'sent' => false,
                'message' => 'An error occurred while sending the verification code.'
            ], 500);
        }
    }

    /**
     * Verify the email verification code
     */
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $email = $request->email;
        $code = $request->code;

        // Find the verification record
        $verification = EmailVerification::where('email', $email)
            ->where('is_verified', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$verification) {
            return response()->json([
                'verified' => false,
                'message' => 'Verification code expired or not found. Please request a new code.'
            ], 400);
        }

        // Increment attempt counter
        $verification->attempts += 1;
        $verification->save();

        // Check for too many attempts
        if ($verification->attempts > 5) {
            return response()->json([
                'verified' => false,
                'message' => 'Too many verification attempts. Please request a new code.'
            ], 400);
        }

        // Check if code matches
        if ($verification->verification_code !== $code) {
            return response()->json([
                'verified' => false,
                'message' => 'Invalid verification code. Please try again.'
            ], 400);
        }

        // Mark as verified
        $verification->is_verified = true;
        $verification->verified_at = Carbon::now();
        $verification->save();

        // If there's a user associated with this email, update their verification status
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->markEmailAsVerified();
        }

        return response()->json([
            'verified' => true,
            'message' => 'Email verified successfully'
        ], 200);
    }

    /**
     * Build the HTML email content for verification
     */
    private function buildVerificationEmail($code)
    {
        // Basic HTML email template with the verification code
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .code {
                    font-size: 30px;
                    font-weight: bold;
                    text-align: center;
                    color: #333;
                    background-color: #eee;
                    padding: 10px;
                    margin: 20px 0;
                    letter-spacing: 5px;
                    border-radius: 4px;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                    margin-top: 30px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verification Code</h1>
                <p>Please use the following code to verify your email address:</p>
                <div class="code">' . $code . '</div>
                <p>This code will expire in 30 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </body>
        </html>
        ';
    }
}