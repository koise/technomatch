<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Services\PHPMailService;

class EmailVerificationPromptController extends Controller
{
    protected $mailService;
    
    public function __construct(PHPMailService $mailService)
    {
        $this->mailService = $mailService;
    }
    
    /**
     * Send a verification email with a code
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendVerificationEmail(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'user_id' => 'required|exists:users,id'
            ]);
            
            $email = $request->email;
            $userId = $request->user_id;
            
            // Generate a random 6-digit verification code
            $verificationCode = sprintf('%06d', rand(0, 999999));
            
            // Set expiration time (30 minutes from now)
            $expiresAt = Carbon::now()->addMinutes(30);
            
            DB::beginTransaction();
            
            // Check if there's an existing verification record
            $verification = EmailVerification::where('email', $email)
                ->where('user_id', $userId)
                ->first();
                
            if ($verification) {
                // Update existing record
                $verification->update([
                    'verification_code' => $verificationCode,
                    'is_verified' => false,
                    'sent_at' => Carbon::now(),
                    'verified_at' => null,
                    'expires_at' => $expiresAt,
                    'attempts' => 0
                ]);
            } else {
                // Create new verification record
                $verification = EmailVerification::create([
                    'user_id' => $userId,
                    'email' => $email,
                    'verification_code' => $verificationCode,
                    'is_verified' => false,
                    'sent_at' => Carbon::now(),
                    'expires_at' => $expiresAt,
                    'attempts' => 0
                ]);
            }
            
            // Send the email
            $emailData = [
                'to' => $email,
                'subject' => 'Verify Your Email Address',
                'verification_code' => $verificationCode,
                'expires_at' => $expiresAt->format('h:i A')
            ];
            
            $emailSent = $this->mailService->sendVerificationEmail($emailData);
            
            if (!$emailSent) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send verification email. Please try again.'
                ], 500);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Verification email sent successfully!',
                'expires_at' => $expiresAt->timestamp
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Email verification error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while sending verification email: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Verify the email using the provided verification code
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyCode(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'verification_code' => 'required|string|size:6',
            ]);
            
            $email = $request->email;
            $code = $request->verification_code;
            
            // Find the verification record
            $verification = EmailVerification::where('email', $email)
                ->where('verification_code', $code)
                ->where('is_verified', false)
                ->where('expires_at', '>', Carbon::now())
                ->first();
            
            if (!$verification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired verification code.'
                ], 400);
            }
            
            // Increment the attempts
            $verification->attempts += 1;
            
            // Maximum 5 attempts
            if ($verification->attempts >= 5) {
                $verification->save();
                return response()->json([
                    'success' => false,
                    'message' => 'Too many attempts. Please request a new verification code.'
                ], 400);
            }
            
            DB::beginTransaction();
            
            // Update the verification record
            $verification->update([
                'is_verified' => true,
                'verified_at' => Carbon::now()
            ]);
            
            // Update the user record
            $user = User::find($verification->user_id);
            $user->update([
                'email_verified' => true,
                'verify_at' => Carbon::now()
            ]);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Email successfully verified!'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Email verification error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while verifying email: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Resend verification email
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resendVerificationEmail(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'user_id' => 'required|exists:users,id'
            ]);
            
            $email = $request->email;
            $userId = $request->user_id;
            
            // Find the verification record
            $verification = EmailVerification::where('email', $email)
                ->where('user_id', $userId)
                ->first();
            
            // If no record exists or last email was sent more than 30 seconds ago
            if (!$verification || Carbon::now()->diffInSeconds($verification->sent_at) > 30) {
                return $this->sendVerificationEmail($request);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Please wait before requesting another verification email.',
                'wait_time' => 30 - Carbon::now()->diffInSeconds($verification->sent_at)
            ], 429);
            
        } catch (\Exception $e) {
            Log::error('Email verification error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Check verification status
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkVerificationStatus(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'user_id' => 'required|exists:users,id'
            ]);
            
            $email = $request->email;
            $userId = $request->user_id;
            
            // Find the user and check if email is verified
            $user = User::find($userId);
            
            if ($user->email_verified) {
                return response()->json([
                    'success' => true,
                    'verified' => true,
                    'message' => 'Email is already verified.'
                ]);
            }
            
            // Find the verification record
            $verification = EmailVerification::where('email', $email)
                ->where('user_id', $userId)
                ->first();
            
            if (!$verification) {
                return response()->json([
                    'success' => true,
                    'verified' => false,
                    'message' => 'No verification has been initiated.'
                ]);
            }
            
            return response()->json([
                'success' => true,
                'verified' => $verification->is_verified,
                'expires_at' => $verification->expires_at,
                'attempts' => $verification->attempts,
                'message' => $verification->is_verified ? 'Email is verified.' : 'Email is not verified yet.'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Email verification error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}