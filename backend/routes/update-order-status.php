<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/MailerService.php';


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
    'SELECT
        orders.id,
        orders.status,
        users.first_name,
        users.last_name,
        users.email
     FROM orders
     INNER JOIN users
        ON users.id = orders.user_id
     WHERE orders.id = :id
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

    if ($status === 'accepted') {

        MailerService::send(
            $order['email'],
            $order['first_name'] . ' ' . $order['last_name'],
            'Commande acceptée - Vite & Gourmand',
            '<h1>Votre commande a été acceptée</h1>
            <p>Bonjour ' . htmlspecialchars($order['first_name'], ENT_QUOTES, 'UTF-8') . ',</p>
            <p>Bonne nouvelle ! Votre commande n°' . $orderId . ' a bien été acceptée par Vite & Gourmand.</p>
            <p>Nous vous tiendrons informé de son avancement.</p>
            <p>Merci pour votre confiance.</p>
            <p>À bientôt,<br>L’équipe Vite & Gourmand</p>'
        );
    }

    if ($status === 'delivery') {

        MailerService::send(
            $order['email'],
            $order['first_name'] . ' ' . $order['last_name'],
            'Votre commande est en cours de livraison - Vite & Gourmand',
            '<h1>Votre commande est en cours de livraison</h1>
            <p>Bonjour ' . htmlspecialchars($order['first_name'], ENT_QUOTES, 'UTF-8') . ',</p>
            <p>Votre commande n°' . $orderId . ' est maintenant en cours de livraison.</p>
            <p>Elle vous sera livrée à l’adresse indiquée lors de votre commande.</p>
            <p>À bientôt,<br>L’équipe Vite & Gourmand</p>'
        );
    }

    if ($status === 'equipment') {

        MailerService::send(
            $order['email'],
            $order['first_name'] . ' ' . $order['last_name'],
            'Retour du matériel - Vite & Gourmand',
            '<h1>Retour du matériel</h1>
            <p>Bonjour ' . htmlspecialchars($order['first_name'], ENT_QUOTES, 'UTF-8') . ',</p>
            <p>Votre commande n°' . $orderId . ' est maintenant en attente du retour du matériel.</p>
            <p>Nous vous rappelons que le matériel doit être restitué dans un délai de <strong>10 jours ouvrés</strong>.</p>
            <p>Passé ce délai, des frais de <strong>600 €</strong> pourront être appliqués conformément aux conditions générales de vente.</p>
            <p>Pour organiser le retour du matériel, merci de prendre contact avec Vite & Gourmand.</p>
            <p>À bientôt,<br>L’équipe Vite & Gourmand</p>'
        );
    }

    if ($status === 'completed') {

        MailerService::send(
            $order['email'],
            $order['first_name'] . ' ' . $order['last_name'],
            'Donnez votre avis - Vite & Gourmand',
            '<h1>Votre commande est terminée</h1>
            <p>Bonjour ' . htmlspecialchars($order['first_name'], ENT_QUOTES, 'UTF-8') . ',</p>
            <p>Votre commande n°' . $orderId . ' est maintenant terminée.</p>
            <p>Vous pouvez vous connecter à votre espace Vite & Gourmand et accéder à cette commande pour nous laisser votre avis.</p>
            <p>Vous pourrez attribuer une note de 1 à 5 et ajouter un commentaire.</p>
            <p>Merci pour votre confiance.</p>
            <p>À bientôt,<br>L’équipe Vite & Gourmand</p>'
        );
    }


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