const menuSearchInput =
    document.querySelector("#employee-menu-search");

const menuThemeSelect =
    document.querySelector("#employee-menu-theme");

let employeeMenuCards =
    document.querySelectorAll(".employee-menu-card");


function filterEmployeeMenus() {

    employeeMenuCards =
    document.querySelectorAll(".employee-menu-card");

    const searchValue =
        menuSearchInput.value
            .trim()
            .toLowerCase();

    const themeValue =
        menuThemeSelect.value;

    let visibleMenusCount = 0;

    employeeMenuCards.forEach((card) => {

        const menuName =
            card.dataset.name.toLowerCase();

        const menuTheme =
            card.dataset.theme;

        const matchesSearch =
            menuName.includes(searchValue);

        const matchesTheme =
            themeValue === "all" ||
            menuTheme === themeValue;

        const isVisible =
            matchesSearch && matchesTheme;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleMenusCount++;
        }

    });

    const emptyMessage =
        document.querySelector("#employee-menus-empty");

    emptyMessage.hidden =
        visibleMenusCount !== 0;

}


menuSearchInput.addEventListener(
    "input",
    filterEmployeeMenus
);

menuThemeSelect.addEventListener(
    "change",
    filterEmployeeMenus
);

const employeeMenusList =
    document.querySelector(".employee-menus-list");

/* =====================================================
   MODIFIER UN MENU
===================================================== */

employeeMenusList.addEventListener("click", (event) => {

    const editButton =
        event.target.closest(".employee-menu-edit-button");

    const cancelButton =
        event.target.closest(".employee-menu-edit-cancel");

    const saveButton =
        event.target.closest(".employee-menu-edit-save");


    /* OUVRIR / FERMER LE FORMULAIRE */

    if (editButton) {

        const card =
            editButton.closest(".employee-menu-card");

        const editPanel =
            card.querySelector(".employee-menu-edit-panel");

        const isOpen =
            editButton.getAttribute("aria-expanded") === "true";

        editButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        editPanel.hidden = isOpen;

        editButton.textContent =
            isOpen ? "Modifier" : "Fermer";

        return;
    }


    /* ANNULER */

    if (cancelButton) {

        const card =
            cancelButton.closest(".employee-menu-card");

        const editPanel =
            card.querySelector(".employee-menu-edit-panel");

        const cardEditButton =
            card.querySelector(".employee-menu-edit-button");

        editPanel.hidden = true;

        cardEditButton.setAttribute(
            "aria-expanded",
            "false"
        );

        cardEditButton.textContent =
            "Modifier";

        return;
    }


    /* ENREGISTRER */

    if (saveButton) {

        const card =
            saveButton.closest(".employee-menu-card");

        const editPanel =
            card.querySelector(".employee-menu-edit-panel");

        const cardEditButton =
            card.querySelector(".employee-menu-edit-button");

        const menuId =
            card.dataset.menuId;


        const nameInput =
            card.querySelector(`#${menuId}-name`);

        const themeInput =
            card.querySelector(`#${menuId}-theme`);

        const regimeInput =
            card.querySelector(`#${menuId}-regime`);

        const minimumInput =
            card.querySelector(`#${menuId}-minimum`);

        const priceInput =
            card.querySelector(`#${menuId}-price`);

        const stockInput =
            card.querySelector(`#${menuId}-stock`);

        const descriptionInput =
            card.querySelector(`#${menuId}-description`);


        /* MISE À JOUR DE LA CARTE */

        card.querySelector("h2").textContent =
            nameInput.value.trim();

        card
            .querySelector(".employee-menu-card-header p")
            .textContent =
            descriptionInput.value.trim();


        const informationValues =
            card.querySelectorAll(
                ".employee-menu-information strong"
            );

        informationValues[0].textContent =
            themeInput.options[
                themeInput.selectedIndex
            ].text;

        informationValues[1].textContent =
            regimeInput.value.trim();

        informationValues[2].textContent =
            `${minimumInput.value} personnes`;

        informationValues[3].textContent =
            `${Number(priceInput.value)
                .toFixed(2)
                .replace(".", ",")} €`;

        informationValues[4].textContent =
            `${stockInput.value} commandes`;


        /* DONNÉES UTILISÉES PAR LES FILTRES */

        card.dataset.name =
            nameInput.value
                .trim()
                .toLowerCase();

        card.dataset.theme =
            themeInput.value;


        /* FERMETURE */

        editPanel.hidden = true;

        cardEditButton.setAttribute(
            "aria-expanded",
            "false"
        );

        cardEditButton.textContent =
            "Modifier";

        filterEmployeeMenus();
    }

});

/* =====================================================
   SUPPRIMER UN MENU
===================================================== */

employeeMenusList.addEventListener("click", (event) => {

    const deleteButton =
        event.target.closest(".employee-menu-delete-button");

    if (!deleteButton) {
        return;
    }

    const card =
        deleteButton.closest(".employee-menu-card");

    const menuName =
        card.querySelector("h2").textContent;

    const confirmation =
        window.confirm(
            `Voulez-vous vraiment supprimer "${menuName}" ?`
        );

    if (!confirmation) {
        return;
    }

    card.remove();

    filterEmployeeMenus();

});

/* =====================================================
   AJOUTER UN MENU - OUVERTURE DU FORMULAIRE
===================================================== */

const addMenuButton =
    document.querySelector("#employee-menu-add-button");

const addMenuPanel =
    document.querySelector("#employee-menu-add-panel");

const addMenuCancelButton =
    document.querySelector("#employee-menu-add-cancel");


addMenuButton.addEventListener("click", () => {

    const isOpen =
        addMenuButton.getAttribute("aria-expanded") === "true";

    addMenuButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

    addMenuPanel.hidden = isOpen;

    addMenuButton.textContent =
        isOpen ? "Ajouter un menu" : "Fermer";

});


addMenuCancelButton.addEventListener("click", () => {

    addMenuPanel.hidden = true;

    addMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    addMenuButton.textContent =
        "Ajouter un menu";

});

/* =====================================================
   AJOUTER UN NOUVEAU MENU
===================================================== */

const addMenuSaveButton =
    document.querySelector("#employee-menu-add-save");


addMenuSaveButton.addEventListener("click", () => {

    const nameInput =
        document.querySelector("#new-menu-name");

    const themeInput =
        document.querySelector("#new-menu-theme");

    const regimeInput =
        document.querySelector("#new-menu-regime");

    const minimumInput =
        document.querySelector("#new-menu-minimum");

    const priceInput =
        document.querySelector("#new-menu-price");

    const stockInput =
        document.querySelector("#new-menu-stock");

    const descriptionInput =
        document.querySelector("#new-menu-description");

    const conditionsInput =
        document.querySelector("#new-menu-conditions");

    const allergensInput =
        document.querySelector("#new-menu-allergens");

    const dishesInput =
        document.querySelector("#new-menu-dishes");

    const imagesInput =
        document.querySelector("#new-menu-images");


    /* RÉCUPÉRATION DES VALEURS */

    const menuName =
        nameInput.value.trim();

    const menuTheme =
        themeInput.value;

    const menuThemeLabel =
        themeInput.options[
            themeInput.selectedIndex
        ].text;

    const menuRegime =
        regimeInput.value.trim();

    const menuMinimum =
        minimumInput.value;

    const menuPrice =
        priceInput.value;

    const menuStock =
        stockInput.value;

    const menuDescription =
        descriptionInput.value.trim();

    const menuConditions =
        conditionsInput.value.trim();

    const menuAllergens =
        allergensInput.value.trim();

    const menuDishes =
        dishesInput.value.trim();

    const selectedImage =
        imagesInput.files[0];


    /* VALIDATION MINIMALE */

    if (
        !menuName ||
        !menuRegime ||
        !menuMinimum ||
        !menuPrice ||
        !menuDescription
    ) {
        window.alert(
            "Merci de remplir les informations principales du menu."
        );

        return;
    }


    /* IDENTIFIANT UNIQUE */

    const menuId =
        `menu-${Date.now()}`;


    /* NUMÉRO DU NOUVEAU MENU */

    const references =
        document.querySelectorAll(
            ".employee-menu-reference"
        );

    let highestReference = 0;

    references.forEach((reference) => {

        const number =
            Number(
                reference.textContent.replace(/\D/g, "")
            );

        if (number > highestReference) {
            highestReference = number;
        }

    });

    const menuNumber =
        String(highestReference + 1).padStart(2, "0");


    /* IMAGE */

    let imageUrl = "";

    if (selectedImage) {
        imageUrl =
            URL.createObjectURL(selectedImage);
    }


    /* SÉCURISATION DU TEXTE INJECTÉ DANS LE HTML */

    function escapeHTML(value) {

        return value
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    const safeName =
        escapeHTML(menuName);

    const safeRegime =
        escapeHTML(menuRegime);

    const safeDescription =
        escapeHTML(menuDescription);

    const safeConditions =
        escapeHTML(menuConditions);

    const safeAllergens =
        escapeHTML(menuAllergens);

    const safeDishes =
        escapeHTML(menuDishes);


    /* CRÉATION DE LA CARTE */

    const newCard =
        document.createElement("article");

    newCard.className =
        "employee-menu-card";

    newCard.dataset.menuId =
        menuId;

    newCard.dataset.name =
        menuName.toLowerCase();

    newCard.dataset.theme =
        menuTheme;


    newCard.innerHTML = `

        <div class="employee-menu-card-header">

            <div class="employee-menu-card-main">

                <div class="employee-menu-thumbnail">

                    ${
                        imageUrl
                            ? `
                                <img
                                    src="${imageUrl}"
                                    alt="${safeName}"
                                >
                            `
                            : ""
                    }

                </div>

                <div class="employee-menu-card-content">

                    <span class="employee-menu-reference">
                        Menu #${menuNumber}
                    </span>

                    <h2>
                        ${safeName}
                    </h2>

                    <p>
                        ${safeDescription}
                    </p>

                </div>

            </div>

            <span class="employee-menu-status">
                Disponible
            </span>

        </div>


        <div class="employee-menu-information">

            <div>
                <span>Thème</span>
                <strong>${menuThemeLabel}</strong>
            </div>

            <div>
                <span>Régime</span>
                <strong>${safeRegime}</strong>
            </div>

            <div>
                <span>Minimum</span>
                <strong>${menuMinimum} personnes</strong>
            </div>

            <div>
                <span>Prix</span>
                <strong>
                    ${Number(menuPrice)
                        .toFixed(2)
                        .replace(".", ",")} €
                </strong>
            </div>

            <div>
                <span>Stock disponible</span>
                <strong>${menuStock} commandes</strong>
            </div>

        </div>


        <div class="employee-menu-actions">

            <button
                type="button"
                class="employee-menu-secondary-button employee-menu-edit-button"
                aria-expanded="false"
            >
                Modifier
            </button>

            <button
                type="button"
                class="employee-menu-delete-button"
            >
                Supprimer
            </button>

        </div>


        <div
            class="employee-menu-edit-panel"
            hidden
        >

            <div class="employee-menu-edit-grid">

                <div class="employee-menu-edit-field">

                    <label for="${menuId}-name">
                        Nom du menu
                    </label>

                    <input
                        type="text"
                        id="${menuId}-name"
                        value="${safeName}"
                    >

                </div>


                <div class="employee-menu-edit-field">

                    <label for="${menuId}-theme">
                        Thème
                    </label>

                    <select id="${menuId}-theme">

                        <option
                            value="classique"
                            ${menuTheme === "classique" ? "selected" : ""}
                        >
                            Classique
                        </option>

                        <option
                            value="evenement"
                            ${menuTheme === "evenement" ? "selected" : ""}
                        >
                            Évènement
                        </option>

                        <option
                            value="brunch"
                            ${menuTheme === "brunch" ? "selected" : ""}
                        >
                            Brunch
                        </option>

                    </select>

                </div>


                <div class="employee-menu-edit-field">

                    <label for="${menuId}-regime">
                        Régime
                    </label>

                    <input
                        type="text"
                        id="${menuId}-regime"
                        value="${safeRegime}"
                    >

                </div>


                <div class="employee-menu-edit-field">

                    <label for="${menuId}-minimum">
                        Minimum de personnes
                    </label>

                    <input
                        type="number"
                        id="${menuId}-minimum"
                        min="1"
                        value="${menuMinimum}"
                    >

                </div>


                <div class="employee-menu-edit-field">

                    <label for="${menuId}-price">
                        Prix
                    </label>

                    <input
                        type="number"
                        id="${menuId}-price"
                        min="0"
                        step="0.01"
                        value="${menuPrice}"
                    >

                </div>


                <div class="employee-menu-edit-field">

                    <label for="${menuId}-stock">
                        Stock disponible
                    </label>

                    <input
                        type="number"
                        id="${menuId}-stock"
                        min="0"
                        value="${menuStock}"
                    >

                </div>

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-description">
                    Description
                </label>

                <textarea
                    id="${menuId}-description"
                    rows="4"
                >${safeDescription}</textarea>

            </div>


            <div class="employee-menu-edit-grid">

                <div class="employee-menu-edit-field">

                    <label for="${menuId}-conditions">
                        Conditions
                    </label>

                    <textarea
                        id="${menuId}-conditions"
                        rows="4"
                    >${safeConditions}</textarea>

                </div>


                <div class="employee-menu-edit-field">

                    <label for="${menuId}-allergens">
                        Allergènes
                    </label>

                    <textarea
                        id="${menuId}-allergens"
                        rows="4"
                        placeholder="Ex. gluten, lait, œufs..."
                    >${safeAllergens}</textarea>

                </div>

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-dishes">
                    Plats du menu
                </label>

                <textarea
                    id="${menuId}-dishes"
                    rows="5"
                    placeholder="Indiquez les plats composant ce menu"
                >${safeDishes}</textarea>

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-images">
                    Galerie d'images
                </label>

                ${
                    imageUrl
                        ? `
                            <div class="employee-menu-current-images">

                                <div class="employee-menu-current-image">

                                    <img
                                        src="${imageUrl}"
                                        alt="Image actuelle de ${safeName}"
                                    >

                                </div>

                            </div>
                        `
                        : ""
                }

                <input
                    type="file"
                    id="${menuId}-images"
                    accept="image/*"
                    multiple
                >

                <small class="employee-menu-edit-help">
                    Vous pouvez sélectionner plusieurs images.
                </small>

            </div>


            <div class="employee-menu-edit-actions">

                <button
                    type="button"
                    class="employee-menu-edit-cancel"
                >
                    Annuler
                </button>

                <button
                    type="button"
                    class="employee-menu-edit-save"
                >
                    Enregistrer
                </button>

            </div>

        </div>

    `;


    /* AJOUT DANS LA LISTE */

    employeeMenusList.appendChild(newCard);


    /* RÉINITIALISATION DU FORMULAIRE */

    nameInput.value = "";
    themeInput.value = "classique";
    regimeInput.value = "";
    minimumInput.value = "2";
    priceInput.value = "";
    stockInput.value = "0";
    descriptionInput.value = "";
    conditionsInput.value = "";
    allergensInput.value = "";
    dishesInput.value = "";
    imagesInput.value = "";


    /* FERMETURE DU PANNEAU */

    addMenuPanel.hidden = true;

    addMenuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    addMenuButton.textContent =
        "Ajouter un menu";


    /* ACTUALISATION DES FILTRES */

    filterEmployeeMenus();

});