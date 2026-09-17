<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/MailerService.php';
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


$menuId = (int) ($_POST['menu_id'] ?? 0);
$people = (int) ($_POST['people'] ?? 0);

$deliveryDate = trim($_POST['delivery_date'] ?? '');
$deliveryTime = trim($_POST['delivery_time'] ?? '');

$deliveryAddress = trim($_POST['delivery_address'] ?? '');
$deliveryPostalCode = trim($_POST['delivery_postal_code'] ?? '');
$deliveryCity = trim($_POST['delivery_city'] ?? '');


if (
    $menuId <= 0 ||
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
        'message' => 'Toutes les informations de la commande sont obligatoires.'
    ]);

    exit;
}

// ========================================
// RÉCUPÉRATION DU CLIENT
// ========================================

$stmt = $pdo->prepare(
    'SELECT first_name, last_name, email
     FROM users
     WHERE id = :id
     LIMIT 1'
);

$stmt->execute([
    'id' => $_SESSION['user_id']
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur introuvable.'
    ]);

    exit;
}


// ========================================
// RÉCUPÉRATION DU MENU
// ========================================

$stmt = $pdo->prepare(
    'SELECT
        id,
        name,
        min_people,
        base_price,
        conditions,
        stock_quantity,
        is_available
     FROM menus
     WHERE id = :id
     LIMIT 1'
);

$stmt->execute([
    'id' => $menuId
]);

$menu = $stmt->fetch(PDO::FETCH_ASSOC);


if (!$menu) {
    http_response_code(404);

    echo json_encode([
        'success' => false,
        'message' => 'Menu introuvable.'
    ]);

    exit;
}


if (!(bool) $menu['is_available']) {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Ce menu n’est actuellement pas disponible.'
    ]);

    exit;
}

// ========================================
// STOCK DISPONIBLE
// ========================================

$stockQuantity = (int) $menu['stock_quantity'];

if ($stockQuantity <= 0) {
    http_response_code(409);

    echo json_encode([
        'success' => false,
        'message' => 'Ce menu est actuellement en rupture de stock.'
    ]);

    exit;
}


// ========================================
// NOMBRE MINIMUM DE PERSONNES
// ========================================

$minPeople = (int) $menu['min_people'];

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
        (string) $menu['conditions'],
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
// CALCUL DU PRIX CÔTÉ SERVEUR
// ========================================

$basePrice = (float) $menu['base_price'];

$pricePerPerson = $basePrice / $minPeople;

$menuPrice = round(
    $pricePerPerson * $people,
    2
);


// Réduction de 10 % lorsque le nombre
// de personnes atteint minimum + 5

$discountThreshold = $minPeople + 5;

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
// ENREGISTREMENT DE LA COMMANDE
// ========================================

try {
    $pdo->beginTransaction();


    $stmt = $pdo->prepare(
        'INSERT INTO orders (
            user_id,
            menu_id,
            people,
            delivery_date,
            delivery_time,
            delivery_address,
            delivery_postal_code,
            delivery_city,
            menu_price,
            discount_amount,
            delivery_price,
            total_price,
            status
        )
        VALUES (
            :user_id,
            :menu_id,
            :people,
            :delivery_date,
            :delivery_time,
            :delivery_address,
            :delivery_postal_code,
            :delivery_city,
            :menu_price,
            :discount_amount,
            :delivery_price,
            :total_price,
            :status
        )'
    );


    $stmt->execute([
        'user_id' => $_SESSION['user_id'],
        'menu_id' => $menuId,
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
        'status' => 'pending'
    ]);


    $orderId = (int) $pdo->lastInsertId();


    // Premier statut dans l'historique

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
        'status' => 'pending'
    ]);

    // ========================================
    // MISE À JOUR DU STOCK
    // ========================================

    $stmt = $pdo->prepare(
        'UPDATE menus
        SET stock_quantity = stock_quantity - 1,
            is_available = CASE
                WHEN stock_quantity - 1 <= 0 THEN 0
                ELSE is_available
            END
        WHERE id = :menu_id
        AND stock_quantity > 0'
    );

    $stmt->execute([
        'menu_id' => $menuId
    ]);

    if ($stmt->rowCount() !== 1) {
        throw new RuntimeException(
            'Le stock de ce menu n’est plus disponible.'
        );
    }

    $pdo->commit();

    MailerService::send(
        $user['email'],
        $user['first_name'] . ' ' . $user['last_name'],
        'Confirmation de votre commande Vite & Gourmand',
        '<h1>Commande confirmée</h1>
        <p>Bonjour ' . htmlspecialchars($user['first_name'], ENT_QUOTES, 'UTF-8') . ',</p>
        <p>Votre commande n°' . $orderId . ' a bien été enregistrée.</p>
        <p><strong>Menu :</strong> ' . htmlspecialchars($menu['name'], ENT_QUOTES, 'UTF-8') . '</p>
        <p><strong>Nombre de personnes :</strong> ' . $people . '</p>
        <p><strong>Date de livraison :</strong> ' . htmlspecialchars($deliveryDate, ENT_QUOTES, 'UTF-8') . '</p>
        <p><strong>Heure de livraison :</strong> ' . htmlspecialchars($deliveryTime, ENT_QUOTES, 'UTF-8') . '</p>
        <p><strong>Montant total :</strong> ' . number_format($totalPrice, 2, ',', ' ') . ' €</p>
        <p>Merci pour votre commande.</p>
        <p>À bientôt,<br>L’équipe Vite & Gourmand</p>'
    );


    echo json_encode([
        'success' => true,
        'message' => 'Commande enregistrée avec succès.',
        'order' => [
            'id' => $orderId,
            'menu' => $menu['name'],
            'people' => $people,
            'delivery_date' => $deliveryDate,
            'delivery_time' => $deliveryTime,
            'menu_price' => $menuPrice,
            'discount_amount' => $discountAmount,
            'delivery_price' => $deliveryPrice,
            'total_price' => $totalPrice,
            'status' => 'pending'
        ]
    ]);


} catch (Throwable $error) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }


    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Impossible d’enregistrer la commande.'
    ]);
}