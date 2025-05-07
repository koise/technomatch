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
use Illuminate\Support\Facades\Cache;

class UserEmailVerification extends Controller
{
    protected $mailService;

    public function __construct(PHPMailService $mailService)
    {
        $this->mailService = $mailService;
    }

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
                
                // Special handling for Gmail sending limit errors
                if (isset($result['isGmailLimitError']) && $result['isGmailLimitError']) {
                    // Check if we're currently trying with a backup mailer
                    $usingBackup = Cache::get('gmail_limit_reached', false);
                    $hasBackupConfig = app(PHPMailService::class)->diagnosticTest()['backup_mailer'] !== null;
                    
                    if ($usingBackup) {
                        // We tried with the backup mailer and still failed
                        return response()->json([
                            'sent' => false,
                            'message' => 'Unable to send verification code with both primary and backup mail services. Please try again later or contact support.',
                            'error_type' => 'all_mailers_failed',
                            'debug_info' => config('app.debug') ? $result : null
                        ], 503); // Service Unavailable
                    } else if ($hasBackupConfig) {
                        // We hit Gmail limits but have a backup configured
                        // The PHPMailService will automatically retry with the backup on next request
                        return response()->json([
                            'sent' => false,
                            'message' => 'Gmail sending limit reached. Please try again - the system will automatically use an alternative mail service.',
                            'error_type' => 'gmail_limit_retry_available',
                            'debug_info' => config('app.debug') ? $result : null
                        ], 429); // Too Many Requests - a good status code for rate limiting
                    } else {
                        // No backup mailer is configured
                        return response()->json([
                            'sent' => false,
                            'message' => 'Unable to send verification code: Gmail sending limit reached. Please try again tomorrow or contact support.',
                            'error_type' => 'gmail_limit_exceeded',
                            'debug_info' => config('app.debug') ? $result : null
                        ], 503); // Service Unavailable
                    }
                }
                
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
                    'message' => 'Failed to send verification code. Please try again later.'
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
        // Simplified HTML email template with minimal styling for better compatibility
        return '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px;">
        <h1>Verification Code</h1>
        <p>Please use the following code to verify your email address:</p>
        <div style="font-size: 28px; font-weight: bold; text-align: center; color: #333; background-color: #eee; padding: 10px; margin: 20px 0; letter-spacing: 3px; border-radius: 4px;">' . $code . '</div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
    </div>
    <div style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
        <p>This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>';
    }
}