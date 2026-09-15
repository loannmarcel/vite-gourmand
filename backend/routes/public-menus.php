<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

try {
    $sql = "
        SELECT
            m.id AS menu_id,
            m.name AS menu_name,
            m.description AS menu_description,
            m.presentation_title,
            m.presentation_text_1,
            m.presentation_text_2,
            m.highlight_title,
            m.highlight_text,
            m.theme,
            m.diet,
            m.min_people,
            m.base_price,
            m.preparation_time,
            m.conditions,
            m.is_available,

            (
                SELECT COUNT(*)
                FROM reviews r
                INNER JOIN orders o
                    ON o.id = r.order_id
                WHERE o.menu_id = m.id
                AND r.status = 'approved'
            ) AS review_count,

            (
                SELECT AVG(r.rating)
                FROM reviews r
                INNER JOIN orders o
                    ON o.id = r.order_id
                WHERE o.menu_id = m.id
                AND r.status = 'approved'
            ) AS average_rating,

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
                'presentation_title' => $row['presentation_title'],
                'presentation_text_1' => $row['presentation_text_1'],
                'presentation_text_2' => $row['presentation_text_2'],
                'highlight_title' => $row['highlight_title'],
                'highlight_text' => $row['highlight_text'],
                'theme' => $row['theme'],
                'diet' => $row['diet'],
                'min_people' => (int) $row['min_people'],
                'base_price' => (float) $row['base_price'],
                'preparation_time' => $row['preparation_time'],
                'conditions' => $row['conditions'],
                'is_available' => (bool) $row['is_available'],
                'review_count' => (int) $row['review_count'],
                'average_rating' => $row['average_rating'] !== null
                    ? (float) $row['average_rating']
                    : null,
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
                'position_order' =>
                    (int) $row['position_order']
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
        'message' =>
            'Erreur lors de la récupération des menus.'
    ]);
}