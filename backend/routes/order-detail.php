<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';


if (!isset($_SESSION['user_id'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur non connecté.'
    ]);

    exit;
}


$orderId = (int) ($_GET['id'] ?? 0);


if ($orderId <= 0) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Identifiant de commande invalide.'
    ]);

    exit;
}


$stmt = $pdo->prepare(
    'SELECT
        orders.id,
        orders.people,
        orders.delivery_date,
        orders.delivery_time,
        orders.delivery_address,
        orders.delivery_postal_code,
        orders.delivery_city,
        orders.menu_price,
        orders.discount_amount,
        orders.delivery_price,
        orders.total_price,
        orders.status,
        orders.created_at,
        menus.name AS menu_name
     FROM orders
     INNER JOIN menus
        ON menus.id = orders.menu_id
     WHERE orders.id = :order_id
       AND orders.user_id = :user_id
     LIMIT 1'
);


$stmt->execute([
    'order_id' => $orderId,
    'user_id' => $_SESSION['user_id']
]);


$order = $stmt->fetch(PDO::FETCH_ASSOC);


if (!$order) {
    http_response_code(404);

    echo json_encode([
        'success' => false,
        'message' => 'Commande introuvable.'
    ]);

    exit;
}

$reviewStmt = $pdo->prepare(
    'SELECT
        id,
        rating,
        comment,
        status
     FROM reviews
     WHERE order_id = :order_id
       AND user_id = :user_id
     LIMIT 1'
);

$reviewStmt->execute([
    'order_id' => $orderId,
    'user_id' => $_SESSION['user_id']
]);

$review =
    $reviewStmt->fetch(PDO::FETCH_ASSOC);


echo json_encode([
    'success' => true,
    'order' => $order,
    'review' => $review ?: null
]);