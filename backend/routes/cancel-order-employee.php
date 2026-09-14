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

$contactMethod =
    trim($_POST['contact_method'] ?? '');

$reason =
    trim($_POST['reason'] ?? '');


$allowedContactMethods = [
    'phone',
    'email'
];


if (
    !$orderId ||
    !in_array(
        $contactMethod,
        $allowedContactMethods,
        true
    ) ||
    $reason === ''
) {

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
        'message' => 'Cette commande est déjà annulée.'
    ]);

    exit;
}


if ($order['status'] === 'completed') {

    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Une commande terminée ne peut plus être annulée.'
    ]);

    exit;
}


/* =====================================================
   ANNULATION
===================================================== */

try {

    $pdo->beginTransaction();


    $stmt = $pdo->prepare(
        'INSERT INTO order_cancellations (
            order_id,
            cancelled_by,
            contact_method,
            reason
        )
        VALUES (
            :order_id,
            :cancelled_by,
            :contact_method,
            :reason
        )'
    );

    $stmt->execute([
        'order_id' => $orderId,
        'cancelled_by' => $_SESSION['user_id'],
        'contact_method' => $contactMethod,
        'reason' => $reason
    ]);


    $stmt = $pdo->prepare(
        'UPDATE orders
         SET status = :status
         WHERE id = :id'
    );

    $stmt->execute([
        'status' => 'cancelled',
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
        'status' => 'cancelled'
    ]);


    $pdo->commit();


    echo json_encode([
        'success' => true,
        'message' => 'Commande annulée avec succès.'
    ]);


} catch (Throwable $error) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }


    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible d\'annuler la commande.'
    ]);

}