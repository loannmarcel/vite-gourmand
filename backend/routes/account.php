<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur non connecté.'
    ]);

    exit;
}

$stmt = $pdo->prepare(
    'SELECT
        id,
        first_name,
        last_name,
        email,
        phone,
        address,
        postal_code,
        city
     FROM users
     WHERE id = :id
     AND is_active = TRUE
     LIMIT 1'
);

$stmt->execute([
    'id' => $_SESSION['user_id']
]);

$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur introuvable.'
    ]);

    exit;
}

echo json_encode([
    'success' => true,
    'user' => [
        'id' => (int) $user['id'],
        'firstname' => $user['first_name'],
        'lastname' => $user['last_name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'address' => $user['address'],
        'postal_code' => $user['postal_code'],
        'city' => $user['city']
    ]
]);