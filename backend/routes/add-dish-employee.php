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

$menuId = (int) ($data["menu_id"] ?? 0);
$name = trim($data["name"] ?? "");
$category = trim($data["category"] ?? "");

$allowedCategories = [
    "starter",
    "main",
    "dessert"
];

if ($menuId <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Menu invalide."
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
    $menuStatement = $pdo->prepare(
        "SELECT id
        FROM menus
        WHERE id = :menu_id"
    );

    $menuStatement->execute([
        "menu_id" => $menuId
    ]);

    if (!$menuStatement->fetch()) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Menu introuvable."
        ]);

        exit;
    }

    $pdo->beginTransaction();

    $dishStatement = $pdo->prepare(
        "INSERT INTO dishes (
            name,
            category
        )
        VALUES (
            :name,
            :category
        )"
    );

    $dishStatement->execute([
        "name" => $name,
        "category" => $category
    ]);

    $dishId = (int) $pdo->lastInsertId();

    $positionStatement = $pdo->prepare(
        "SELECT COALESCE(MAX(position_order), 0) + 1
        FROM menu_dishes
        WHERE menu_id = :menu_id"
    );

    $positionStatement->execute([
        "menu_id" => $menuId
    ]);

    $positionOrder =
        (int) $positionStatement->fetchColumn();

    $linkStatement = $pdo->prepare(
        "INSERT INTO menu_dishes (
            menu_id,
            dish_id,
            position_order
        )
        VALUES (
            :menu_id,
            :dish_id,
            :position_order
        )"
    );

    $linkStatement->execute([
        "menu_id" => $menuId,
        "dish_id" => $dishId,
        "position_order" => $positionOrder
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Plat ajouté avec succès.",
        "dish_id" => $dishId
    ]);
} catch (PDOException $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue."
    ]);
}