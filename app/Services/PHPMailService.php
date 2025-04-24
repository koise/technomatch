<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;

class PHPMailService
{
    public function sendVerificationEmail(array $data)
    {
        try {
            $to = $data['to'];
            $subject = $data['subject'];
            $code = $data['verification_code'];
            $expiresAt = $data['expires_at'];
            
            Mail::send('emails.verification', [
                'code' => $code,
                'expires_at' => $expiresAt
            ], function (Message $message) use ($to, $subject) {
                $message->to($to)
                    ->subject($subject);
            });
            
            return !Mail::failures();
        } catch (\Exception $e) {
            Log::error('Mail sending error: ' . $e->getMessage());
            return false;
        }
    }

    public function sendMail($to, $subject, $body)
    {
        $mail = new PHPMailer(true);

        try {
            // SMTP settings
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'tls');
            $mail->Port       = env('MAIL_PORT', 587);

            // Sender & recipient
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            return true;
        } catch (Exception $e) {
            \Log::error('PHPMailer Error: ' . $e->getMessage());
            return false;
        }
    }
}
