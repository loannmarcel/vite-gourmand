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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée."
    ]);

    exit;
}

try {
    $statement = $pdo->prepare(
        "SELECT
            id,
            first_name,
            last_name,
            email,
            is_active,
            created_at
        FROM users
        WHERE role = 'employee'
        ORDER BY created_at DESC"
    );

    $statement->execute();

    $employees = $statement->fetchAll(
        PDO::FETCH_ASSOC
    );

    echo json_encode([
        "success" => true,
        "employees" => $employees
    ]);

} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" =>
            "Erreur lors de la récupération des employés."
    ]);
}