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
   IDENTIFIANT DE LA COMMANDE
===================================================== */

$orderId =
    filter_input(
        INPUT_GET,
        'order_id',
        FILTER_VALIDATE_INT
    );


if (!$orderId) {

    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Identifiant de commande invalide.'
    ]);

    exit;
}


/* =====================================================
   VÉRIFICATION DE LA COMMANDE
===================================================== */

$stmt = $pdo->prepare(
    'SELECT id
     FROM orders
     WHERE id = :id
     LIMIT 1'
);

$stmt->execute([
    'id' => $orderId
]);

$order = $stmt->fetch();


if (!$order) {

    http_response_code(404);

    echo json_encode([
        'success' => false,
        'message' => 'Commande introuvable.'
    ]);

    exit;
}


/* =====================================================
   HISTORIQUE DES STATUTS
===================================================== */

$stmt = $pdo->prepare(
    'SELECT
        id,
        status,
        changed_at
     FROM order_status_history
     WHERE order_id = :order_id
     ORDER BY changed_at ASC, id ASC'
);

$stmt->execute([
    'order_id' => $orderId
]);

$history = $stmt->fetchAll();


/* =====================================================
   RÉPONSE JSON
===================================================== */

echo json_encode([
    'success' => true,
    'order_id' => $orderId,
    'history' => $history
]);