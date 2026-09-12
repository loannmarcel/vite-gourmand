<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => true,
        'authenticated' => false
    ]);

    exit;
}

$stmt = $pdo->prepare(
    'SELECT id, first_name, last_name, email, role
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
    $_SESSION = [];
    session_destroy();

    echo json_encode([
        'success' => true,
        'authenticated' => false
    ]);

    exit;
}

echo json_encode([
    'success' => true,
    'authenticated' => true,
    'user' => [
        'id' => (int) $user['id'],
        'firstname' => $user['first_name'],
        'lastname' => $user['last_name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]);