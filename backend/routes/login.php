<?php

session_start();

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

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Adresse e-mail et mot de passe obligatoires.'
    ]);

    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Adresse e-mail invalide.'
    ]);

    exit;
}

$stmt = $pdo->prepare(
    'SELECT id, first_name, last_name, email, password_hash, role, is_active
     FROM users
     WHERE email = :email
     LIMIT 1'
);

$stmt->execute([
    'email' => $email
]);

$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Adresse e-mail ou mot de passe incorrect.'
    ]);

    exit;
}

if (!$user['is_active']) {
    http_response_code(403);

    echo json_encode([
        'success' => false,
        'message' => 'Ce compte est désactivé.'
    ]);

    exit;
}

session_regenerate_id(true);

$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['user_role'] = $user['role'];

echo json_encode([
    'success' => true,
    'message' => 'Connexion réussie.',
    'user' => [
        'id' => (int) $user['id'],
        'firstname' => $user['first_name'],
        'lastname' => $user['last_name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);