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

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur non connecté.'
    ]);

    exit;
}

$lastname = trim($_POST['lastname'] ?? '');
$firstname = trim($_POST['firstname'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$postalCode = trim($_POST['postal_code'] ?? '');
$city = trim($_POST['city'] ?? '');

if (
    $lastname === '' ||
    $firstname === '' ||
    $email === '' ||
    $address === '' ||
    $postalCode === '' ||
    $city === ''
) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs obligatoires doivent être renseignés.'
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
    'SELECT id
     FROM users
     WHERE email = :email
     AND id != :id
     LIMIT 1'
);

$stmt->execute([
    'email' => $email,
    'id' => $_SESSION['user_id']
]);

if ($stmt->fetch()) {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Cette adresse e-mail est déjà utilisée.'
    ]);

    exit;
}

$stmt = $pdo->prepare(
    'UPDATE users
     SET
        first_name = :firstname,
        last_name = :lastname,
        email = :email,
        phone = :phone,
        address = :address,
        postal_code = :postal_code,
        city = :city
     WHERE id = :id
     AND is_active = TRUE'
);

$stmt->execute([
    'firstname' => $firstname,
    'lastname' => $lastname,
    'email' => $email,
    'phone' => $phone,
    'address' => $address,
    'postal_code' => $postalCode,
    'city' => $city,
    'id' => $_SESSION['user_id']
]);

echo json_encode([
    'success' => true,
    'message' => 'Informations mises à jour avec succès.'
]);