<?php

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


try {

    $statement = $pdo->query(
        "SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            u.first_name,
            u.last_name
        FROM reviews r
        INNER JOIN users u
            ON u.id = r.user_id
        WHERE r.status = 'approved'
        ORDER BY r.created_at DESC
        LIMIT 3"
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