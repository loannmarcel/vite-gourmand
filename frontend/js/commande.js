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

    const deliveryPrice = 5;

    checkoutSubtotal.textContent =
        formatPrice(order.normalPrice);

    checkoutTotal.textContent =
        formatPrice(order.totalPrice + deliveryPrice);


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
const phoneInput = document.querySelector("#order-phone");

async function loadAccountAddress() {
    try {
        const response = await fetch(
            "../backend/routes/account.php"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            return;
        }

        const user = data.user;

        addressInput.value = user.address || "";
        postalCodeInput.value = user.postal_code || "";
        cityInput.value = user.city || "";
        phoneInput.value = user.phone || "";

    } catch (error) {
        console.error(
            "Erreur lors du chargement de l'adresse :",
            error
        );
    }
}

loadAccountAddress();


checkoutSubmit.addEventListener("click", async function () {

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


    const order = JSON.parse(
        sessionStorage.getItem("viteGourmandOrder")
    );


    if (!order) {
        alert("Aucune commande à enregistrer.");
        return;
    }


    const formData = new FormData();

    formData.append(
        "menu_id",
        order.menuId
    );

    formData.append(
        "people",
        order.people
    );

    formData.append(
        "delivery_date",
        order.deliveryDate
    );

    formData.append(
        "delivery_time",
        order.deliveryTime
    );

    formData.append(
        "delivery_address",
        addressInput.value.trim()
    );

    formData.append(
        "delivery_postal_code",
        postalCodeInput.value.trim()
    );

    formData.append(
        "delivery_city",
        cityInput.value.trim()
    );


    try {
        const response = await fetch(
            "../backend/routes/create-order.php",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();


        if (!response.ok || !data.success) {
            alert(
                data.message ||
                "Impossible d'enregistrer la commande."
            );

            return;
        }


        sessionStorage.setItem(
            "viteGourmandConfirmedOrder",
            JSON.stringify(data.order)
        );


        sessionStorage.removeItem(
            "viteGourmandOrder"
        );


        window.location.href =
            "confirmation-commande.html";


    } catch (error) {
        console.error(
            "Erreur lors de l'enregistrement de la commande :",
            error
        );

        alert(
            "Impossible d'enregistrer la commande pour le moment."
        );
    }
});