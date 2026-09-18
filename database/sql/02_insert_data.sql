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
    conditions,
    stock_quantity,
    is_available
) VALUES
(
    'Menu Healthy',
    'Un menu équilibré préparé avec des produits frais et de saison.',
    'healthy',
    'equilibre',
    2,
    89.00,
    '1 à 2 h',
    'Commande à effectuer au moins 24 h à l''avance.',
    4,
    TRUE
),
(
    'Menu Tradition',
    'Une cuisine traditionnelle, élaborée avec des produits frais et de qualité.',
    'tradition',
    'classique',
    2,
    65.00,
    '1 à 2 h',
    'Commande à effectuer au moins 24 h à l''avance.',
    5,
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
    'Commande à effectuer au moins 48 h à l''avance.',
    5,
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
    'Commande à effectuer au moins 24 h à l''avance.',
    5,
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
    'Commande à effectuer au moins 24 h à l''avance.',
    1,
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
    'Commande à effectuer au moins 24 h à l''avance.',
    5,
    TRUE
);


-- =====================================================
-- UTILISATEURS DE DÉMONSTRATION
-- =====================================================

INSERT INTO users (
    first_name,
    last_name,
    phone,
    email,
    address,
    postal_code,
    city,
    password_hash,
    role,
    is_active
) VALUES
(
    'Salut',
    'Gourmand',
    NULL,
    'salut@gmail.com',
    NULL,
    NULL,
    NULL,
    '$2y$12$xg5Bv/WOtnZGVF8E1Ga2se9WE.FxJNhO714ucxKeAsQilH4DtYY5O',
    'user',
    TRUE
),
(
    'Employé',
    'Vite & Gourmand',
    NULL,
    'employe@vite-gourmand.fr',
    NULL,
    NULL,
    NULL,
    '$2y$12$bTVjerkax5qqF3KF1OYPIOxCbqZCHk.stBi2cUXd05jum8ZN20IUG',
    'employee',
    TRUE
),
(
    'José',
    'Gourmand',
    NULL,
    'jose@vite-gourmand.fr',
    NULL,
    NULL,
    NULL,
    '$2y$12$Xp28hqxvj56rgghLWu37CeNd/cQo.pjHfUV21ZaNZyhLzisk7ujbu',
    'admin',
    TRUE
);


-- =====================================================
-- IMAGES DES MENUS
-- =====================================================

INSERT INTO menu_images (
    menu_id,
    image_path,
    alt_text,
    position_order
) VALUES
(1, 'frontend/assets/images/menu-healthy.jpg', NULL, 1),
(2, 'frontend/assets/images/menu-tradition.jpg', NULL, 1),
(3, 'frontend/assets/images/menu-evenement.jpg', NULL, 1),
(4, 'frontend/assets/images/menu-vegetarien.png', NULL, 1),
(5, 'frontend/assets/images/menu-mediterraneen.png', NULL, 1),
(6, 'frontend/assets/images/menu-brunch.png', NULL, 1);


-- =====================================================
-- PLATS
-- =====================================================

INSERT INTO dishes (
    name,
    description,
    category,
    allergens
) VALUES
(
    'Bowl de quinoa aux légumes de saison, avocat, graines et sauce yaourt citronnée.',
    NULL,
    'starter',
    'Lait'
),
(
    'Saumon grillé accompagné de pois chiches, concombre, tomates cerises, chou rouge, oeuf, salade et herbes fraîches.',
    NULL,
    'main',
    'Gluten'
),
(
    'Mousse au chocolat noir accompagnée de fruits rouges et de noisettes.',
    NULL,
    'dessert',
    'Fruits à coque'
),
(
    'Œuf parfait accompagné d''une crème de champignons et de croûtons dorés.',
    NULL,
    'starter',
    'Lait'
),
(
    'Pièces de bœuf grillées accompagnées de légumes de saison et d''une sauce crémeuse aux herbes.',
    NULL,
    'main',
    'Gluten'
),
(
    'Tarte aux pommes maison accompagnée d''une crème légère à la vanille.',
    NULL,
    'dessert',
    'Gluten, Lait, Œufs'
),
(
    'Assortiment de bouchées apéritives maison à partager.',
    NULL,
    'starter',
    'Gluten'
),
(
    'Mini feuilletés garnis et pièces salées accompagnés de légumes de saison.',
    NULL,
    'main',
    'Gluten, Lait'
),
(
    'Assortiment de mignardises sucrées et gourmandes.',
    NULL,
    'dessert',
    'Gluten, Lait, Œufs'
),
(
    'Velouté de légumes de saison accompagné de graines torréfiées.',
    NULL,
    'starter',
    'Fruits à coque'
),
(
    'Assiette de légumes rôtis, quinoa et pois chiches, accompagnée d’une sauce aux herbes.',
    NULL,
    'main',
    'Lait'
),
(
    'Panna cotta à la vanille accompagnée de fruits frais et d’amandes.',
    NULL,
    'dessert',
    'Lait, Fruits à coque'
),
(
    'Bruschetta aux tomates fraîches, olives et herbes méditerranéennes.',
    NULL,
    'starter',
    'Gluten'
),
(
    'Poisson grillé accompagné de légumes méditerranéens, d’olives et d’une sauce citronnée aux herbes.',
    NULL,
    'main',
    'Poissons'
),
(
    'Yaourt à la grecque accompagné de miel et de fruits frais.',
    NULL,
    'dessert',
    'Lait'
),
(
    'Salade de fruits frais accompagnée d’amandes et d’un filet de miel.',
    NULL,
    'starter',
    'Lait'
),
(
    'Pancakes aux fruits rouges accompagnés d’un avocado toast à l’œuf.',
    NULL,
    'main',
    'Œufs, Gluten'
),
(
    'Sélection de douceurs maison accompagnée d’une boisson chaude.',
    NULL,
    'dessert',
    'Gluten, Lait'
);


-- =====================================================
-- LIAISON MENUS / PLATS
-- =====================================================

INSERT INTO menu_dishes (
    menu_id,
    dish_id,
    position_order
) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),

(2, 4, 1),
(2, 5, 2),
(2, 6, 3),

(3, 7, 1),
(3, 8, 2),
(3, 9, 3),

(4, 10, 1),
(4, 11, 2),
(4, 12, 3),

(5, 13, 1),
(5, 14, 2),
(5, 15, 3),

(6, 16, 1),
(6, 17, 2),
(6, 18, 3);