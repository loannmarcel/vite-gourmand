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


if (!isset($_SESSION["user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Vous devez être connecté."
    ]);

    exit;
}


$data =
    json_decode(
        file_get_contents("php://input"),
        true
    );


$orderId =
    (int) ($data["order_id"] ?? 0);

$rating =
    (int) ($data["rating"] ?? 0);

$comment =
    trim($data["comment"] ?? "");


if (
    $orderId <= 0 ||
    $rating < 1 ||
    $rating > 5 ||
    $comment === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Veuillez renseigner une note de 1 à 5 et un commentaire."
    ]);

    exit;
}


try {

    $orderStatement = $pdo->prepare(
        "SELECT
            id,
            status
         FROM orders
         WHERE id = :order_id
           AND user_id = :user_id
         LIMIT 1"
    );

    $orderStatement->execute([
        "order_id" => $orderId,
        "user_id" => $_SESSION["user_id"]
    ]);

    $order =
        $orderStatement->fetch(PDO::FETCH_ASSOC);


    if (!$order) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Commande introuvable."
        ]);

        exit;
    }


    if ($order["status"] !== "completed") {
        http_response_code(403);

        echo json_encode([
            "success" => false,
            "message" => "Vous pouvez laisser un avis uniquement après la fin de la commande."
        ]);

        exit;
    }


    $reviewStatement = $pdo->prepare(
        "SELECT id
         FROM reviews
         WHERE order_id = :order_id
           AND user_id = :user_id
         LIMIT 1"
    );

    $reviewStatement->execute([
        "order_id" => $orderId,
        "user_id" => $_SESSION["user_id"]
    ]);


    if ($reviewStatement->fetch(PDO::FETCH_ASSOC)) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "Vous avez déjà laissé un avis pour cette commande."
        ]);

        exit;
    }


    $insertStatement = $pdo->prepare(
        "INSERT INTO reviews (
            user_id,
            order_id,
            rating,
            comment,
            status
        )
        VALUES (
            :user_id,
            :order_id,
            :rating,
            :comment,
            'pending'
        )"
    );

    $insertStatement->execute([
        "user_id" => $_SESSION["user_id"],
        "order_id" => $orderId,
        "rating" => $rating,
        "comment" => $comment
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Votre avis a bien été envoyé et sera publié après validation."
    ]);

} catch (PDOException $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors de l'envoi de votre avis."
    ]);
}