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


$stmt = $pdo->prepare(
    'SELECT
        orders.id,
        orders.people,
        orders.delivery_date,
        orders.delivery_time,
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
     WHERE orders.user_id = :user_id
     ORDER BY orders.created_at DESC'
);


$stmt->execute([
    'user_id' => $_SESSION['user_id']
]);


$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);


echo json_encode([
    'success' => true,
    'orders' => $orders
]);