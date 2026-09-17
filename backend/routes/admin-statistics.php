<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/mongodb.php";

if (!isset($_SESSION["user_id"], $_SESSION["user_role"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Vous devez être connecté."
    ]);

    exit;
}

if ($_SESSION["user_role"] !== "admin") {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Accès réservé à l'administrateur."
    ]);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée."
    ]);

    exit;
}

try {
    $period = $_GET["period"] ?? "all";

    $allowedPeriods = [
        "all",
        "30",
        "90",
        "365"
    ];

    if (!in_array($period, $allowedPeriods, true)) {
        $period = "all";
    }

    $dateCondition = "";

    if ($period !== "all") {
        $dateCondition =
            "AND o.created_at >= DATE_SUB(
                NOW(),
                INTERVAL " . (int) $period . " DAY
            )";
    }

    $statement = $pdo->prepare(
        "SELECT
            m.id AS menu_id,
            m.name AS menu_name,
            COUNT(o.id) AS order_count,
            COALESCE(SUM(o.total_price), 0) AS revenue
        FROM menus m
        LEFT JOIN orders o
            ON o.menu_id = m.id
            AND o.status = 'completed'
            $dateCondition
        GROUP BY m.id, m.name
        ORDER BY m.id"
    );

    $statement->execute();

    $statistics = $statement->fetchAll(
        PDO::FETCH_ASSOC
    );

    $bulk = new MongoDB\Driver\BulkWrite();

    foreach ($statistics as $statistic) {
        $bulk->update(
            [
                "menu_id" => (int) $statistic["menu_id"]
            ],
            [
                '$set' => [
                    "menu_id" =>
                        (int) $statistic["menu_id"],

                    "menu_name" =>
                        $statistic["menu_name"],

                    "order_count" =>
                        (int) $statistic["order_count"],

                    "revenue" =>
                        (float) $statistic["revenue"],

                    "updated_at" =>
                        new MongoDB\BSON\UTCDateTime()
                ]
            ],
            [
                "upsert" => true
            ]
        );
    }

    $mongoManager->executeBulkWrite(
        "vite_gourmand.menu_statistics",
        $bulk
    );

    $query = new MongoDB\Driver\Query(
        [],
        [
            "sort" => [
                "menu_id" => 1
            ]
        ]
    );

    $mongoCursor = $mongoManager->executeQuery(
        "vite_gourmand.menu_statistics",
        $query
    );

    $mongoStatistics = [];

    foreach ($mongoCursor as $document) {
        $mongoStatistics[] = [
            "menu_id" =>
                (int) $document->menu_id,

            "menu_name" =>
                $document->menu_name,

            "order_count" =>
                (int) $document->order_count,

            "revenue" =>
                (float) $document->revenue
        ];
    }

    echo json_encode([
        "success" => true,
        "statistics" => $mongoStatistics
    ]);

} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" =>
            "Erreur lors de la récupération des statistiques."
    ]);
}