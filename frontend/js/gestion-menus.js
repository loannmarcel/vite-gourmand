async function loadEmployeeMenus() {
    try {
        const response = await fetch("../backend/routes/employee-menus.php");
        const data = await response.json();

        if (!data.success) {
            console.error("Impossible de récupérer les menus.");
            return;
        }

        const menuSlugById = {
            1: "healthy",
            2: "tradition",
            3: "evenement",
            4: "vegetarien",
            5: "mediterraneen",
            6: "brunch"
        };

        data.menus.forEach((menu) => {
            const menuSlug =
                menuSlugById[menu.id] ?? `menu-${menu.id}`;

            let card = document.querySelector(
                `.employee-menu-card[data-menu-id="${menuSlug}"]`
            );

            if (!card) {

                const templateCard =
                    document.querySelector(".employee-menu-card");

                if (!templateCard) {
                    return;
                }

                const templateSlug =
                    templateCard.dataset.menuId;

                card =
                    templateCard.cloneNode(true);

                card.dataset.menuId =
                    menuSlug;

                card.dataset.dbId =
                    menu.id;

                card.dataset.name =
                    menu.name.toLowerCase();

                card.dataset.theme =
                    menu.theme;

                card.querySelectorAll("[id]").forEach((element) => {

                    if (
                        element.id.startsWith(
                            `${templateSlug}-`
                        )
                    ) {
                        element.id =
                            element.id.replace(
                                `${templateSlug}-`,
                                `${menuSlug}-`
                            );
                    }

                });

                card.querySelectorAll("[for]").forEach((element) => {

                    const value =
                        element.getAttribute("for");

                    if (
                        value &&
                        value.startsWith(
                            `${templateSlug}-`
                        )
                    ) {
                        element.setAttribute(
                            "for",
                            value.replace(
                                `${templateSlug}-`,
                                `${menuSlug}-`
                            )
                        );
                    }

                });

                employeeMenusList.appendChild(card);
            }

            card.dataset.dbId = menu.id;

            const cardImage =
                card.querySelector(
                    ".employee-menu-thumbnail img"
                );

            const currentImage =
                card.querySelector(
                    ".employee-menu-current-image img"
                );

            if (menu.image_path) {

                const imageUrl =
                    `../${menu.image_path}`;

                if (cardImage) {
                    cardImage.src = imageUrl;
                    cardImage.alt = menu.name;
                }

                if (currentImage) {
                    currentImage.src = imageUrl;
                    currentImage.alt =
                        `Image actuelle de ${menu.name}`;
                }

            } else if (menuSlug.startsWith("menu-")) {

                if (cardImage) {
                    cardImage.removeAttribute("src");
                    cardImage.alt = "";
                }

                if (currentImage) {
                    currentImage.removeAttribute("src");
                    currentImage.alt = "";
                }
            }

            const stockInput =
                card.querySelector(`#${menuSlug}-stock`);

            if (stockInput) {
                stockInput.value = menu.stock_quantity;
            }

            const informationValues =
                card.querySelectorAll(
                    ".employee-menu-information strong"
                );

            if (informationValues[4]) {
                informationValues[4].textContent =
                    `${menu.stock_quantity} commandes`;
            }

            const nameInput =
                card.querySelector(`#${menuSlug}-name`);

            if (nameInput) {
                nameInput.value = menu.name;
            }

            const menuTitle =
                card.querySelector("h2");

            if (menuTitle) {
                menuTitle.textContent = menu.name;
            }

            const descriptionInput =
                card.querySelector(`#${menuSlug}-description`);

            if (descriptionInput) {
                descriptionInput.value = menu.description;
            }

            if (
                descriptionInput &&
                !card.querySelector(`#${menuSlug}-presentation-title`)
            ) {
                const descriptionField =
                    descriptionInput.closest(
                        ".employee-menu-edit-field"
                    );

                descriptionField.insertAdjacentHTML(
                    "afterend",
                    `
                        <div class="employee-menu-edit-field employee-menu-edit-field-full">

                            <label for="${menuSlug}-presentation-title">
                                Titre de présentation
                            </label>

                            <input
                                type="text"
                                id="${menuSlug}-presentation-title"
                            >

                        </div>

                        <div class="employee-menu-edit-field employee-menu-edit-field-full">

                            <label for="${menuSlug}-presentation-text-1">
                                Premier texte de présentation
                            </label>

                            <textarea
                                id="${menuSlug}-presentation-text-1"
                                rows="4"
                            ></textarea>

                        </div>

                        <div class="employee-menu-edit-field employee-menu-edit-field-full">

                            <label for="${menuSlug}-presentation-text-2">
                                Deuxième texte de présentation
                            </label>

                            <textarea
                                id="${menuSlug}-presentation-text-2"
                                rows="4"
                            ></textarea>

                        </div>

                        <div class="employee-menu-edit-field employee-menu-edit-field-full">

                            <label for="${menuSlug}-highlight-title">
                                Titre de mise en avant
                            </label>

                            <input
                                type="text"
                                id="${menuSlug}-highlight-title"
                            >

                        </div>

                        <div class="employee-menu-edit-field employee-menu-edit-field-full">

                            <label for="${menuSlug}-highlight-text">
                                Texte de mise en avant
                            </label>

                            <textarea
                                id="${menuSlug}-highlight-text"
                                rows="4"
                            ></textarea>

                        </div>
                    `
                );
            }

            const presentationTitleInput =
                card.querySelector(`#${menuSlug}-presentation-title`);

            if (presentationTitleInput) {
                presentationTitleInput.value =
                    menu.presentation_title ?? "";
            }

            const presentationText1Input =
                card.querySelector(`#${menuSlug}-presentation-text-1`);

            if (presentationText1Input) {
                presentationText1Input.value =
                    menu.presentation_text_1 ?? "";
            }

            const presentationText2Input =
                card.querySelector(`#${menuSlug}-presentation-text-2`);

            if (presentationText2Input) {
                presentationText2Input.value =
                    menu.presentation_text_2 ?? "";
            }

            const highlightTitleInput =
                card.querySelector(`#${menuSlug}-highlight-title`);

            if (highlightTitleInput) {
                highlightTitleInput.value =
                    menu.highlight_title ?? "";
            }

            const highlightTextInput =
                card.querySelector(`#${menuSlug}-highlight-text`);

            if (highlightTextInput) {
                highlightTextInput.value =
                    menu.highlight_text ?? "";
            }

            const menuDescription =
                card.querySelector(
                    ".employee-menu-card-header p"
                );

            if (menuDescription) {
                menuDescription.textContent =
                    menu.description;
            }

            const themeInput =
                card.querySelector(`#${menuSlug}-theme`);

            if (themeInput) {

                const themeOptionExists =
                    Array.from(themeInput.options).some(
                        (option) => option.value === menu.theme
                    );

                if (!themeOptionExists) {
                    const newThemeOption =
                        document.createElement("option");

                    newThemeOption.value = menu.theme;
                    newThemeOption.textContent =
                        menu.theme.charAt(0).toUpperCase() +
                        menu.theme.slice(1);

                    themeInput.appendChild(newThemeOption);
                }

                themeInput.value = menu.theme;
            }

            if (informationValues[0]) {
                informationValues[0].textContent =
                    themeInput?.options[
                        themeInput.selectedIndex
                    ]?.text ?? menu.theme;
            }

            const regimeInput =
                card.querySelector(`#${menuSlug}-regime`);

            if (regimeInput) {
                regimeInput.value = menu.diet;
            }

            if (informationValues[1]) {
                informationValues[1].textContent =
                    menu.diet;
            }

            const minimumInput =
                card.querySelector(`#${menuSlug}-minimum`);

            if (minimumInput) {
                minimumInput.value = menu.min_people;
            }

            if (informationValues[2]) {
                informationValues[2].textContent =
                    `${menu.min_people} personnes`;
            }

            const priceInput =
                card.querySelector(`#${menuSlug}-price`);

            if (priceInput) {
                priceInput.value = menu.base_price;
            }

            if (informationValues[3]) {
                informationValues[3].textContent =
                    `${Number(menu.base_price)
                        .toFixed(2)
                        .replace(".", ",")} €`;
            }

            const conditionsInput =
                card.querySelector(`#${menuSlug}-conditions`);

            if (conditionsInput) {
                conditionsInput.value =
                    menu.conditions ?? "";
            }

            const dishesList =
                card.querySelector(`#${menuSlug}-dishes-list`);

            if (dishesList) {
                const dishItems =
                    dishesList.querySelectorAll(
                        ".employee-menu-dish-item"
                    );

                menu.dishes.forEach((dish, index) => {

                    let dishItem = dishItems[index];

                    if (!dishItem) {
                        dishItem = document.createElement("div");

                        dishItem.className =
                            "employee-menu-dish-item";

                        dishItem.dataset.dishId =
                            `${menuSlug}-dish-${dish.id}`;

                        dishesList.appendChild(dishItem);

                        dishItem.innerHTML = `
                            <div class="employee-menu-dish-content">
                                <span class="employee-menu-dish-type"></span>
                                <strong></strong>
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
                                        <option value="entree">Entrée</option>
                                        <option value="plat">Plat</option>
                                        <option value="dessert">Dessert</option>
                                    </select>
                                </div>

                                <div class="employee-menu-dish-edit-field">
                                    <label>Nom du plat</label>

                                    <input type="text">
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

                    }

                    dishItem.dataset.dbId = dish.id;
                    
                    const dishTypeLabels = {
                        starter: "Entrée",
                        main: "Plat",
                        dessert: "Dessert"
                    };

                    const dishType =
                        dishItem.querySelector(
                            ".employee-menu-dish-type"
                        );

                    const dishName =
                        dishItem.querySelector(
                            ".employee-menu-dish-content strong"
                        );

                    if (dishType) {
                        dishType.textContent =
                            dishTypeLabels[dish.category] ??
                            dish.category;
                    }

                    if (dishName) {
                        dishName.textContent = dish.name;
                    }

                    const categoryValues = {
                        starter: "entree",
                        main: "plat",
                        dessert: "dessert"
                    };

                    const dishEditPanel =
                        dishItem.querySelector(
                            ".employee-menu-dish-edit-panel"
                        );

                    if (dishEditPanel) {
                        const dishTypeInput =
                            dishEditPanel.querySelector("select");

                        const dishNameInput =
                            dishEditPanel.querySelector(
                                'input[type="text"]'
                            );

                        if (dishTypeInput) {
                            dishTypeInput.value =
                                categoryValues[dish.category] ??
                                "";
                        }

                        if (dishNameInput) {
                            dishNameInput.value = dish.name;
                        }
                    }

                });

                dishItems.forEach((dishItem, index) => {
                    if (index >= menu.dishes.length) {
                        dishItem.remove();
                    }
                });
            }

        });

        console.log("6 menus reliés à MySQL :", data.menus);
    } catch (error) {
        console.error(
            "Erreur lors du chargement des menus :",
            error
        );
    }
}

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

employeeMenusList.addEventListener("click", async (event) => {

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

        const dbId =
            card.dataset.dbId;    

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

        const presentationTitleInput =
            card.querySelector(`#${menuId}-presentation-title`);

        const presentationText1Input =
            card.querySelector(`#${menuId}-presentation-text-1`);

        const presentationText2Input =
            card.querySelector(`#${menuId}-presentation-text-2`);

        const highlightTitleInput =
            card.querySelector(`#${menuId}-highlight-title`);

        const highlightTextInput =
            card.querySelector(`#${menuId}-highlight-text`);

        const imagesInput =
            card.querySelector(`#${menuId}-images`);

        const currentImage =
            card.querySelector(".employee-menu-current-image img");   
        
        const cardImage =
            card.querySelector(".employee-menu-thumbnail img");

            /* ENREGISTREMENT DANS MYSQL */

            if (!dbId) {
                console.error("ID MySQL du menu introuvable.");
                return;
            }

            try {
                const response = await fetch(
                    "../backend/routes/update-menu-employee.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            menu_id: Number(dbId),
                            name: nameInput.value.trim(),
                            presentation_title:
                                presentationTitleInput?.value.trim() ?? "",

                            presentation_text_1:
                                presentationText1Input?.value.trim() ?? "",

                            presentation_text_2:
                                presentationText2Input?.value.trim() ?? "",

                            highlight_title:
                                highlightTitleInput?.value.trim() ?? "",

                            highlight_text:
                                highlightTextInput?.value.trim() ?? "",
                            description: descriptionInput.value.trim(),
                            theme: themeInput.value,
                            diet: regimeInput.value.trim(),
                            min_people: Number(minimumInput.value),
                            base_price: Number(priceInput.value),
                            stock_quantity: Number(stockInput.value),
                            conditions:
                                card.querySelector(
                                    `#${menuId}-conditions`
                                )?.value.trim() ?? ""
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    alert(
                        data.message ||
                        "Impossible de modifier le menu."
                    );

                    return;
                }

                console.log(
                    "Menu enregistré dans MySQL :",
                    data
                );

                if (
                    imagesInput &&
                    imagesInput.files.length > 0
                ) {
                    const imageFormData =
                        new FormData();

                    imageFormData.append(
                        "menu_id",
                        dbId
                    );

                    imageFormData.append(
                        "image",
                        imagesInput.files[0]
                    );

                    const imageResponse = await fetch(
                        "../backend/routes/upload-menu-image.php",
                        {
                            method: "POST",
                            body: imageFormData
                        }
                    );

                    const imageData =
                        await imageResponse.json();

                    if (!imageResponse.ok || !imageData.success) {
                        alert(
                            imageData.message ||
                            "Le menu a été modifié, mais l'image n'a pas pu être enregistrée."
                        );

                        return;
                    }

                    console.log(
                        "Image du menu enregistrée :",
                        imageData
                    );
                }

            } catch (error) {
                console.error(
                    "Erreur lors de la modification du menu :",
                    error
                );

                alert(
                    "Une erreur est survenue lors de l'enregistrement."
                );

                return;
            }
         
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

employeeMenusList.addEventListener("click", async (event) => {

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

        const menuDbId =
            card.dataset.dbId;

        if (!menuDbId) {
            alert(
                "Impossible de supprimer ce menu : identifiant manquant."
            );

            return;
        }

        try {

            const response = await fetch(
                "../backend/routes/delete-menu-employee.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        menu_id: Number(menuDbId)
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                    "Impossible de supprimer le menu."
                );

                return;
            }

        } catch (error) {

            console.error(
                "Erreur lors de la suppression du menu :",
                error
            );

            alert(
                "Une erreur est survenue lors de la suppression."
            );

            return;
        }

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


addMenuSaveButton.addEventListener("click", async () => {

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

    const presentationTitleInput =
        document.querySelector("#new-menu-presentation-title");

    const presentationText1Input =
        document.querySelector("#new-menu-presentation-text-1");

    const presentationText2Input =
        document.querySelector("#new-menu-presentation-text-2");

    const highlightTitleInput =
        document.querySelector("#new-menu-highlight-title");

    const highlightTextInput =
        document.querySelector("#new-menu-highlight-text");

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

    const menuPresentationTitle =
        presentationTitleInput.value.trim();

    const menuPresentationText1 =
        presentationText1Input.value.trim();

    const menuPresentationText2 =
        presentationText2Input.value.trim();

    const menuHighlightTitle =
        highlightTitleInput.value.trim();

    const menuHighlightText =
        highlightTextInput.value.trim();

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

    let data;

    try {
        const response = await fetch(
            "../backend/routes/add-menu-employee.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: menuName,
                    description: menuDescription,
                    presentation_title: menuPresentationTitle,
                    presentation_text_1: menuPresentationText1,
                    presentation_text_2: menuPresentationText2,
                    highlight_title: menuHighlightTitle,
                    highlight_text: menuHighlightText,
                    theme: menuTheme,
                    diet: menuRegime,
                    min_people: Number(menuMinimum),
                    base_price: Number(menuPrice),
                    stock_quantity: Number(menuStock),
                    conditions: menuConditions,
                    allergens: menuAllergens
                })
            }
        );

        data = await response.json();

        if (!response.ok || !data.success) {
            alert(
                data.message ||
                "Impossible d'ajouter le menu."
            );
            return;
        }

        console.log(
            "Menu ajouté dans MySQL :",
            data
        );

        const categoryByType = {
            "Entrée": "starter",
            "Plat": "main",
            "Dessert": "dessert"
        };

        for (const dish of menuDishes) {

            const dishResponse = await fetch(
                "../backend/routes/add-dish-employee.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    
                    body: JSON.stringify({
                        menu_id: data.menu_id,
                        name: dish.name,
                        category: categoryByType[dish.type],
                        allergens: menuAllergens
                    })
                }
            );

            const dishData =
                await dishResponse.json();

            if (!dishResponse.ok || !dishData.success) {
                alert(
                    dishData.message ||
                    "Le menu a été créé, mais un plat n'a pas pu être enregistré."
                );

                return;
            }
        }

        if (
            imagesInput &&
            imagesInput.files.length > 0
        ) {
            const imageFormData =
                new FormData();

            imageFormData.append(
                "menu_id",
                data.menu_id
            );

            imageFormData.append(
                "image",
                imagesInput.files[0]
            );

            const imageResponse = await fetch(
                "../backend/routes/upload-menu-image.php",
                {
                    method: "POST",
                    body: imageFormData
                }
            );

            const imageData =
                await imageResponse.json();

            if (
                !imageResponse.ok ||
                !imageData.success
            ) {
                alert(
                    imageData.message ||
                    "Le menu a été créé, mais l'image n'a pas pu être enregistrée."
                );

                return;
            }
        }

    } catch (error) {
        console.error(
            "Erreur lors de l'ajout du menu :",
            error
        );

        alert(
            "Une erreur est survenue lors de l'ajout."
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

    const safePresentationTitle =
        escapeHTML(menuPresentationTitle);

    const safePresentationText1 =
        escapeHTML(menuPresentationText1);

    const safePresentationText2 =
        escapeHTML(menuPresentationText2);

    const safeHighlightTitle =
        escapeHTML(menuHighlightTitle);

    const safeHighlightText =
        escapeHTML(menuHighlightText);

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

    newCard.dataset.menuId =
        menuId;


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

              <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-presentation-title">
                    Titre de présentation
                </label>

                <input
                    type="text"
                    id="${menuId}-presentation-title"
                    value="${safePresentationTitle}"
                >

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-presentation-text-1">
                    Premier texte de présentation
                </label>

                <textarea
                    id="${menuId}-presentation-text-1"
                    rows="4"
                >${safePresentationText1}</textarea>

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-presentation-text-2">
                    Deuxième texte de présentation
                </label>

                <textarea
                    id="${menuId}-presentation-text-2"
                    rows="4"
                >${safePresentationText2}</textarea>

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-highlight-title">
                    Titre de mise en avant
                </label>

                <input
                    type="text"
                    id="${menuId}-highlight-title"
                    value="${safeHighlightTitle}"
                >

            </div>


            <div
                class="employee-menu-edit-field
                       employee-menu-edit-field-full"
            >

                <label for="${menuId}-highlight-text">
                    Texte de mise en avant
                </label>

                <textarea
                    id="${menuId}-highlight-text"
                    rows="4"
                >${safeHighlightText}</textarea>

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

employeeMenusList.addEventListener("click", async (event) => {

    const deleteDishButton =
        event.target.closest(".employee-menu-dish-delete");

    if (!deleteDishButton) {
        return;
    }

    const dishItem =
        deleteDishButton.closest(".employee-menu-dish-item");

    const dishDbId =
        dishItem.dataset.dbId;

    const dishName =
        dishItem.querySelector("strong").textContent.trim();

    const confirmation =
        window.confirm(
            `Voulez-vous vraiment supprimer le plat "${dishName}" ?`
        );

    if (!confirmation) {
        return;
    }

    if (!dishDbId) {
        console.error("ID MySQL du plat introuvable.");
        return;
    }

    try {
        const response = await fetch(
            "../backend/routes/delete-dish-employee.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    dish_id: Number(dishDbId)
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(
                data.message ||
                "Impossible de supprimer le plat."
            );
            return;
        }

        console.log(
            "Plat supprimé de MySQL :",
            data
        );
    } catch (error) {
        console.error(
            "Erreur lors de la suppression du plat :",
            error
        );

        alert(
            "Une erreur est survenue lors de la suppression."
        );

        return;
    }

    dishItem.remove();

});

/* =====================================================
   PLATS DES MENUS - MODIFICATION
===================================================== */

employeeMenusList.addEventListener("click", async (event) => {

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

        const dishDbId = dishItem.dataset.dbId;

        const categoryByValue = {
            entree: "starter",
            plat: "main",
            dessert: "dessert"
        };

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

        if (!dishDbId) {
            console.error("ID MySQL du plat introuvable.");
            return;
        }

        try {
            const response = await fetch(
                "../backend/routes/update-dish-employee.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        dish_id: Number(dishDbId),
                        name: nameInput.value.trim(),
                        category:
                            categoryByValue[typeInput.value]
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                    "Impossible de modifier le plat."
                );
                return;
            }

            console.log(
                "Plat enregistré dans MySQL :",
                data
            );
        } catch (error) {
            console.error(
                "Erreur lors de la modification du plat :",
                error
            );

            alert(
                "Une erreur est survenue lors de l'enregistrement."
            );

            return;
        }


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

employeeMenusList.addEventListener("click", async (event) => {

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

        const menuDbId =
            menuCard.dataset.dbId;

        const categoryByValue = {
            entree: "starter",
            plat: "main",
            dessert: "dessert"
        };

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

        if (!menuDbId) {
            console.error("ID MySQL du menu introuvable.");
            return;
        }

        let data;

        try {
            const response = await fetch(
                "../backend/routes/add-dish-employee.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        menu_id: Number(menuDbId),
                        name: dishName,
                        category:
                            categoryByValue[typeInput.value]
                    })
                }
            );

            data = await response.json();

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                    "Impossible d'ajouter le plat."
                );
                return;
            }

            console.log(
                "Plat ajouté dans MySQL :",
                data
            );
        } catch (error) {
            console.error(
                "Erreur lors de l'ajout du plat :",
                error
            );

            alert(
                "Une erreur est survenue lors de l'ajout."
            );

            return;
        }

        const dishId =
            `dish-${Date.now()}`;

        const dishItem =
            document.createElement("div");

        dishItem.className =
            "employee-menu-dish-item";

        dishItem.dataset.dishId =
            dishId;

        dishItem.dataset.dbId =
            data.dish_id;

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

loadEmployeeMenus();