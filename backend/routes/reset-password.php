<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);

    exit;
}


$token = trim($_POST['token'] ?? '');
$password = $_POST['password'] ?? '';
$passwordConfirmation = $_POST['password_confirmation'] ?? '';


if (
    $token === '' ||
    $password === '' ||
    $passwordConfirmation === ''
) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Toutes les informations sont obligatoires.'
    ]);

    exit;
}


if ($password !== $passwordConfirmation) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Les mots de passe ne correspondent pas.'
    ]);

    exit;
}

$passwordIsValid =
    strlen($password) >= 10 &&
    preg_match('/[a-z]/', $password) &&
    preg_match('/[A-Z]/', $password) &&
    preg_match('/[0-9]/', $password) &&
    preg_match('/[^a-zA-Z0-9]/', $password);


if (!$passwordIsValid) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
    ]);

    exit;
}

$tokenHash = hash('sha256', $token);


$stmt = $pdo->prepare(
    'SELECT
        password_reset_tokens.id,
        password_reset_tokens.user_id,
        password_reset_tokens.expires_at,
        password_reset_tokens.used_at
     FROM password_reset_tokens
     WHERE password_reset_tokens.token_hash = :token_hash
     LIMIT 1'
);

$stmt->execute([
    'token_hash' => $tokenHash
]);

$resetToken = $stmt->fetch(PDO::FETCH_ASSOC);


if (
    !$resetToken ||
    $resetToken['used_at'] !== null ||
    strtotime($resetToken['expires_at']) < time()
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Ce lien de réinitialisation est invalide ou a expiré.'
    ]);

    exit;
}

$newPasswordHash = password_hash(
    $password,
    PASSWORD_DEFAULT
);


try {
    $pdo->beginTransaction();


    // Mise à jour du mot de passe de l'utilisateur

    $stmt = $pdo->prepare(
        'UPDATE users
        SET password_hash = :password
        WHERE id = :user_id'
    );

    $stmt->execute([
        'password' => $newPasswordHash,
        'user_id' => $resetToken['user_id']
    ]);


    // Le lien de réinitialisation devient inutilisable

    $stmt = $pdo->prepare(
        'UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE id = :id'
    );

    $stmt->execute([
        'id' => $resetToken['id']
    ]);


    $pdo->commit();


    echo json_encode([
        'success' => true,
        'message' => 'Votre mot de passe a été réinitialisé avec succès.'
    ]);


} catch (Throwable $error) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }


    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible de réinitialiser le mot de passe.'
    ]);
}