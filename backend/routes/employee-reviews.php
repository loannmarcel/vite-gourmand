<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée."
    ]);

    exit;
}


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
        "message" => "Accès non autorisé."
    ]);

    exit;
}


try {

    $statement = $pdo->query(
        "SELECT
            r.id,
            r.rating,
            r.comment,
            r.status,
            r.created_at,
            u.first_name,
            u.last_name,
            m.name AS menu_name,
            o.id AS order_id
        FROM reviews r
        INNER JOIN users u
            ON u.id = r.user_id
        INNER JOIN orders o
            ON o.id = r.order_id
        INNER JOIN menus m
            ON m.id = o.menu_id
        ORDER BY r.created_at DESC"
    );

    $reviews =
        $statement->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        "success" => true,
        "reviews" => $reviews
    ]);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors du chargement des avis."
    ]);
}