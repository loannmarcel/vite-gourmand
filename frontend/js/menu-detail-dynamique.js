const parametresUrl = new URLSearchParams(
    window.location.search
);

const menuId = Number(
    parametresUrl.get("id")
);

console.log(
    "ID du menu demandé :",
    menuId
);

async function chargerMenu() {
    try {
        const response = await fetch(
            "../backend/routes/public-menus.php"
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                "Impossible de récupérer les menus."
            );
        }

        const menu = data.menus.find(
            (menu) => Number(menu.id) === menuId
        );

        if (!menu) {
            throw new Error(
                "Menu introuvable."
            );
        }

        console.log(
            "Menu récupéré :",
            menu
        );

        const menuTitle = document.querySelector(
            "#menu-detail-title"
        );

        menuTitle.textContent = menu.name;

        const menuDescription = document.querySelector(
            "#menu-detail-description"
        );

        menuDescription.textContent = menu.description;

        const menuPrice = document.querySelector(
            "#menu-detail-price"
        );

        menuPrice.textContent = Number(
            menu.base_price
        ).toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR"
        });

        const menuMinPeople = document.querySelector(
            "#menu-detail-min-people"
        );

        menuMinPeople.textContent =
            `${menu.min_people} personnes`;

        const menuPreparation = document.querySelector(
            "#menu-detail-preparation"
        );

        menuPreparation.textContent =
            menu.preparation_time;

        const menuAvailability = document.querySelector(
            "#menu-detail-availability"
        );

        menuAvailability.textContent =
            Number(menu.is_available) === 1
                ? "Aujourd'hui"
                : "Indisponible";    

        const menuRating = document.querySelector(
            "#menu-detail-rating"
        );

        if (
            Number(menu.review_count) > 0 &&
            menu.average_rating !== null
        ) {
            const averageRating = Number(
                menu.average_rating
            );

            const roundedRating = Math.round(
                averageRating
            );

            menuRating.innerHTML = `
                <span
                    class="menu-detail-stars"
                    aria-label="${averageRating} étoiles sur 5"
                >
                    ${"★".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}
                </span>

                <span class="menu-detail-reviews">
                    (${menu.review_count} avis)
                </span>
            `;
        } else {
            menuRating.hidden = true;
        }

        const menuDiet = document.querySelector(
            "#menu-detail-diet"
        );

        const menuTheme = document.querySelector(
            "#menu-detail-theme"
        );

        menuDiet.textContent = menu.diet;
        menuTheme.textContent = menu.theme;

        const menuBreadcrumb = document.querySelector(
            "#menu-detail-breadcrumb"
        );

        menuBreadcrumb.textContent = menu.name;

        const menuPresentationTitle = document.querySelector(
            "#menu-presentation-title"
        );

        menuPresentationTitle.textContent =
            menu.presentation_title;

        const menuPresentationText1 = document.querySelector(
            "#menu-presentation-text-1"
        );

        menuPresentationText1.textContent =
            menu.presentation_text_1;

        const menuPresentationText2 = document.querySelector(
            "#menu-presentation-text-2"
        );

        menuPresentationText2.textContent =
            menu.presentation_text_2;

        const menuPresentationHighlightTitle = document.querySelector(
            "#menu-presentation-highlight-title"
        );

        menuPresentationHighlightTitle.textContent =
            menu.highlight_title;

        const menuPresentationHighlightText = document.querySelector(
            "#menu-presentation-highlight-text"
        );

        menuPresentationHighlightText.textContent =
            menu.highlight_text;

        const menuImage = document.querySelector(
            "#menu-detail-image"
        );

        if (menu.image_path) {
            menuImage.src = menu.image_path.startsWith("frontend/")
                ? menu.image_path.replace("frontend/", "")
                : `../${menu.image_path}`;
        }

        menuImage.alt = menu.name;

        const menuOrderCard = document.querySelector(
            "#menu-detail-order-card"
        );

        menuOrderCard.dataset.menuId = menu.id;
        menuOrderCard.dataset.menuName = menu.name;
        menuOrderCard.dataset.basePrice = menu.base_price;
        menuOrderCard.dataset.minPeople = menu.min_people;

        const preparationMatch = String(
            menu.preparation_time
        ).match(/\d+/g);

        if (preparationMatch) {
            menuOrderCard.dataset.preparationHours =
                Math.max(...preparationMatch.map(Number));
        }

        const menuOrderPrice = document.querySelector(
            ".order-price"
        );

        menuOrderPrice.dataset.minPeople = menu.min_people;
        menuOrderPrice.dataset.minPrice = menu.base_price;

        console.log(
            "Plats du menu :",
            menu.dishes
        );

        const menuComposition = document.querySelector(
            "#menu-detail-composition"
        );

        menuComposition.innerHTML = "";

        menu.dishes.forEach(function (dish) {
            const article = document.createElement(
                "article"
            );

            article.className = "menu-composition-item";

            const title = document.createElement(
                "h3"
            );

            const categories = {
                starter: "Entrée",
                main: "Plat",
                dessert: "Dessert"
            };

            title.textContent =
                categories[dish.category] || dish.category;

            const description = document.createElement(
                "p"
            );

            description.textContent = dish.name;

            article.appendChild(title);
            article.appendChild(description);

            menuComposition.appendChild(article);
        });

        const menuAllergens = document.querySelector(
            "#menu-detail-allergens"
        );

        const allergens = new Set();

        menu.dishes.forEach(function (dish) {
            if (dish.allergens) {
                dish.allergens
                    .split(",")
                    .map(function (allergen) {
                        return allergen.trim();
                    })
                    .filter(Boolean)
                    .forEach(function (allergen) {
                        allergens.add(allergen);
                    });
            }
        });

        menuAllergens.innerHTML = "";

        allergens.forEach(function (allergen) {
            const span = document.createElement(
                "span"
            );

            span.textContent = allergen;

            menuAllergens.appendChild(span);
        });

        const detailMenuScript = document.createElement(
            "script"
        );

        detailMenuScript.src = "js/detail-menu.js";

        document.body.appendChild(
            detailMenuScript
        );

    } catch (error) {
        console.error(
            "Erreur lors du chargement du menu :",
            error
        );
    }
}

chargerMenu();