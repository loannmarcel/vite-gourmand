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
            id,
            day_of_week,
            opening_time,
            closing_time,
            is_closed,
            is_by_appointment
        FROM opening_hours
        ORDER BY day_of_week ASC"
    );

    $hours =
        $statement->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        "success" => true,
        "hours" => $hours
    ]);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors du chargement des horaires."
    ]);
}