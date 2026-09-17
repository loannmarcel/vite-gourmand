<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/DeliveryService.php';


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
$people = (int) ($_POST['people'] ?? 0);

$deliveryDate = trim($_POST['delivery_date'] ?? '');
$deliveryTime = trim($_POST['delivery_time'] ?? '');

$deliveryAddress = trim($_POST['delivery_address'] ?? '');
$deliveryPostalCode = trim($_POST['delivery_postal_code'] ?? '');
$deliveryCity = trim($_POST['delivery_city'] ?? '');


if (
    $orderId <= 0 ||
    $people <= 0 ||
    $deliveryDate === '' ||
    $deliveryTime === '' ||
    $deliveryAddress === '' ||
    $deliveryPostalCode === '' ||
    $deliveryCity === ''
) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Toutes les informations sont obligatoires.'
    ]);

    exit;
}


// ========================================
// RÉCUPÉRATION DE LA COMMANDE
// ========================================

$stmt = $pdo->prepare(
    'SELECT
        orders.id,
        orders.menu_id,
        orders.status,
        menus.min_people,
        menus.base_price,
        menus.conditions
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


// ========================================
// VÉRIFICATION DU STATUT
// ========================================

if ($order['status'] !== 'pending') {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Cette commande ne peut plus être modifiée.'
    ]);

    exit;
}


// ========================================
// NOMBRE MINIMUM DE PERSONNES
// ========================================

$minPeople = (int) $order['min_people'];

if ($people < $minPeople) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Le nombre de personnes est inférieur au minimum requis.'
    ]);

    exit;
}

// ========================================
// VALIDATION DE LA DATE ET DE L'HEURE
// ========================================

$deliveryDateTime = DateTime::createFromFormat(
    'Y-m-d H:i',
    $deliveryDate . ' ' . $deliveryTime
);

if (!$deliveryDateTime) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'La date ou l’heure de livraison est invalide.'
    ]);

    exit;
}

$now = new DateTime();

if ($deliveryDateTime <= $now) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'La date de livraison doit être dans le futur.'
    ]);

    exit;
}

$orderDelayHours = 0;

if (
    preg_match(
        '/(\d+)\s*h/i',
        (string) $order['conditions'],
        $matches
    )
) {
    $orderDelayHours = (int) $matches[1];
}

$minimumDeliveryDateTime = clone $now;

$minimumDeliveryDateTime->modify(
    '+' . $orderDelayHours . ' hours'
);

if ($deliveryDateTime < $minimumDeliveryDateTime) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Le délai minimum de commande pour ce menu n’est pas respecté.'
    ]);

    exit;
}

$dayOfWeek = (int) $deliveryDateTime->format('N');

$stmt = $pdo->prepare(
    'SELECT
        opening_time,
        closing_time,
        is_closed,
        is_by_appointment
     FROM opening_hours
     WHERE day_of_week = :day_of_week
     LIMIT 1'
);

$stmt->execute([
    'day_of_week' => $dayOfWeek
]);

$openingHours = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$openingHours || (bool) $openingHours['is_closed']) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Aucune livraison n’est possible à cette date.'
    ]);

    exit;
}

if ((bool) $openingHours['is_by_appointment']) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'Les livraisons sur rendez-vous ne peuvent pas être réservées en ligne.'
    ]);

    exit;
}

$deliveryTimeOnly = $deliveryDateTime->format('H:i:s');

if (
    $deliveryTimeOnly < $openingHours['opening_time'] ||
    $deliveryTimeOnly > $openingHours['closing_time']
) {
    http_response_code(422);

    echo json_encode([
        'success' => false,
        'message' => 'L’heure de livraison doit respecter les horaires d’ouverture.'
    ]);

    exit;
}


// ========================================
// RECALCUL DU PRIX
// ========================================

$basePrice = (float) $order['base_price'];

$pricePerPerson =
    $basePrice / $minPeople;

$menuPrice = round(
    $pricePerPerson * $people,
    2
);


$discountThreshold =
    $minPeople + 5;

$discountAmount = 0.00;


if ($people >= $discountThreshold) {
    $discountAmount = round(
        $menuPrice * 0.10,
        2
    );
}


$deliveryService = new DeliveryService();

$deliveryPrice = $deliveryService->calculateDeliveryPrice(
    $deliveryAddress,
    $deliveryPostalCode,
    $deliveryCity
);

$totalPrice = round(
    $menuPrice
    - $discountAmount
    + $deliveryPrice,
    2
);


// ========================================
// MISE À JOUR DE LA COMMANDE
// ========================================

try {
    $stmt = $pdo->prepare(
        'UPDATE orders
         SET
            people = :people,
            delivery_date = :delivery_date,
            delivery_time = :delivery_time,
            delivery_address = :delivery_address,
            delivery_postal_code = :delivery_postal_code,
            delivery_city = :delivery_city,
            menu_price = :menu_price,
            discount_amount = :discount_amount,
            delivery_price = :delivery_price,
            total_price = :total_price
         WHERE id = :order_id
           AND user_id = :user_id'
    );


    $stmt->execute([
        'people' => $people,
        'delivery_date' => $deliveryDate,
        'delivery_time' => $deliveryTime,
        'delivery_address' => $deliveryAddress,
        'delivery_postal_code' => $deliveryPostalCode,
        'delivery_city' => $deliveryCity,
        'menu_price' => $menuPrice,
        'discount_amount' => $discountAmount,
        'delivery_price' => $deliveryPrice,
        'total_price' => $totalPrice,
        'order_id' => $orderId,
        'user_id' => $_SESSION['user_id']
    ]);


    echo json_encode([
        'success' => true,
        'message' => 'Commande modifiée avec succès.'
    ]);


} catch (Throwable $error) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible de modifier la commande.'
    ]);
}