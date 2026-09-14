<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';


/* =====================================================
   VÉRIFICATION DE LA MÉTHODE
===================================================== */

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {

    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);

    exit;
}


/* =====================================================
   VÉRIFICATION DE LA CONNEXION
===================================================== */

if (!isset($_SESSION['user_id'], $_SESSION['user_role'])) {

    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Vous devez être connecté.'
    ]);

    exit;
}


/* =====================================================
   VÉRIFICATION DU RÔLE
===================================================== */

$allowedRoles = [
    'employee',
    'admin'
];

if (!in_array($_SESSION['user_role'], $allowedRoles, true)) {

    http_response_code(403);

    echo json_encode([
        'success' => false,
        'message' => 'Accès interdit.'
    ]);

    exit;
}


/* =====================================================
   RÉCUPÉRATION DES COMMANDES
===================================================== */

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

        users.first_name,
        users.last_name,
        users.email,
        users.phone,

        menus.name AS menu_name

    FROM orders

    INNER JOIN users
        ON users.id = orders.user_id

    INNER JOIN menus
        ON menus.id = orders.menu_id

    ORDER BY
        orders.created_at DESC,
        orders.id DESC'
);

$stmt->execute();

$orders = $stmt->fetchAll();


/* =====================================================
   RÉPONSE JSON
===================================================== */

echo json_encode([
    'success' => true,
    'orders' => $orders
]);