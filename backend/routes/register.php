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

$lastname = trim($_POST['lastname'] ?? '');
$firstname = trim($_POST['firstname'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$postalCode = trim($_POST['postal_code'] ?? '');
$city = trim($_POST['city'] ?? '');
$password = $_POST['password'] ?? '';
$passwordConfirm = $_POST['password-confirm'] ?? '';
$terms = isset($_POST['terms']);

if (
    $lastname === '' ||
    $firstname === '' ||
    $email === '' ||
    $phone === '' ||
    $address === '' ||
    $postalCode === '' ||
    $city === '' ||
    $password === '' ||
    $passwordConfirm === ''
) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs obligatoires doivent être remplis.'
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

if (!$terms) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Vous devez accepter les conditions générales.'
    ]);

    exit;
}

if ($password !== $passwordConfirm) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Les mots de passe ne correspondent pas.'
    ]);

    exit;
}

$passwordIsValid =
    strlen($password) >= 10 &&
    preg_match('/[A-Z]/', $password) &&
    preg_match('/[a-z]/', $password) &&
    preg_match('/[0-9]/', $password) &&
    preg_match('/[^A-Za-z0-9]/', $password);

if (!$passwordIsValid) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
    ]);

    exit;
}

$stmt = $pdo->prepare(
    'SELECT id
     FROM users
     WHERE email = :email
     LIMIT 1'
);

$stmt->execute([
    'email' => $email
]);

$existingUser = $stmt->fetch();

if ($existingUser) {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Un compte existe déjà avec cette adresse e-mail.'
    ]);

    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare(
    'INSERT INTO users (
        first_name,
        last_name,
        phone,
        email,
        address,
        postal_code,
        city,
        password_hash,
        role
    ) VALUES (
        :first_name,
        :last_name,
        :phone,
        :email,
        :address,
        :postal_code,
        :city,
        :password_hash,
        :role
    )'
);

$stmt->execute([
    'first_name' => $firstname,
    'last_name' => $lastname,
    'phone' => $phone,
    'email' => $email,
    'address' => $address,
    'postal_code' => $postalCode,
    'city' => $city,
    'password_hash' => $passwordHash,
    'role' => 'user'
]);

http_response_code(201);

echo json_encode([
    'success' => true,
    'message' => 'Compte créé avec succès.'
]);