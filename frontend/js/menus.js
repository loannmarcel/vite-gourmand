const priceToggle = document.querySelector("#price-toggle");
const pricePanel = document.querySelector("#price-panel");

priceToggle.addEventListener("click", () => {
    const isOpen = !pricePanel.hidden;

    pricePanel.hidden = isOpen;

    priceToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );
});

const minRange = document.querySelector("#price-min-range");
const maxRange = document.querySelector("#price-max-range");

const minInput = document.querySelector("#price-min");
const maxInput = document.querySelector("#price-max");

const priceValue = document.querySelector(".filter-select-value");
const priceApply = document.querySelector(".price-apply");

const minimumGap = 5;


/* ==========================================
   SYNCHRONISATION DES CURSEURS
========================================== */

minRange.addEventListener("input", () => {

    if (
        Number(maxRange.value) - Number(minRange.value)
        < minimumGap
    ) {
        minRange.value =
            Number(maxRange.value) - minimumGap;
    }

    minInput.value = minRange.value;
});


maxRange.addEventListener("input", () => {

    if (
        Number(maxRange.value) - Number(minRange.value)
        < minimumGap
    ) {
        maxRange.value =
            Number(minRange.value) + minimumGap;
    }

    maxInput.value = maxRange.value;
});


/* ==========================================
   SYNCHRONISATION DES CHAMPS
========================================== */

minInput.addEventListener("input", () => {

    let value = Number(minInput.value);

    if (value < 0) {
        value = 0;
    }

    if (value > Number(maxRange.value) - minimumGap) {
        value = Number(maxRange.value) - minimumGap;
    }

    minInput.value = value;
    minRange.value = value;
});


maxInput.addEventListener("input", () => {

    let value = Number(maxInput.value);

    if (value > 150) {
        value = 150;
    }

    if (value < Number(minRange.value) + minimumGap) {
        value = Number(minRange.value) + minimumGap;
    }

    maxInput.value = value;
    maxRange.value = value;
});


/* ==========================================
   BOUTON APPLIQUER
========================================== */

priceApply.addEventListener("click", () => {

    priceValue.textContent =
        `${minRange.value} € - ${maxRange.value} €`;

    filterMenus();

    pricePanel.hidden = true;

    priceToggle.setAttribute(
        "aria-expanded",
        "false"
    );
});

const menuCards = document.querySelectorAll(".menu-card-detailed");

const peopleFilter = document.querySelector("#people-filter");

const themeFilter = document.querySelector("#theme-filter");

const dietFilter = document.querySelector("#diet-filter");

const resetButton = document.querySelector(".filter-reset");

const emptyResetButton = document.querySelector(".menus-empty-reset");

const emptyMessage = document.querySelector("#menus-empty");

function filterMenus() {
    let visibleMenus = 0;

    const minPrice = Number(minRange.value);
    const maxPrice = Number(maxRange.value);

    const selectedPeople = Number(peopleFilter.value);
    const selectedTheme = themeFilter.value;
    const selectedDiet = dietFilter.value;

    menuCards.forEach((card) => {

        const cardPrice = Number(card.dataset.price);
        const minimumPeople = Number(card.dataset.people);

        const matchesPrice =
            cardPrice >= minPrice &&
            cardPrice <= maxPrice;

        const matchesPeople =
            peopleFilter.value === "" ||
            minimumPeople <= selectedPeople;

        const matchesTheme =
            selectedTheme === "" ||
            card.dataset.theme === selectedTheme;

        const matchesDiet =
            selectedDiet === "" ||
            card.dataset.diet === selectedDiet;

        if (
            matchesPrice &&
            matchesPeople &&
            matchesTheme &&
            matchesDiet
        ) {
            card.style.display = "";
            visibleMenus++;
        } else {
            card.style.display = "none";
        }

    });
   
    if (visibleMenus === 0) {
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }
}

peopleFilter.addEventListener("input", () => {
    filterMenus();
});

themeFilter.addEventListener("change", () => {
    filterMenus();
});

dietFilter.addEventListener("change", () => {
    filterMenus();
});

resetButton.addEventListener("click", () => {

    // Réinitialisation du prix
    minRange.value = 0;
    maxRange.value = 150;

    minInput.value = 0;
    maxInput.value = 150;

    priceValue.textContent = "0 € - 150 €";


    // Réinitialisation des autres filtres
    themeFilter.value = "";
    dietFilter.value = "";
    peopleFilter.value = "";


    // Réaffichage des menus
    filterMenus();


    // Fermeture du panneau Prix s'il est ouvert
    pricePanel.hidden = true;

    priceToggle.setAttribute(
        "aria-expanded",
        "false"
    );

});

emptyResetButton.addEventListener("click", () => {
    resetButton.click();
});