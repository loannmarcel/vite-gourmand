<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/database.php";


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
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


$data =
    json_decode(
        file_get_contents("php://input"),
        true
    );


$reviewId =
    (int) ($data["review_id"] ?? 0);

$status =
    $data["status"] ?? "";


if (
    $reviewId <= 0 ||
    !in_array(
        $status,
        ["approved", "rejected"],
        true
    )
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Données invalides."
    ]);

    exit;
}


try {

    $reviewStatement = $pdo->prepare(
        "SELECT id, status
         FROM reviews
         WHERE id = :review_id
         LIMIT 1"
    );

    $reviewStatement->execute([
        "review_id" => $reviewId
    ]);

    $review =
        $reviewStatement->fetch(PDO::FETCH_ASSOC);


    if (!$review) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Avis introuvable."
        ]);

        exit;
    }


    if ($review["status"] !== "pending") {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "Cet avis a déjà été traité."
        ]);

        exit;
    }


    $updateStatement = $pdo->prepare(
        "UPDATE reviews
         SET status = :status
         WHERE id = :review_id"
    );

    $updateStatement->execute([
        "status" => $status,
        "review_id" => $reviewId
    ]);


    echo json_encode([
        "success" => true,
        "message" =>
            $status === "approved"
                ? "L'avis a bien été validé."
                : "L'avis a bien été refusé."
    ]);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors du traitement de l'avis."
    ]);
}