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

$employeeId = (int) ($data["employee_id"] ?? 0);
$isActive = $data["is_active"] ?? null;

if (
    $employeeId <= 0 ||
    !is_bool($isActive)
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Données invalides."
    ]);

    exit;
}

try {
    $statement = $pdo->prepare(
        "UPDATE users
        SET is_active = :is_active
        WHERE id = :employee_id
        AND role = 'employee'"
    );

    $statement->execute([
        "is_active" => $isActive ? 1 : 0,
        "employee_id" => $employeeId
    ]);

    if ($statement->rowCount() === 0) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Compte employé introuvable."
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" =>
            $isActive
                ? "Compte employé réactivé."
                : "Compte employé désactivé."
    ]);

} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" =>
            "Erreur lors de la modification du compte employé."
    ]);
}