<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cache;

class PHPMailService
{
    protected $mailer;
    protected $useBackupMailer = false;
    protected $backupMailerConfig = null;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
        
        // Check if we should use backup mailer due to previous limit issues
        $this->checkBackupMailerStatus();
        
        // Enable debug output in development
        if (env('APP_DEBUG')) {
            $this->mailer->SMTPDebug = 2; // 2 = Debug output
            $this->mailer->Debugoutput = function($str, $level) {
                Log::debug("PHPMailer [$level]: $str");
            };
        }
    }
    
    /**
     * Check if we should be using the backup mailer
     */
    protected function checkBackupMailerStatus()
    {
        // If Gmail limit was reached recently, use backup mailer
        $this->useBackupMailer = Cache::get('gmail_limit_reached', false);
        
        // If we need to use backup mailer, load its configuration
        if ($this->useBackupMailer) {
            $this->backupMailerConfig = $this->getBackupMailerConfig();
            
            if ($this->backupMailerConfig) {
                Log::info('Using backup mailer due to Gmail limits being reached');
            } else {
                // If no backup config is available, reset the flag
                $this->useBackupMailer = false;
                Log::warning('No backup mailer configuration found, continuing with primary mailer');
            }
        }
    }
    
    /**
     * Get backup mailer configuration
     * 
     * @return array|null
     */
    protected function getBackupMailerConfig()
    {
        // First check if Mailtrap is configured (good for development)
        $mailtrapUser = env('MAILTRAP_USERNAME');
        $mailtrapPass = env('MAILTRAP_PASSWORD');
        
        if (!empty($mailtrapUser) && !empty($mailtrapPass)) {
            return [
                'host' => 'sandbox.smtp.mailtrap.io',
                'port' => 2525,
                'username' => $mailtrapUser,
                'password' => $mailtrapPass,
                'encryption' => 'tls',
                'from_address' => config('mail.from.address', 'noreply@technomatch.com'),
                'from_name' => config('mail.from.name', 'TechnoMatch')
            ];
        }
        
        // Check if we have SendGrid as backup
        $sendgridKey = env('SENDGRID_API_KEY');
        if (!empty($sendgridKey)) {
            return [
                'host' => 'smtp.sendgrid.net',
                'port' => 587,
                'username' => 'apikey',
                'password' => $sendgridKey,
                'encryption' => 'tls',
                'from_address' => config('mail.from.address', 'noreply@technomatch.com'),
                'from_name' => config('mail.from.name', 'TechnoMatch')
            ];
        }
        
        // Check if we have Mailgun as backup
        $mailgunKey = env('MAILGUN_SECRET');
        $mailgunDomain = env('MAILGUN_DOMAIN');
        if (!empty($mailgunKey) && !empty($mailgunDomain)) {
            return [
                'host' => 'smtp.mailgun.org',
                'port' => 587,
                'username' => 'postmaster@' . $mailgunDomain,
                'password' => $mailgunKey,
                'encryption' => 'tls',
                'from_address' => config('mail.from.address', 'noreply@technomatch.com'),
                'from_name' => config('mail.from.name', 'TechnoMatch')
            ];
        }
        
        // No backup configured
        return null;
    }

    public function sendMail($toEmail, $toName, $subject, $body)
    {
        try {
            // Reset the mailer to ensure clean state
            $this->mailer->clearAllRecipients();
            $this->mailer->clearAttachments();
            $this->mailer->clearCustomHeaders();
            
            // Always use SMTP
            $this->mailer->isSMTP();
            
            // Get SMTP configuration based on whether we use backup or primary mailer
            if ($this->useBackupMailer && $this->backupMailerConfig) {
                $host = $this->backupMailerConfig['host'];
                $port = (int)$this->backupMailerConfig['port'];
                $username = $this->backupMailerConfig['username'];
                $password = $this->backupMailerConfig['password'];
                $encryption = $this->backupMailerConfig['encryption'];
                $fromAddress = $this->backupMailerConfig['from_address'];
                $fromName = $this->backupMailerConfig['from_name'];
                
                Log::info('Using backup mail service due to Gmail limits');
            } else {
                // Use primary mailer (Gmail or default)
                $host = config('mail.mailers.smtp.host', 'smtp.gmail.com');
                $port = (int)config('mail.mailers.smtp.port', 587);
                $username = config('mail.mailers.smtp.username');
                $password = config('mail.mailers.smtp.password');
                $encryption = config('mail.mailers.smtp.encryption', 'tls');
                $fromAddress = config('mail.from.address', 'noreply@technomatch.com');
                $fromName = config('mail.from.name', 'TechnoMatch');
            }
            
            // Log mail configuration for debugging (excluding password)
            Log::debug('Mail Configuration', [
                'host' => $host,
                'port' => $port,
                'username' => $username,
                'encryption' => $encryption,
                'fromAddress' => $fromAddress,
                'fromName' => $fromName,
                'using_backup' => $this->useBackupMailer
            ]);
            
            // Validate required fields
            if (empty($host) || empty($port) || empty($username) || empty($password)) {
                Log::error('Missing required SMTP configuration', [
                    'host' => empty($host) ? 'missing' : 'set',
                    'port' => empty($port) ? 'missing' : 'set',
                    'username' => empty($username) ? 'missing' : 'set',
                    'password' => empty($password) ? 'missing' : 'set'
                ]);
                return ['status' => false, 'message' => 'Incomplete SMTP configuration. Please check your .env file.'];
            }
            
            // Configure server settings
            $this->mailer->Host = $host;
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $username;
            $this->mailer->Password = $password;
            $this->mailer->SMTPSecure = $encryption;
            $this->mailer->Port = $port;

            // Set timeout and keep-alive
            $this->mailer->Timeout = 60;
            $this->mailer->SMTPKeepAlive = true; // Keep connection open for multiple emails
            
            // Fix for "data not accepted" SMTP error
            $this->mailer->AuthType = '';  // Don't force any auth mechanism

            // Enable error handling
            $this->mailer->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];
            
            // Add sender and recipient
            $this->mailer->setFrom($fromAddress, $fromName);
            $this->mailer->addAddress($toEmail, $toName);

            // Set email content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = $subject;
            $this->mailer->Body = $body;
            $this->mailer->CharSet = 'UTF-8';
            
            // Add plain text alternative
            $plainText = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $body));
            $this->mailer->AltBody = $plainText;

            // Log before sending
            Log::info('Attempting to send email', [
                'to' => $toEmail,
                'subject' => $subject,
                'from' => $fromAddress,
                'using_backup' => $this->useBackupMailer
            ]);

            // Send the email
            $result = $this->mailer->send();
            
            // Close the connection to avoid timeout issues
            $this->mailer->smtpClose();
            
            Log::info('Email sent successfully', [
                'to' => $toEmail,
                'subject' => $subject
            ]);

            // If we're using the backup mailer because of previous limits, 
            // occasionally try to use the primary again after some time has passed
            if ($this->useBackupMailer) {
                $limitReachedAt = Cache::get('gmail_limit_reached_timestamp');
                if ($limitReachedAt && (time() - $limitReachedAt > 86400)) { // 24 hours
                    Cache::forget('gmail_limit_reached');
                    Cache::forget('gmail_limit_reached_timestamp');
                    Log::info('Cleared Gmail limit status, will try primary mailer next time');
                }
            }

            return ['status' => true, 'message' => 'Email sent successfully.'];
        } catch (Exception $e) {
            // Get detailed error info
            $errorMsg = $e->getMessage();
            $errorInfo = $this->mailer->ErrorInfo;
            
            // Try to close the connection even if an error occurred
            try {
                $this->mailer->smtpClose();
            } catch (\Exception $closeEx) {
                Log::warning('Failed to close SMTP connection after error', [
                    'error' => $closeEx->getMessage()
                ]);
            }
            
            // Check for Gmail sending limit errors
            $isGmailLimitError = false;
            if (stripos($errorInfo, 'Daily user sending limit exceeded') !== false || 
                stripos($errorMsg, 'Daily user sending limit exceeded') !== false) {
                $isGmailLimitError = true;
                $message = 'Email sending failed: Gmail daily sending limit exceeded. Please try again tomorrow or use a different email service.';
                
                // Set a cache flag to use backup mailer for the next 24 hours
                if (!$this->useBackupMailer) {
                    Cache::put('gmail_limit_reached', true, 86400); // 24 hours
                    Cache::put('gmail_limit_reached_timestamp', time(), 86400);
                    Log::warning('Gmail sending limit reached, flagging to use backup mailer for next 24 hours');
                    
                    // If we have a backup mailer configured, suggest an immediate retry
                    if ($this->getBackupMailerConfig()) {
                        $message .= ' System will automatically try an alternative mail service.';
                    }
                }
            } else {
                // Provide more useful error message
                $message = 'Failed to send email: ' . $errorMsg;
                if (!empty($errorInfo) && $errorInfo !== $errorMsg) {
                    $message .= ' - ' . $errorInfo;
                }
            }
            
            Log::error('Failed to send email', [
                'to' => $toEmail,
                'subject' => $subject,
                'error' => $errorMsg,
                'errorInfo' => $errorInfo,
                'isGmailLimitError' => $isGmailLimitError,
                'using_backup' => $this->useBackupMailer
            ]);
            
            // If this was a Gmail limit error and we weren't already using the backup,
            // we can try immediately with the backup mailer
            if ($isGmailLimitError && !$this->useBackupMailer) {
                $backupConfig = $this->getBackupMailerConfig();
                if ($backupConfig) {
                    Log::info('Attempting immediate retry with backup mailer after Gmail limit error');
                    $this->useBackupMailer = true;
                    $this->backupMailerConfig = $backupConfig;
                    
                    // Recursive call to retry with backup mailer
                    return $this->sendMail($toEmail, $toName, $subject, $body);
                }
            }
            
            return [
                'status' => false, 
                'message' => $message,
                'isGmailLimitError' => $isGmailLimitError
            ];
        }
    }
    
    /**
     * Test mail configuration and return diagnostic information
     * 
     * @return array
     */
    public function diagnosticTest()
    {
        // Get the configuration values
        $config = [
            'driver' => config('mail.default'),
            'host' => config('mail.mailers.smtp.host'),
            'port' => config('mail.mailers.smtp.port'),
            'username' => config('mail.mailers.smtp.username'),
            'hasPassword' => !empty(config('mail.mailers.smtp.password')),
            'encryption' => config('mail.mailers.smtp.encryption'),
            'from_address' => config('mail.from.address'),
            'from_name' => config('mail.from.name'),
            'using_backup_mailer' => $this->useBackupMailer,
            'has_backup_config' => !is_null($this->getBackupMailerConfig()),
            'gmail_limit_reached' => Cache::get('gmail_limit_reached', false),
        ];
        
        // Check connection to mail server (without sending mail)
        $connectionTest = $this->testConnection();
        
        // Get backup mailer info if available
        $backupInfo = null;
        if ($this->getBackupMailerConfig()) {
            $backupConfig = $this->getBackupMailerConfig();
            $backupInfo = [
                'host' => $backupConfig['host'],
                'available' => true,
                'type' => $this->getBackupMailerType()
            ];
        }
        
        return [
            'config' => $config,
            'connection_test' => $connectionTest,
            'backup_mailer' => $backupInfo
        ];
    }
    
    /**
     * Get the type of backup mailer that's configured
     */
    private function getBackupMailerType()
    {
        if (!empty(env('MAILTRAP_USERNAME'))) {
            return 'Mailtrap';
        } elseif (!empty(env('SENDGRID_API_KEY'))) {
            return 'SendGrid';
        } elseif (!empty(env('MAILGUN_SECRET'))) {
            return 'Mailgun';
        }
        return 'None';
    }
    
    /**
     * Test connection to the mail server
     * 
     * @return array
     */
    private function testConnection()
    {
        try {
            $mailer = new PHPMailer(true);
            $mailer->isSMTP();
            $mailer->SMTPDebug = 0;
            
            // Use appropriate configuration based on backup status
            if ($this->useBackupMailer && $this->backupMailerConfig) {
                $host = $this->backupMailerConfig['host'];
                $port = (int)$this->backupMailerConfig['port'];
                $username = $this->backupMailerConfig['username'];
                $password = $this->backupMailerConfig['password'];
                $encryption = $this->backupMailerConfig['encryption'];
            } else {
                $host = config('mail.mailers.smtp.host', 'smtp.gmail.com');
                $port = (int)config('mail.mailers.smtp.port', 587);
                $username = config('mail.mailers.smtp.username');
                $password = config('mail.mailers.smtp.password');
                $encryption = config('mail.mailers.smtp.encryption', 'tls');
            }
            
            $mailer->Host = $host;
            $mailer->SMTPAuth = true;
            $mailer->Username = $username;
            $mailer->Password = $password;
            $mailer->SMTPSecure = $encryption;
            $mailer->Port = $port;
            $mailer->Timeout = 10; // Short timeout for testing
            $mailer->AuthType = ''; // Don't force any authentication mechanism
            
            // Just test the connection without sending
            $mailer->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ];
            
            // Try to connect
            $connected = $mailer->smtpConnect();
            
            if ($connected) {
                $mailer->smtpClose();
                return [
                    'status' => true, 
                    'message' => 'Successfully connected to mail server',
                    'using_backup' => $this->useBackupMailer
                ];
            } else {
                return [
                    'status' => false, 
                    'message' => 'Failed to connect to mail server',
                    'using_backup' => $this->useBackupMailer
                ];
            }
        } catch (Exception $e) {
            return [
                'status' => false, 
                'message' => 'Connection test failed: ' . $e->getMessage(),
                'using_backup' => $this->useBackupMailer
            ];
        }
    }
}
