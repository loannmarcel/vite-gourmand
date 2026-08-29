// ========================================
// GESTION DU PRIX - DÉTAIL MENU
// ========================================

const orderPrice = document.querySelector(".order-price");

const peopleInput = document.querySelector("#order-people");
const peopleLabel = document.querySelector("#order-people-label");

const minusButton = document.querySelector("#order-minus");
const plusButton = document.querySelector("#order-plus");

const oldPrice = document.querySelector("#order-old-price");
const currentPrice = document.querySelector("#order-current-price");
const discountBadge = document.querySelector("#order-discount-badge");

const discountMessage = document.querySelector("#order-discount-message");


// Données du menu récupérées depuis le HTML
const minPeople = Number(orderPrice.dataset.minPeople);
const minPrice = Number(orderPrice.dataset.minPrice);

// Prix d'une personne
const pricePerPerson = minPrice / minPeople;

// La réduction commence à 5 personnes
// au-dessus du minimum du menu
const discountThreshold = minPeople + 5;


// Format français : 89,00 €
function formatPrice(price) {
    return price.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR"
    });
}


// Met à jour le prix selon le nombre de personnes
function updateOrderPrice() {
    const people = Number(peopleInput.value);

    const normalPrice = people * pricePerPerson;
    const hasDiscount = people >= discountThreshold;

    peopleLabel.textContent = people;

    if (hasDiscount) {
        const discountedPrice = normalPrice * 0.90;

        oldPrice.textContent = formatPrice(normalPrice);
        currentPrice.textContent = formatPrice(discountedPrice);

        oldPrice.hidden = false;
        discountBadge.hidden = false;
        discountMessage.hidden = false;
    } else {
        currentPrice.textContent = formatPrice(normalPrice);

        oldPrice.hidden = true;
        discountBadge.hidden = true;
        discountMessage.hidden = true;
    }

    minusButton.disabled = people <= minPeople;
}


// Bouton moins
minusButton.addEventListener("click", function () {
    const currentPeople = Number(peopleInput.value);

    if (currentPeople > minPeople) {
        peopleInput.value = currentPeople - 1;
        updateOrderPrice();
    }
});


// Bouton plus
plusButton.addEventListener("click", function () {
    const currentPeople = Number(peopleInput.value);

    peopleInput.value = currentPeople + 1;
    updateOrderPrice();
});


// Initialisation au chargement
updateOrderPrice();

// ========================================
// GESTION DE LA DATE ET DE L'HEURE
// ========================================

const orderCard = document.querySelector(".order-card");
const dateInput = document.querySelector("#order-date");
const timeInput = document.querySelector("#order-time");

// Temps de préparation propre au menu
const preparationHours = Number(orderCard.dataset.preparationHours);

// Horaires actuels de Vite & Gourmand
const openingHour = 9;
const closingHour = 18;


// ========================================
// OUTILS
// ========================================

// Format YYYY-MM-DD pour input type="date"
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Format HH:MM pour input type="time"
function formatTimeForInput(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}


// Vérifie si le jour est du lundi au vendredi
function isWeekday(date) {
    const day = date.getDay();

    return day >= 1 && day <= 5;
}


// Passe au prochain jour ouvré à 9h
function moveToNextOpeningDay(date) {
    const nextDate = new Date(date);

    do {
        nextDate.setDate(nextDate.getDate() + 1);
    } while (!isWeekday(nextDate));

    nextDate.setHours(openingHour, 0, 0, 0);

    return nextDate;
}


// ========================================
// PREMIER CRÉNEAU DISPONIBLE
// ========================================

function getEarliestDeliveryMoment() {
    const earliestDelivery = new Date();

    // Ajout du temps de préparation
    earliestDelivery.setHours(
        earliestDelivery.getHours() + preparationHours
    );

    // Samedi ou dimanche
    if (!isWeekday(earliestDelivery)) {
        return moveToNextOpeningDay(earliestDelivery);
    }

    const openingTime = new Date(earliestDelivery);
    openingTime.setHours(openingHour, 0, 0, 0);

    const closingTime = new Date(earliestDelivery);
    closingTime.setHours(closingHour, 0, 0, 0);

    // Avant l'ouverture
    if (earliestDelivery < openingTime) {
        return openingTime;
    }

    // Après la fermeture
    if (earliestDelivery > closingTime) {
        return moveToNextOpeningDay(earliestDelivery);
    }

    return earliestDelivery;
}


// ========================================
// CONTRAINTES DATE / HEURE
// ========================================

function updateDeliveryConstraints() {
    const earliestDelivery = getEarliestDeliveryMoment();
    const earliestDate = formatDateForInput(earliestDelivery);

    // Première date autorisée
    dateInput.min = earliestDate;

    // Horaires généraux
    timeInput.min = "09:00";
    timeInput.max = "18:00";

    if (!dateInput.value) {
        return;
    }

    const selectedDate = new Date(
        `${dateInput.value}T12:00:00`
    );

    const selectedDay = selectedDate.getDay();

    // Réinitialise les messages d'erreur
    dateInput.setCustomValidity("");
    timeInput.setCustomValidity("");


    // ========================================
    // SAMEDI
    // ========================================

    if (selectedDay === 6) {
        dateInput.setCustomValidity(
            "Le samedi, Vite & Gourmand fonctionne uniquement sur rendez-vous. Merci de nous contacter."
        );

        timeInput.value = "";
        timeInput.disabled = true;

        dateInput.reportValidity();

        return;
    }


    // ========================================
    // DIMANCHE
    // ========================================

    if (selectedDay === 0) {
        dateInput.setCustomValidity(
            "Vite & Gourmand est fermé le dimanche."
        );

        timeInput.value = "";
        timeInput.disabled = true;

        dateInput.reportValidity();

        return;
    }


    // Jour ouvré
    timeInput.disabled = false;


    // ========================================
    // PREMIÈRE DATE DISPONIBLE
    // ========================================

    if (dateInput.value === earliestDate) {
        const earliestTime = formatTimeForInput(
            earliestDelivery
        );

        timeInput.min = earliestTime;

        // Si une heure déjà choisie devient trop tôt
        if (
            timeInput.value &&
            timeInput.value < earliestTime
        ) {
            timeInput.value = "";
        }
    } else {
        timeInput.min = "09:00";
    }
}


// ========================================
// VALIDATION DE L'HEURE
// ========================================

function validateDeliveryTime() {
    if (!timeInput.value) {
        return;
    }

    timeInput.setCustomValidity("");

    if (timeInput.value < timeInput.min) {
        timeInput.setCustomValidity(
            `L'heure de livraison doit être au minimum ${timeInput.min}.`
        );

        timeInput.reportValidity();

        return;
    }

    if (timeInput.value > timeInput.max) {
        timeInput.setCustomValidity(
            "Les livraisons sont possibles jusqu'à 18h00."
        );

        timeInput.reportValidity();
    }
}


// ========================================
// ÉVÉNEMENTS
// ========================================

dateInput.addEventListener("change", function () {
    updateDeliveryConstraints();
});

timeInput.addEventListener("change", function () {
    validateDeliveryTime();
});


// ========================================
// INITIALISATION
// ========================================

updateDeliveryConstraints();

// ========================================
// COMMANDE DU MENU
// ========================================

const orderButton = document.querySelector("#order-button");

orderButton.addEventListener("click", function () {

    // Réinitialise les éventuels messages d'erreur
    dateInput.setCustomValidity("");
    timeInput.setCustomValidity("");

    // Vérification de la date
    if (!dateInput.value) {
        dateInput.setCustomValidity(
            "Veuillez sélectionner une date de livraison."
        );

        dateInput.reportValidity();
        return;
    }

    // Vérifie également les contraintes liées
    // au jour sélectionné
    updateDeliveryConstraints();

    if (!dateInput.checkValidity()) {
        dateInput.reportValidity();
        return;
    }

    // Vérification de l'heure
    if (!timeInput.value) {
        timeInput.setCustomValidity(
            "Veuillez sélectionner une heure de livraison."
        );

        timeInput.reportValidity();
        return;
    }

    // Vérification des horaires autorisés
    validateDeliveryTime();

    if (!timeInput.checkValidity()) {
        timeInput.reportValidity();
        return;
    }


    // ========================================
    // PRÉPARATION DES DONNÉES
    // ========================================

    const people = Number(peopleInput.value);

    const normalPrice = people * pricePerPerson;
    const hasDiscount = people >= discountThreshold;

    const finalPrice = hasDiscount
        ? normalPrice * 0.90
        : normalPrice;


    const orderData = {
        menu: "Menu Healthy",
        people: people,
        deliveryDate: dateInput.value,
        deliveryTime: timeInput.value,
        normalPrice: Number(normalPrice.toFixed(2)),
        discountApplied: hasDiscount,
        discountRate: hasDiscount ? 10 : 0,
        totalPrice: Number(finalPrice.toFixed(2))
    };


    // Stockage temporaire de la commande
    sessionStorage.setItem(
        "viteGourmandOrder",
        JSON.stringify(orderData)
    );

    console.log("Commande préparée :", orderData);
});