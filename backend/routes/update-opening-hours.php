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


if (
    !isset($data["hours"]) ||
    !is_array($data["hours"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Horaires invalides."
    ]);

    exit;
}


try {

    $pdo->beginTransaction();

    $statement = $pdo->prepare(
        "UPDATE opening_hours
         SET opening_time = :opening_time,
             closing_time = :closing_time
         WHERE day_of_week = :day_of_week"
    );


    foreach ($data["hours"] as $day) {

        $dayOfWeek =
            (int) ($day["day_of_week"] ?? 0);

        $openingTime =
            $day["opening_time"] ?? null;

        $closingTime =
            $day["closing_time"] ?? null;


        if (
            $dayOfWeek < 1 ||
            $dayOfWeek > 5 ||
            !$openingTime ||
            !$closingTime ||
            $openingTime >= $closingTime
        ) {
            $pdo->rollBack();

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Un horaire est invalide."
            ]);

            exit;
        }


        $statement->execute([
            "opening_time" => $openingTime,
            "closing_time" => $closingTime,
            "day_of_week" => $dayOfWeek
        ]);
    }


    $pdo->commit();


    echo json_encode([
        "success" => true,
        "message" => "Les horaires ont bien été enregistrés."
    ]);

} catch (PDOException $error) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors de l'enregistrement des horaires."
    ]);
}