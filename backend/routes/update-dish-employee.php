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

if (
    $_SESSION["user_role"] !== "employee" &&
    $_SESSION["user_role"] !== "admin"
) {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Accès refusé."
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

$dishId = (int) ($data["dish_id"] ?? 0);
$name = trim($data["name"] ?? "");
$category = trim($data["category"] ?? "");
$allergens = trim($data["allergens"] ?? "");

$allowedCategories = [
    "starter",
    "main",
    "dessert"
];

if ($dishId <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Plat invalide."
    ]);

    exit;
}

if ($name === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Le nom du plat est obligatoire."
    ]);

    exit;
}

if (!in_array($category, $allowedCategories, true)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Catégorie invalide."
    ]);

    exit;
}

try {
    $checkStatement = $pdo->prepare(
        "SELECT id
        FROM dishes
        WHERE id = :dish_id"
    );

    $checkStatement->execute([
        "dish_id" => $dishId
    ]);

    if (!$checkStatement->fetch()) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Plat introuvable."
        ]);

        exit;
    }

    $updateStatement = $pdo->prepare(
        "UPDATE dishes
        SET name = :name,
            category = :category,
            allergens = :allergens
        WHERE id = :dish_id"
    );

    $updateStatement->execute([
        "name" => $name,
        "category" => $category,
        "allergens" => $allergens !== "" ? $allergens : null,
        "dish_id" => $dishId
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Plat mis à jour avec succès."
    ]);
} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue."
    ]);
}