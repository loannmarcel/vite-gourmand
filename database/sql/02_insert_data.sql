-- =====================================================
-- DONNÉES INITIALES - VITE & GOURMAND
-- =====================================================


-- =====================================================
-- HORAIRES D'OUVERTURE
-- 1 = Lundi / 7 = Dimanche
-- =====================================================

INSERT INTO opening_hours (
    day_of_week,
    opening_time,
    closing_time,
    is_closed,
    is_by_appointment
) VALUES
(1, '09:00:00', '18:00:00', FALSE, FALSE),
(2, '09:00:00', '18:00:00', FALSE, FALSE),
(3, '09:00:00', '18:00:00', FALSE, FALSE),
(4, '09:00:00', '18:00:00', FALSE, FALSE),
(5, '09:00:00', '18:00:00', FALSE, FALSE),
(6, NULL, NULL, FALSE, TRUE),
(7, NULL, NULL, TRUE, FALSE);

-- =====================================================
-- MENUS
-- =====================================================

INSERT INTO menus (
    name,
    description,
    theme,
    diet,
    min_people,
    base_price,
    preparation_time,
    is_available
) VALUES (
    'Menu Healthy',
    'Un menu équilibré préparé avec des produits frais et de saison.',
    'healthy',
    'equilibre',
    2,
    89.00,
    '1 à 2 h',
    TRUE
);

INSERT INTO menus (
    name,
    description,
    theme,
    diet,
    min_people,
    base_price,
    preparation_time,
    is_available
) VALUES
(
    'Menu Tradition',
    'Une cuisine traditionnelle, élaborée avec des produits frais et de qualité.',
    'tradition',
    'classique',
    2,
    65.00,
    '1 à 2 h',
    TRUE
),
(
    'Menu Événement',
    'Un menu pensé pour vos événements, élaboré avec des produits frais.',
    'evenement',
    'festif',
    6,
    160.00,
    '24 h',
    TRUE
),
(
    'Menu Végétarien',
    'Des recettes végétariennes colorées et généreuses, préparées avec des produits frais et de saison.',
    'vegetarien',
    'vegetarien',
    2,
    75.00,
    '1 à 2 h',
    TRUE
),
(
    'Menu Méditerranéen',
    'Un voyage en Méditerranée autour de recettes fraîches, parfumées et inspirées des saveurs du soleil.',
    'mediterraneen',
    'mediterraneen',
    2,
    95.00,
    '2 h',
    TRUE
),
(
    'Menu Brunch',
    'Une sélection généreuse de recettes sucrées et salées pour partager un brunch gourmand et convivial.',
    'brunch',
    'classique',
    2,
    55.00,
    '30 à 60 min',
    TRUE
);