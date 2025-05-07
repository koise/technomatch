<?php

namespace App\Http\Controllers;

use App\Services\PHPMailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MailDiagnosticController extends Controller
{
    protected $mailService;

    public function __construct(PHPMailService $mailService)
    {
        $this->mailService = $mailService;
    }

    /**
     * Run diagnostic tests on mail configuration
     * Only available in local/development environments
     */
    public function diagnose()
    {
        // Only allow in development environment
        if (!app()->environment(['local', 'development'])) {
            abort(403, 'This feature is only available in development environment');
        }

        try {
            $diagnosticResult = $this->mailService->diagnosticTest();
            return response()->json([
                'success' => true,
                'diagnostic_result' => $diagnosticResult
            ]);
        } catch (\Exception $e) {
            Log::error('Mail diagnostic test failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Diagnostic test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a test email
     * Only available in local/development environments
     */
    public function sendTestEmail(Request $request)
    {
        // Only allow in development environment
        if (!app()->environment(['local', 'development'])) {
            abort(403, 'This feature is only available in development environment');
        }

        $request->validate([
            'to_email' => 'required|email',
            'to_name' => 'nullable|string',
        ]);

        $toEmail = $request->input('to_email');
        $toName = $request->input('to_name', 'Test User');

        $subject = 'Test Email from TechnoMatch';
        $body = $this->buildTestEmailBody();

        try {
            $result = $this->mailService->sendMail(
                $toEmail,
                $toName,
                $subject,
                $body
            );

            return response()->json([
                'success' => $result['status'],
                'message' => $result['message']
            ]);
        } catch (\Exception $e) {
            Log::error('Test email failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Build HTML body for test email
     */
    private function buildTestEmailBody()
    {
        $timestamp = now()->format('Y-m-d H:i:s');
        
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Test Email</title>
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
                .success {
                    color: #28a745;
                    font-weight: bold;
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
                <h1>TechnoMatch Test Email</h1>
                <p>This is a test email from TechnoMatch. If you received this email, your mail configuration is working correctly.</p>
                <p class="success">✓ Email sent successfully!</p>
                <p>Timestamp: ' . $timestamp . '</p>
                <hr>
                <p>Email configuration used:</p>
                <ul>
                    <li>Driver: ' . config('mail.default') . '</li>
                    <li>Host: ' . config('mail.mailers.smtp.host') . '</li>
                    <li>Port: ' . config('mail.mailers.smtp.port') . '</li>
                    <li>Encryption: ' . config('mail.mailers.smtp.encryption') . '</li>
                    <li>From Address: ' . config('mail.from.address') . '</li>
                    <li>From Name: ' . config('mail.from.name') . '</li>
                </ul>
            </div>
            <div class="footer">
                <p>This is an automated test message, please do not reply.</p>
            </div>
        </body>
        </html>
        ';
    }
} 