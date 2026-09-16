<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/database.php";

if (!isset($_SESSION["user_id"], $_SESSION["user_role"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Vous devez être connecté."
    ]);

    exit;
}

if ($_SESSION["user_role"] !== "admin") {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Accès réservé à l'administrateur."
    ]);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée."
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Adresse e-mail invalide."
    ]);

    exit;
}

if (
    strlen($password) < 10 ||
    !preg_match('/[A-Z]/', $password) ||
    !preg_match('/[a-z]/', $password) ||
    !preg_match('/[0-9]/', $password) ||
    !preg_match('/[^A-Za-z0-9]/', $password)
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" =>
            "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
    ]);

    exit;
}

$passwordHash = password_hash(
    $password,
    PASSWORD_DEFAULT
);

try {
    $statement = $pdo->prepare(
        "SELECT id
        FROM users
        WHERE email = :email
        LIMIT 1"
    );

    $statement->execute([
        "email" => $email
    ]);

    if ($statement->fetch()) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" =>
                "Un compte existe déjà avec cette adresse e-mail."
        ]);

        exit;
    }

    $statement = $pdo->prepare(
        "INSERT INTO users (
            first_name,
            last_name,
            phone,
            email,
            address,
            postal_code,
            city,
            password_hash,
            role,
            is_active
        ) VALUES (
            NULL,
            NULL,
            NULL,
            :email,
            NULL,
            NULL,
            NULL,
            :password_hash,
            'employee',
            1
        )"
    );

    $statement->execute([
        "email" => $email,
        "password_hash" => $passwordHash
    ]);

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Compte employé créé avec succès.",
        "employee_id" => (int) $pdo->lastInsertId()
    ]);

} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" =>
            "Erreur lors de la création du compte employé."
    ]);
}