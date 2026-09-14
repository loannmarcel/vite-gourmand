<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';


/* =====================================================
   VÉRIFICATION DE LA MÉTHODE
===================================================== */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

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
   DONNÉES REÇUES
===================================================== */

$orderId =
    filter_input(
        INPUT_POST,
        'order_id',
        FILTER_VALIDATE_INT
    );

$status =
    trim($_POST['status'] ?? '');


$allowedStatuses = [
    'accepted',
    'preparation',
    'delivery',
    'delivered',
    'equipment',
    'completed'
];


if (!$orderId || !in_array($status, $allowedStatuses, true)) {

    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Données invalides.'
    ]);

    exit;
}


/* =====================================================
   VÉRIFICATION DE LA COMMANDE
===================================================== */

$stmt = $pdo->prepare(
    'SELECT id, status
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


if ($order['status'] === 'cancelled') {

    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Une commande annulée ne peut plus être modifiée.'
    ]);

    exit;
}


if ($order['status'] === 'completed') {

    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Une commande terminée ne peut plus être modifiée.'
    ]);

    exit;
}


/* =====================================================
   MISE À JOUR DU STATUT
===================================================== */

try {

    $pdo->beginTransaction();


    $stmt = $pdo->prepare(
        'UPDATE orders
         SET status = :status
         WHERE id = :id'
    );

    $stmt->execute([
        'status' => $status,
        'id' => $orderId
    ]);


    $stmt = $pdo->prepare(
        'INSERT INTO order_status_history (
            order_id,
            status
        )
        VALUES (
            :order_id,
            :status
        )'
    );

    $stmt->execute([
        'order_id' => $orderId,
        'status' => $status
    ]);


    $pdo->commit();


    echo json_encode([
        'success' => true,
        'message' => 'Statut mis à jour.',
        'status' => $status
    ]);


} catch (Throwable $error) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }


    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible de mettre à jour le statut.'
    ]);

}