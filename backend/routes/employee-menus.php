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

try {
    $sql = "
        SELECT
            m.id AS menu_id,
            m.name AS menu_name,
            m.description AS menu_description,
            m.theme,
            m.diet,
            m.min_people,
            m.base_price,
            m.preparation_time,
            m.conditions,
            m.stock_quantity,
            m.is_available,

            (
                SELECT mi.image_path
                FROM menu_images mi
                WHERE mi.menu_id = m.id
                ORDER BY mi.position_order ASC, mi.id ASC
                LIMIT 1
            ) AS image_path,

            d.id AS dish_id,
            d.name AS dish_name,
            d.description AS dish_description,
            d.category,
            d.allergens,

            md.position_order
        FROM menus m
        LEFT JOIN menu_dishes md
            ON md.menu_id = m.id
        LEFT JOIN dishes d
            ON d.id = md.dish_id
        ORDER BY
            m.id ASC,
            md.position_order ASC
    ";

    $stmt = $pdo->query($sql);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $menus = [];

    foreach ($rows as $row) {
        $menuId = (int) $row['menu_id'];

        if (!isset($menus[$menuId])) {
            $menus[$menuId] = [
                'id' => $menuId,
                'name' => $row['menu_name'],
                'description' => $row['menu_description'],
                'theme' => $row['theme'],
                'diet' => $row['diet'],
                'min_people' => (int) $row['min_people'],
                'base_price' => (float) $row['base_price'],
                'preparation_time' => $row['preparation_time'],
                'conditions' => $row['conditions'],
                'stock_quantity' => (int) $row['stock_quantity'],
                'is_available' => (bool) $row['is_available'],
                'image_path' => $row['image_path'],
                'dishes' => []
            ];
        }

        if ($row['dish_id'] !== null) {
            $menus[$menuId]['dishes'][] = [
                'id' => (int) $row['dish_id'],
                'name' => $row['dish_name'],
                'description' => $row['dish_description'],
                'category' => $row['category'],
                'allergens' => $row['allergens'],
                'position_order' => (int) $row['position_order']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'menus' => array_values($menus)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des menus.'
    ]);
}