<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->safeLoad();

class MailerService
{
    public static function send(
        string $toEmail,
        string $toName,
        string $subject,
        string $htmlBody
    ): bool {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = $_ENV['SMTP_HOST'];
            $mail->SMTPAuth = true;
            $mail->Username = $_ENV['SMTP_USERNAME'];
            $mail->Password = $_ENV['SMTP_PASSWORD'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = (int) $_ENV['SMTP_PORT'];
            $mail->CharSet = 'UTF-8';
            
            $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], 'Vite & Gourmand');
            $mail->addAddress($toEmail, $toName);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);

            $mail->send();

            return true;
        } catch (Exception $e) {
            error_log('Erreur envoi e-mail : ' . $mail->ErrorInfo);
            return false;
        }
    }
}