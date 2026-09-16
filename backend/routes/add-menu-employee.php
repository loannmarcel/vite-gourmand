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

$name = trim($data["name"] ?? "");
$description = trim($data["description"] ?? "");

$presentationTitle = trim($data["presentation_title"] ?? "");
$presentationText1 = trim($data["presentation_text_1"] ?? "");
$presentationText2 = trim($data["presentation_text_2"] ?? "");
$highlightTitle = trim($data["highlight_title"] ?? "");
$highlightText = trim($data["highlight_text"] ?? "");

$theme = trim($data["theme"] ?? "");
$diet = trim($data["diet"] ?? "");
$minPeople = (int) ($data["min_people"] ?? 0);
$basePrice = (float) ($data["base_price"] ?? 0);

$preparationTime = trim(
    $data["preparation_time"] ?? "1 à 2 h"
);

$stockQuantity = (int) ($data["stock_quantity"] ?? 0);
$conditions = trim($data["conditions"] ?? "");

if (
    $name === "" ||
    $description === "" ||
    $theme === "" ||
    $diet === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Tous les champs obligatoires doivent être remplis."
    ]);

    exit;
}

if ($minPeople < 1) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Le nombre minimum de personnes doit être supérieur ou égal à 1."
    ]);

    exit;
}

if ($basePrice < 0 || $stockQuantity < 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Le prix et le stock doivent être positifs."
    ]);

    exit;
}

try {
    $statement = $pdo->prepare(
        "INSERT INTO menus (
            name,
            description,
            presentation_title,
            presentation_text_1,
            presentation_text_2,
            highlight_title,
            highlight_text,
            theme,
            diet,
            min_people,
            base_price,
            preparation_time,
            conditions,
            stock_quantity,
            is_available
        )
        VALUES (
            :name,
            :description,
            :presentation_title,
            :presentation_text_1,
            :presentation_text_2,
            :highlight_title,
            :highlight_text,
            :theme,
            :diet,
            :min_people,
            :base_price,
            :preparation_time,
            :conditions,
            :stock_quantity,
            1
        )"
    );

    $statement->execute([
        "name" => $name,
        "description" => $description,
        "presentation_title" => $presentationTitle !== "" ? $presentationTitle : null,
        "presentation_text_1" => $presentationText1 !== "" ? $presentationText1 : null,
        "presentation_text_2" => $presentationText2 !== "" ? $presentationText2 : null,
        "highlight_title" => $highlightTitle !== "" ? $highlightTitle : null,
        "highlight_text" => $highlightText !== "" ? $highlightText : null,
        "theme" => $theme,
        "diet" => $diet,
        "min_people" => $minPeople,
        "base_price" => $basePrice,
        "preparation_time" => $preparationTime,
        "conditions" => $conditions !== "" ? $conditions : null,
        "stock_quantity" => $stockQuantity
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Menu ajouté avec succès.",
        "menu_id" => (int) $pdo->lastInsertId()
    ]);
} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue."
    ]);
}