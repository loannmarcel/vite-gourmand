// ========================================
// RÉCAPITULATIF DE LA COMMANDE
// ========================================

const storedOrder = sessionStorage.getItem("viteGourmandOrder");

if (storedOrder) {

    const order = JSON.parse(storedOrder);

    const checkoutMenu = document.querySelector("#checkout-menu");
    const checkoutPeople = document.querySelector("#checkout-people");
    const checkoutDate = document.querySelector("#checkout-date");
    const checkoutTime = document.querySelector("#checkout-time");

    const checkoutSubtotal = document.querySelector("#checkout-subtotal");
    const checkoutDiscountRow = document.querySelector("#checkout-discount-row");
    const checkoutDiscount = document.querySelector("#checkout-discount");
    const checkoutTotal = document.querySelector("#checkout-total");


    // ========================================
    // FORMAT DU PRIX
    // ========================================

    function formatPrice(price) {
        return price.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR"
        });
    }


    // ========================================
    // FORMAT DE LA DATE
    // ========================================

    function formatOrderDate(dateString) {

        const date = new Date(`${dateString}T12:00:00`);

        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }


    // ========================================
    // AFFICHAGE DES INFORMATIONS
    // ========================================

    checkoutMenu.textContent = order.menu;

    checkoutPeople.textContent =
        `${order.people} personne${order.people > 1 ? "s" : ""}`;

    checkoutDate.textContent =
        formatOrderDate(order.deliveryDate);

    checkoutTime.textContent =
        order.deliveryTime;


    // ========================================
    // PRIX
    // ========================================

    checkoutSubtotal.textContent =
        formatPrice(order.normalPrice);

    checkoutTotal.textContent =
        formatPrice(order.totalPrice);


    // ========================================
    // RÉDUCTION GROUPE
    // ========================================

    if (order.discountApplied) {

        const discountAmount =
            order.normalPrice - order.totalPrice;

        checkoutDiscount.textContent =
            `- ${formatPrice(discountAmount)}`;

        checkoutDiscountRow.hidden = false;

    } else {

        checkoutDiscountRow.hidden = true;
    }

}

// ========================================
// VALIDATION DE L'ADRESSE
// ========================================

const checkoutSubmit = document.querySelector("#checkout-submit");

const addressInput = document.querySelector("#order-address");
const postalCodeInput = document.querySelector("#order-postal-code");
const cityInput = document.querySelector("#order-city");


checkoutSubmit.addEventListener("click", function () {

    // Vérification de l'adresse
    if (!addressInput.value.trim()) {
        addressInput.setCustomValidity(
            "Veuillez renseigner votre adresse de livraison."
        );

        addressInput.reportValidity();
        return;
    }

    addressInput.setCustomValidity("");


    // Vérification du code postal
    if (!postalCodeInput.value.trim()) {
        postalCodeInput.setCustomValidity(
            "Veuillez renseigner votre code postal."
        );

        postalCodeInput.reportValidity();
        return;
    }

    postalCodeInput.setCustomValidity("");


    // Vérification de la ville
    if (!cityInput.value.trim()) {
        cityInput.setCustomValidity(
            "Veuillez renseigner votre ville."
        );

        cityInput.reportValidity();
        return;
    }

    cityInput.setCustomValidity("");


    // ========================================
    // AJOUT DE L'ADRESSE À LA COMMANDE
    // ========================================

    const order = JSON.parse(
        sessionStorage.getItem("viteGourmandOrder")
    );

    order.deliveryAddress = {
        address: addressInput.value.trim(),
        postalCode: postalCodeInput.value.trim(),
        city: cityInput.value.trim()
    };

    sessionStorage.setItem(
        "viteGourmandOrder",
        JSON.stringify(order)
    );

    console.log("Commande complète :", order);

    window.location.href = "confirmation-commande.html";
});