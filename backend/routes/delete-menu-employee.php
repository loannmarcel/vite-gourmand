<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/database.php";

if (
    !isset($_SESSION["user_id"]) ||
    !isset($_SESSION["user_role"])
) {
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

if ($menuId <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Menu invalide."
    ]);

    exit;
}

try {

    $checkStatement = $pdo->prepare(
        "SELECT id
         FROM menus
         WHERE id = :menu_id"
    );

    $checkStatement->execute([
        "menu_id" => $menuId
    ]);

    if (!$checkStatement->fetch()) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Menu introuvable."
        ]);

        exit;
    }

    $pdo->beginTransaction();

    $getDishIdsStatement = $pdo->prepare(
        "SELECT dish_id
        FROM menu_dishes
        WHERE menu_id = :menu_id"
    );

    $getDishIdsStatement->execute([
        "menu_id" => $menuId
    ]);

    $dishIds = $getDishIdsStatement->fetchAll(
        PDO::FETCH_COLUMN
    );

    $deleteLinksStatement = $pdo->prepare(
        "DELETE FROM menu_dishes
         WHERE menu_id = :menu_id"
    );

    $deleteLinksStatement->execute([
        "menu_id" => $menuId
    ]);

    $deleteMenuStatement = $pdo->prepare(
        "DELETE FROM menus
         WHERE id = :menu_id"
    );

    $deleteMenuStatement->execute([
        "menu_id" => $menuId
    ]);

    $deleteOrphanDishStatement = $pdo->prepare(
        "DELETE FROM dishes
        WHERE id = :dish_id
        AND NOT EXISTS (
            SELECT 1
            FROM menu_dishes
            WHERE menu_dishes.dish_id = dishes.id
        )"
    );

    foreach ($dishIds as $dishId) {
        $deleteOrphanDishStatement->execute([
            "dish_id" => (int) $dishId
        ]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Menu supprimé avec succès."
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