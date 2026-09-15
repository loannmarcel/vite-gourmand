function creerCarteMenu(menu) {

    const carte = document.createElement("article");

    carte.className = "menu-card menu-card-detailed";

    carte.dataset.price = menu.base_price;
    carte.dataset.people = menu.min_people;
    carte.dataset.theme = menu.theme || "";
    carte.dataset.diet = menu.diet || "";

    const prix = Number(menu.base_price).toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

    const allergenes = [];

    menu.dishes.forEach((plat) => {

        if (!plat.allergens) {
            return;
        }

        plat.allergens
            .split(",")
            .map((allergene) => allergene.trim())
            .forEach((allergene) => {

                if (
                    allergene &&
                    !allergenes.includes(allergene)
                ) {
                    allergenes.push(allergene);
                }

            });

    });

    let affichageAvis = "";

    if (
        menu.review_count > 0 &&
        menu.average_rating !== null
    ) {
        const noteArrondie =
            Math.round(Number(menu.average_rating));

        const etoilesPleines =
            "★".repeat(noteArrondie);

        const etoilesVides =
            "☆".repeat(5 - noteArrondie);

        affichageAvis = `
            <div class="menu-card-rating">
                <span class="stars">
                    ${etoilesPleines}${etoilesVides}
                </span>
                <span class="review-count">
                    (${menu.review_count}
                    ${menu.review_count === 1 ? "avis" : "avis"})
                </span>
            </div>
        `;
    }

    carte.innerHTML = `
        <div class="menu-card-image">

            <img
                src="${menu.image_path
                    ? "../" + menu.image_path.replaceAll("\\", "/")
                    : "assets/images/menu-healthy.jpg"}"
                alt="${menu.name}"
            >

            <span class="menu-card-badge">
                ${(menu.diet || menu.theme || "MENU").toUpperCase()}
            </span>

        </div>

        <div class="menu-card-body">

            <h2>${menu.name}</h2>

            ${affichageAvis}

            <p class="menu-card-description">
                ${menu.description || ""}
            </p>

            <div class="menu-card-divider"></div>

            <div class="menu-card-price-row">

                <div class="menu-card-price-content">

                    <p class="menu-card-price-label">
                        À partir de
                    </p>

                    <p class="menu-card-price">
                        ${prix} €
                    </p>

                </div>

                <div class="menu-card-diet">

                    <img
                        src="assets/icons/icone-feuille.png"
                        alt=""
                        class="menu-card-diet-icon"
                    >

                    <div class="menu-card-diet-text">

                        <span class="menu-card-diet-label">
                            Régime
                        </span>

                        <span class="menu-card-diet-value">
                            ${menu.diet || "Non précisé"}
                        </span>

                    </div>

                </div>

            </div>

            <p class="menu-card-people">

                <img
                    src="assets/icons/icone-personnes.png"
                    alt=""
                    class="menu-card-icon"
                >

                Minimum ${menu.min_people} personnes

            </p>

            <div class="menu-card-info">

                <span class="menu-card-info-item">

                    <img
                        src="assets/icons/icone-horloge.png"
                        alt=""
                        class="menu-card-icon"
                    >

                    Préparation : ${menu.preparation_time || "Non précisée"}

                </span>

                <span class="menu-card-info-item">

                    <img
                        src="assets/icons/icone-valide.png"
                        alt=""
                        class="menu-card-icon"
                    >

                    ${menu.is_available
                        ? "Disponible"
                        : "Indisponible"}

                </span>

            </div>

            ${allergenes.length > 0 ? `
                <div class="menu-card-allergens">

                    <p>Allergènes</p>

                    <div class="allergen-list">

                        ${allergenes
                            .map((allergene) => `
                                <span>${allergene}</span>
                            `)
                            .join("")}

                    </div>

                </div>
            ` : ""}

            <a
                href="detail-menu.html?id=${menu.id}"
                class="menu-card-button"
            >
                Voir le détail
                <span>→</span>
            </a>

        </div>
    `;

    return carte;
}

document.addEventListener("DOMContentLoaded", async () => {

    const grilleMenus =
        document.getElementById("public-menus-grid");

    if (!grilleMenus) {
        return;
    }

    try {
        const reponse = await fetch(
            "../backend/routes/public-menus.php"
        );

        const donnees = await reponse.json();

        if (!reponse.ok || !donnees.success) {
            throw new Error(
                donnees.message ||
                "Impossible de charger les menus."
            );
        }

        console.log(
            "Menus publics récupérés :",
            donnees.menus
        );

        donnees.menus.forEach((menu) => {

            const carte = creerCarteMenu(menu);

            grilleMenus.appendChild(carte);

        });

    } catch (erreur) {
        console.error(
            "Erreur lors du chargement des menus :",
            erreur
        );
    }

});