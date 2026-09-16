<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Utilisateur non connecté.'
    ]);

    exit;
}

if (!in_array($_SESSION['user_role'], ['employee', 'admin'], true)) {
    http_response_code(403);

    echo json_encode([
        'success' => false,
        'message' => 'Accès interdit.'
    ]);

    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);

    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Données invalides.'
    ]);

    exit;
}

$menuId = filter_var(
    $input['menu_id'] ?? null,
    FILTER_VALIDATE_INT
);

$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');
$presentationTitle = trim($input['presentation_title'] ?? '');
$presentationText1 = trim($input['presentation_text_1'] ?? '');
$presentationText2 = trim($input['presentation_text_2'] ?? '');
$highlightTitle = trim($input['highlight_title'] ?? '');
$highlightText = trim($input['highlight_text'] ?? '');
$theme = trim($input['theme'] ?? '');
$diet = trim($input['diet'] ?? '');

$minPeople = filter_var(
    $input['min_people'] ?? null,
    FILTER_VALIDATE_INT
);

$basePrice = filter_var(
    $input['base_price'] ?? null,
    FILTER_VALIDATE_FLOAT
);

$stockQuantity = filter_var(
    $input['stock_quantity'] ?? null,
    FILTER_VALIDATE_INT
);

$conditions = trim($input['conditions'] ?? '');

if (
    !$menuId ||
    $name === '' ||
    $description === '' ||
    $theme === '' ||
    $diet === '' ||
    $minPeople === false ||
    $minPeople < 1 ||
    $basePrice === false ||
    $basePrice < 0 ||
    $stockQuantity === false ||
    $stockQuantity < 0
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Veuillez vérifier les informations du menu.'
    ]);

    exit;
}

try {
    $checkStmt = $pdo->prepare("
        SELECT id
        FROM menus
        WHERE id = ?
    ");

    $checkStmt->execute([$menuId]);

    if (!$checkStmt->fetch()) {
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Menu introuvable.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        UPDATE menus
        SET
            name = ?,
            description = ?,
            presentation_title = ?,
            presentation_text_1 = ?,
            presentation_text_2 = ?,
            highlight_title = ?,
            highlight_text = ?,
            theme = ?,
            diet = ?,
            min_people = ?,
            base_price = ?,
            conditions = ?,
            stock_quantity = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $name,
        $description,
        $presentationTitle !== '' ? $presentationTitle : null,
        $presentationText1 !== '' ? $presentationText1 : null,
        $presentationText2 !== '' ? $presentationText2 : null,
        $highlightTitle !== '' ? $highlightTitle : null,
        $highlightText !== '' ? $highlightText : null,
        $theme,
        $diet,
        $minPeople,
        $basePrice,
        $conditions !== '' ? $conditions : null,
        $stockQuantity,
        $menuId
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Menu mis à jour avec succès.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la mise à jour du menu.'
    ]);
}