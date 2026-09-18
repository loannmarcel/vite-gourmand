<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/MailerService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);

    exit;
}

$email = trim($_POST['email'] ?? '');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Adresse e-mail invalide.'
    ]);

    exit;
}

$stmt = $pdo->prepare(
    'SELECT id, first_name, last_name, email
     FROM users
     WHERE email = :email
     LIMIT 1'
);

$stmt->execute([
    'email' => $email
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {

    // Suppression des anciens liens encore présents
    // pour cet utilisateur.

    $stmt = $pdo->prepare(
        'DELETE FROM password_reset_tokens
         WHERE user_id = :user_id'
    );

    $stmt->execute([
        'user_id' => $user['id']
    ]);


    // Création d'un token aléatoire sécurisé.
    // Seul son hash sera enregistré en base.

    $token = bin2hex(random_bytes(32));

    $tokenHash = hash('sha256', $token);

    $expiresAt = date(
        'Y-m-d H:i:s',
        time() + 3600
    );


    $stmt = $pdo->prepare(
        'INSERT INTO password_reset_tokens (
            user_id,
            token_hash,
            expires_at
        )
        VALUES (
            :user_id,
            :token_hash,
            :expires_at
        )'
    );

    $stmt->execute([
        'user_id' => $user['id'],
        'token_hash' => $tokenHash,
        'expires_at' => $expiresAt
    ]);

    $appUrl = rtrim(
        $_ENV['APP_URL'] ?? 'http://localhost:8000',
        '/'
    );

    $resetLink =
        $appUrl . '/frontend/reinitialiser-mot-de-passe.html?token='
        . urlencode($token);

    MailerService::send(
        $user['email'],
        $user['first_name'] . ' ' . $user['last_name'],
        'Réinitialisation de votre mot de passe - Vite & Gourmand',
        '<h1>Réinitialisation de votre mot de passe</h1>
        <p>Bonjour ' . htmlspecialchars($user['first_name'], ENT_QUOTES, 'UTF-8') . ',</p>
        <p>Vous avez demandé à réinitialiser le mot de passe de votre compte Vite & Gourmand.</p>
        <p>
            <a href="' . htmlspecialchars($resetLink, ENT_QUOTES, 'UTF-8') . '">
                Réinitialiser mon mot de passe
            </a>
        </p>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        <p>À bientôt,<br>L’équipe Vite & Gourmand</p>'
    );

}

echo json_encode([
    'success' => true,
    'message' => 'Si cette adresse correspond à un compte, un lien de réinitialisation vous a été envoyé.'
]);