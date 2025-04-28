<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class PHPMailService
{
    protected $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
    }

    public function sendMail($toEmail, $toName, $subject, $body)
    {
        try {
            $this->mailer->isSMTP();
            $this->mailer->Host = env('MAIL_HOST');
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = env('MAIL_USERNAME');
            $this->mailer->Password = env('MAIL_PASSWORD');
            $this->mailer->SMTPSecure = env('MAIL_ENCRYPTION', 'tls');
            $this->mailer->Port = env('MAIL_PORT');

            $this->mailer->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $this->mailer->addAddress($toEmail, $toName);

            $this->mailer->isHTML(true);
            $this->mailer->Subject = $subject;
            $this->mailer->Body    = $body;

            $this->mailer->send();

            return ['status' => true, 'message' => 'Email sent successfully.'];
        } catch (Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }
}
