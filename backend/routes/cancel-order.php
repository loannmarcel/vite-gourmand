<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);

    exit;
}


if (!isset($_SESSION['user_id'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur non connecté.'
    ]);

    exit;
}


$orderId = (int) ($_POST['order_id'] ?? 0);


if ($orderId <= 0) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Identifiant de commande invalide.'
    ]);

    exit;
}


// ========================================
// RÉCUPÉRATION DE LA COMMANDE
// ========================================

$stmt = $pdo->prepare(
    'SELECT
        id,
        status
     FROM orders
     WHERE id = :order_id
       AND user_id = :user_id
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


// ========================================
// VÉRIFICATION DU STATUT
// ========================================

if ($order['status'] !== 'pending') {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Cette commande ne peut plus être annulée.'
    ]);

    exit;
}


// ========================================
// ANNULATION DE LA COMMANDE
// ========================================

try {
    $pdo->beginTransaction();


    $stmt = $pdo->prepare(
        'UPDATE orders
         SET status = :status
         WHERE id = :order_id
           AND user_id = :user_id'
    );


    $stmt->execute([
        'status' => 'cancelled',
        'order_id' => $orderId,
        'user_id' => $_SESSION['user_id']
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
        'message' => 'Impossible d’annuler la commande.'
    ]);
}