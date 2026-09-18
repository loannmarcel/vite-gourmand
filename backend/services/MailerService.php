<?php

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
        $apiKey = getenv('BREVO_API_KEY') ?: ($_ENV['BREVO_API_KEY'] ?? '');
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: ($_ENV['SMTP_FROM_EMAIL'] ?? '');

        if ($apiKey === '' || $fromEmail === '') {
            error_log('Erreur envoi e-mail : configuration Brevo manquante.');
            return false;
        }

        $payload = [
            'sender' => [
                'name' => 'Vite & Gourmand',
                'email' => $fromEmail
            ],
            'to' => [
                [
                    'email' => $toEmail,
                    'name' => $toName
                ]
            ],
            'subject' => $subject,
            'htmlContent' => $htmlBody,
            'textContent' => strip_tags($htmlBody)
        ];

        $ch = curl_init('https://api.brevo.com/v3/smtp/email');

        if ($ch === false) {
            error_log('Erreur envoi e-mail : impossible d initialiser cURL.');
            return false;
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_HTTPHEADER => [
                'accept: application/json',
                'api-key: ' . $apiKey,
                'content-type: application/json'
            ],
            CURLOPT_POSTFIELDS => json_encode(
                $payload,
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            )
        ]);

        $response = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);

        curl_close($ch);

        if ($response === false) {
            error_log('Erreur envoi e-mail Brevo : ' . $curlError);
            return false;
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            error_log(
                'Erreur API Brevo HTTP ' . $httpCode . ' : ' . $response
            );
            return false;
        }

        return true;
    }
}