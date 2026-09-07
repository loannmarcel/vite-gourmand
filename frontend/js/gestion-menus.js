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

        const imagesInput =
            card.querySelector(`#${menuId}-images`);

        const currentImage =
            card.querySelector(".employee-menu-current-image img");   
        
        const cardImage =
            card.querySelector(".employee-menu-thumbnail img");
         
            if (
                imagesInput &&
                imagesInput.files.length > 0
            ) {
                const selectedImage =
                    imagesInput.files[0];

                const imageURL =
                    URL.createObjectURL(selectedImage);

                if (currentImage) {
                    currentImage.src =
                        imageURL;
                }

                if (cardImage) {
                    cardImage.src =
                        imageURL;
                }
            }


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

    const deletedTheme =
        card.dataset.theme;

    card.remove();

    /* SUPPRESSION DU THÈME S'IL N'EST PLUS UTILISÉ */

    const defaultThemes = [
        "classique",
        "evenement",
        "brunch"
    ];

    const themeStillUsed =
        Array.from(
            employeeMenusList.querySelectorAll(".employee-menu-card")
        ).some(
            (menuCard) =>
                menuCard.dataset.theme === deletedTheme
        );

    if (
        !themeStillUsed &&
        !defaultThemes.includes(deletedTheme)
    ) {

        const themeFilter =
            document.querySelector("#employee-menu-theme");

        const themeOption =
            Array.from(themeFilter.options).find(
                (option) =>
                    option.value === deletedTheme
            );

        if (themeOption) {
            themeOption.remove();
        }

    }

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
   AJOUTER DES PLATS AU NOUVEAU MENU
===================================================== */

const newMenuDishAddButton =
    document.querySelector("#new-menu-dish-add");

const newMenuDishAddPanel =
    document.querySelector("#new-menu-dish-add-panel");

const newMenuDishAddCancel =
    document.querySelector("#new-menu-dish-add-cancel");

const newMenuDishAddSave =
    document.querySelector("#new-menu-dish-add-save");

const newMenuDishType =
    document.querySelector("#new-menu-dish-type");

const newMenuDishName =
    document.querySelector("#new-menu-dish-name");

const newMenuDishesList =
    document.querySelector("#new-menu-dishes-list");


newMenuDishAddButton.addEventListener("click", () => {

    const isOpen =
        newMenuDishAddButton.getAttribute("aria-expanded") === "true";

    newMenuDishAddButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

    newMenuDishAddPanel.hidden = isOpen;

    newMenuDishAddButton.textContent =
        isOpen ? "Ajouter un plat" : "Fermer";

});


newMenuDishAddCancel.addEventListener("click", () => {

    newMenuDishAddPanel.hidden = true;

    newMenuDishAddButton.setAttribute(
        "aria-expanded",
        "false"
    );

    newMenuDishAddButton.textContent =
        "Ajouter un plat";

    newMenuDishType.value = "entree";
    newMenuDishName.value = "";

});


newMenuDishAddSave.addEventListener("click", () => {

    const dishName =
        newMenuDishName.value.trim();

    if (!dishName) {
        newMenuDishName.focus();
        return;
    }

    const dishTypeValue =
        newMenuDishType.value;

    const dishTypeText =
        newMenuDishType.options[
            newMenuDishType.selectedIndex
        ].text;

    const dishItem =
        document.createElement("div");

    dishItem.className =
        "employee-menu-dish-item";

    dishItem.dataset.dishId =
        `new-dish-${Date.now()}`;

    dishItem.innerHTML = `
        <div class="employee-menu-dish-content">

            <span class="employee-menu-dish-type">
                ${dishTypeText}
            </span>

            <strong></strong>

        </div>

        <div class="employee-menu-dish-actions">

            <button
                type="button"
                class="employee-menu-dish-delete"
            >
                Supprimer
            </button>

        </div>
    `;

    dishItem.querySelector("strong").textContent =
        dishName;

    newMenuDishesList.appendChild(dishItem);

    newMenuDishType.value = "entree";
    newMenuDishName.value = "";

    newMenuDishAddPanel.hidden = true;

    newMenuDishAddButton.setAttribute(
        "aria-expanded",
        "false"
    );

    newMenuDishAddButton.textContent =
        "Ajouter un plat";

});

/* SUPPRESSION D'UN PLAT DU NOUVEAU MENU */

newMenuDishesList.addEventListener("click", (event) => {

    const deleteDishButton =
        event.target.closest(".employee-menu-dish-delete");

    if (!deleteDishButton) return;

    const dishItem =
        deleteDishButton.closest(".employee-menu-dish-item");

    const dishName =
        dishItem.querySelector("strong").textContent.trim();

    const confirmation =
        window.confirm(
            `Voulez-vous vraiment supprimer le plat "${dishName}" ?`
        );

    if (!confirmation) return;

    dishItem.remove();

});

/* =====================================================
   NOUVEAU THÈME
===================================================== */

const newMenuTheme =
    document.querySelector("#new-menu-theme");

const newMenuThemeCustomField =
    document.querySelector("#new-menu-theme-custom-field");

const newMenuThemeCustom =
    document.querySelector("#new-menu-theme-custom");


newMenuTheme.addEventListener("change", () => {

    const isNewTheme =
        newMenuTheme.value === "new";

    newMenuThemeCustomField.hidden =
        !isNewTheme;

    if (isNewTheme) {

        newMenuThemeCustom.focus();

    } else {

        newMenuThemeCustom.value = "";

    }

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

    const dishesList =
    document.querySelector("#new-menu-dishes-list");    

    const imagesInput =
        document.querySelector("#new-menu-images");


    /* RÉCUPÉRATION DES VALEURS */

    const menuName =
        nameInput.value.trim();

    let menuTheme =
        themeInput.value;

    let menuThemeLabel =
        themeInput.options[
            themeInput.selectedIndex
        ].text.trim();


    if (menuTheme === "new") {

        const customTheme =
            newMenuThemeCustom.value.trim();

        if (!customTheme) {

            newMenuThemeCustom.focus();
            return;

        }

        menuTheme =
            customTheme
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

        menuThemeLabel =
            customTheme;

    }

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
    Array.from(
        dishesList.querySelectorAll(".employee-menu-dish-item")
    ).map((dishItem) => {

        const type =
            dishItem.querySelector(
                ".employee-menu-dish-type"
            ).textContent.trim();

        const name =
            dishItem.querySelector(
                ".employee-menu-dish-content strong"
            ).textContent.trim();

        return {
            type,
            name
        };

    });

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

    const dishesHTML =
    menuDishes.map((dish, index) => {

        const safeDishType =
            escapeHTML(dish.type);

        const safeDishName =
            escapeHTML(dish.name);

        const dishTypeValue =
            dish.type === "Entrée"
                ? "entree"
                : dish.type === "Dessert"
                    ? "dessert"
                    : "plat";

        return `
            <div
                class="employee-menu-dish-item"
                data-dish-id="${menuId}-dish-${index + 1}"
            >

                <div class="employee-menu-dish-content">

                    <span class="employee-menu-dish-type">
                        ${safeDishType}
                    </span>

                    <strong>
                        ${safeDishName}
                    </strong>

                </div>

                <div class="employee-menu-dish-actions">

                    <button
                        type="button"
                        class="employee-menu-dish-edit"
                        aria-expanded="false"
                    >
                        Modifier
                    </button>

                    <button
                        type="button"
                        class="employee-menu-dish-delete"
                    >
                        Supprimer
                    </button>

                </div>

                <div
                    class="employee-menu-dish-edit-panel"
                    hidden
                >

                    <div class="employee-menu-dish-edit-field">

                        <label>Type</label>

                        <select>

                            <option
                                value="entree"
                                ${dishTypeValue === "entree" ? "selected" : ""}
                            >
                                Entrée
                            </option>

                            <option
                                value="plat"
                                ${dishTypeValue === "plat" ? "selected" : ""}
                            >
                                Plat
                            </option>

                            <option
                                value="dessert"
                                ${dishTypeValue === "dessert" ? "selected" : ""}
                            >
                                Dessert
                            </option>

                        </select>

                    </div>

                    <div class="employee-menu-dish-edit-field">

                        <label>
                            Nom du plat
                        </label>

                        <input
                            type="text"
                            value="${safeDishName}"
                        >

                    </div>

                    <div class="employee-menu-dish-edit-actions">

                        <button
                            type="button"
                            class="employee-menu-dish-edit-cancel"
                        >
                            Annuler
                        </button>

                        <button
                            type="button"
                            class="employee-menu-dish-edit-save"
                        >
                            Enregistrer
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");

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


                <div class="employee-menu-edit-field employee-menu-theme-field">

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


            <span class="employee-menu-dishes-title">
                Plats du menu
            </span>

            <div
                class="employee-menu-dishes-list"
                id="${menuId}-dishes-list"
            >
                ${dishesHTML}
            </div>


            <button
                type="button"
                class="employee-menu-dish-add"
                id="${menuId}-dish-add"
                aria-expanded="false"
            >
                Ajouter un plat
            </button>


            <div
                class="employee-menu-dish-add-panel"
                id="${menuId}-dish-add-panel"
                hidden
            >

                <div class="employee-menu-dish-edit-field">

                    <label>
                        Type
                    </label>

                    <select>
                        <option value="entree">
                            Entrée
                        </option>

                        <option value="plat">
                            Plat
                        </option>

                        <option value="dessert">
                            Dessert
                        </option>
                    </select>

                </div>


                <div class="employee-menu-dish-edit-field">

                    <label>
                        Nom du plat
                    </label>

                    <input
                        type="text"
                        placeholder="Ex. Salade de saison"
                    >

                </div>


                <div class="employee-menu-dish-edit-actions">

                    <button
                        type="button"
                        class="employee-menu-dish-add-cancel"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        class="employee-menu-dish-add-save"
                    >
                        Ajouter le plat
                    </button>

                </div>

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

    /* AJOUT DU NOUVEAU THÈME DANS LE FILTRE */

    const themeFilter =
    document.querySelector("#employee-menu-theme");

    const themeAlreadyExists =
        Array.from(themeFilter.options).some(
            (option) => option.value === menuTheme
        );

    if (!themeAlreadyExists) {

        const newThemeOption =
            document.createElement("option");

        newThemeOption.value =
            menuTheme;

        newThemeOption.textContent =
            menuThemeLabel;

        themeFilter.appendChild(newThemeOption);

    }


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
    dishesList.innerHTML = "";
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

/* =====================================================
   PLATS DES MENUS - SUPPRESSION
===================================================== */

employeeMenusList.addEventListener("click", (event) => {

    const deleteDishButton =
        event.target.closest(".employee-menu-dish-delete");

    if (!deleteDishButton) {
        return;
    }

    const dishItem =
        deleteDishButton.closest(".employee-menu-dish-item");

    const dishName =
        dishItem.querySelector("strong").textContent.trim();

    const confirmation =
        window.confirm(
            `Voulez-vous vraiment supprimer le plat "${dishName}" ?`
        );

    if (!confirmation) {
        return;
    }

    dishItem.remove();

});

/* =====================================================
   PLATS DES MENUS - MODIFICATION
===================================================== */

employeeMenusList.addEventListener("click", (event) => {

    const editDishButton =
        event.target.closest(".employee-menu-dish-edit");

    const cancelDishButton =
        event.target.closest(".employee-menu-dish-edit-cancel");

    const saveDishButton =
        event.target.closest(".employee-menu-dish-edit-save");


    /* OUVRIR / FERMER */

    if (editDishButton) {

        const dishItem =
            editDishButton.closest(".employee-menu-dish-item");

        const editPanel =
            dishItem.querySelector(".employee-menu-dish-edit-panel");

        if (!editPanel) {
            return;
        }

        const isOpen =
            editDishButton.getAttribute("aria-expanded") === "true";

        editDishButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        editPanel.hidden = isOpen;

        editDishButton.textContent =
            isOpen ? "Modifier" : "Fermer";

        return;
    }


    /* ANNULER */

    if (cancelDishButton) {

        const dishItem =
            cancelDishButton.closest(".employee-menu-dish-item");

        const editPanel =
            dishItem.querySelector(".employee-menu-dish-edit-panel");

        const editButton =
            dishItem.querySelector(".employee-menu-dish-edit");

        editPanel.hidden = true;

        editButton.setAttribute(
            "aria-expanded",
            "false"
        );

        editButton.textContent = "Modifier";

        return;
    }


    /* ENREGISTRER */

    if (saveDishButton) {

        const dishItem =
            saveDishButton.closest(".employee-menu-dish-item");

        const typeInput =
            dishItem.querySelector(
                ".employee-menu-dish-edit-field select"
            );

        const nameInput =
            dishItem.querySelector(
                ".employee-menu-dish-edit-field input"
            );

        const dishType =
            dishItem.querySelector(".employee-menu-dish-type");

        const dishName =
            dishItem.querySelector(
                ".employee-menu-dish-content strong"
            );

        const editPanel =
            dishItem.querySelector(".employee-menu-dish-edit-panel");

        const editButton =
            dishItem.querySelector(".employee-menu-dish-edit");


        dishType.textContent =
            typeInput.options[
                typeInput.selectedIndex
            ].text;

        dishName.textContent =
            nameInput.value.trim();


        editPanel.hidden = true;

        editButton.setAttribute(
            "aria-expanded",
            "false"
        );

        editButton.textContent =
            "Modifier";

    }

});

/* PLATS DES MENUS - AJOUT */

employeeMenusList.addEventListener("click", (event) => {

    const addDishButton =
        event.target.closest(".employee-menu-dish-add");

    const cancelAddDishButton =
        event.target.closest(".employee-menu-dish-add-cancel");

    const saveAddDishButton =
        event.target.closest(".employee-menu-dish-add-save");


    /* OUVRIR / FERMER LE FORMULAIRE */

    if (addDishButton) {

        const menuCard =
            addDishButton.closest(".employee-menu-card");

        const addPanel =
            menuCard.querySelector(".employee-menu-dish-add-panel");

        if (!addPanel) return;

        const isOpen =
            addDishButton.getAttribute("aria-expanded") === "true";

        addDishButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        addPanel.hidden = isOpen;

        addDishButton.textContent =
            isOpen ? "Ajouter un plat" : "Fermer";

        return;
    }


    /* ANNULER */

    if (cancelAddDishButton) {

        const menuCard =
            cancelAddDishButton.closest(".employee-menu-card");

        const addPanel =
            cancelAddDishButton.closest(".employee-menu-dish-add-panel");

        const addButton =
            menuCard.querySelector(".employee-menu-dish-add");

        const typeInput =
            addPanel.querySelector("select");

        const nameInput =
            addPanel.querySelector('input[type="text"]');

        addPanel.hidden = true;

        addButton.setAttribute(
            "aria-expanded",
            "false"
        );

        addButton.textContent = "Ajouter un plat";

        typeInput.value = "entree";
        nameInput.value = "";

        return;
    }


    /* AJOUTER LE PLAT */

    if (saveAddDishButton) {

        const menuCard =
            saveAddDishButton.closest(".employee-menu-card");

        const addPanel =
            saveAddDishButton.closest(".employee-menu-dish-add-panel");

        const dishesList =
            menuCard.querySelector(".employee-menu-dishes-list");

        const addButton =
            menuCard.querySelector(".employee-menu-dish-add");

        const typeInput =
            addPanel.querySelector("select");

        const nameInput =
            addPanel.querySelector('input[type="text"]');

        const dishName =
            nameInput.value.trim();

        if (!dishName) {
            nameInput.focus();
            return;
        }

        const dishTypeValue =
            typeInput.value;

        const dishTypeText =
            typeInput.options[
                typeInput.selectedIndex
            ].text;

        const dishId =
            `dish-${Date.now()}`;

        const dishItem =
            document.createElement("div");

        dishItem.className =
            "employee-menu-dish-item";

        dishItem.dataset.dishId =
            dishId;

        dishItem.innerHTML = `
            <div class="employee-menu-dish-content">

                <span class="employee-menu-dish-type">
                    ${dishTypeText}
                </span>

                <strong>
                    ${dishName}
                </strong>

            </div>


            <div class="employee-menu-dish-actions">

                <button
                    type="button"
                    class="employee-menu-dish-edit"
                    aria-expanded="false"
                >
                    Modifier
                </button>

                <button
                    type="button"
                    class="employee-menu-dish-delete"
                >
                    Supprimer
                </button>

            </div>


            <div
                class="employee-menu-dish-edit-panel"
                hidden
            >

                <div class="employee-menu-dish-edit-field">

                    <label>
                        Type
                    </label>

                    <select>

                        <option
                            value="entree"
                            ${dishTypeValue === "entree" ? "selected" : ""}
                        >
                            Entrée
                        </option>

                        <option
                            value="plat"
                            ${dishTypeValue === "plat" ? "selected" : ""}
                        >
                            Plat
                        </option>

                        <option
                            value="dessert"
                            ${dishTypeValue === "dessert" ? "selected" : ""}
                        >
                            Dessert
                        </option>

                    </select>

                </div>


                <div class="employee-menu-dish-edit-field">

                    <label>
                        Nom du plat
                    </label>

                    <input
                        type="text"
                        value="${dishName}"
                    >

                </div>


                <div class="employee-menu-dish-edit-actions">

                    <button
                        type="button"
                        class="employee-menu-dish-edit-cancel"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        class="employee-menu-dish-edit-save"
                    >
                        Enregistrer
                    </button>

                </div>

            </div>
        `;

        dishesList.appendChild(dishItem);

        typeInput.value = "entree";
        nameInput.value = "";

        addPanel.hidden = true;

        addButton.setAttribute(
            "aria-expanded",
            "false"
        );

        addButton.textContent =
            "Ajouter un plat";
    }
});