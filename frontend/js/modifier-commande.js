document.addEventListener("DOMContentLoaded", async () => {
    const orderEditTitle =
        document.getElementById("order-edit-title");

    const orderEditContent =
        document.getElementById("order-edit-content");

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("id");


    if (!orderId) {
        orderEditTitle.textContent =
            "Commande introuvable";

        orderEditContent.innerHTML = `
            <p class="orders-empty">
                Cette commande n'existe pas
                ou n'est plus disponible.
            </p>
        `;

        return;
    }


    try {
        // ========================================
        // CHARGEMENT DE LA COMMANDE
        // ========================================

        const response = await fetch(
            `../backend/routes/order-detail.php?id=${encodeURIComponent(orderId)}`
        );

        const data = await response.json();


        if (!response.ok || !data.success) {
            orderEditTitle.textContent =
                "Commande introuvable";

            orderEditContent.innerHTML = `
                <p class="orders-empty">
                    Cette commande n'existe pas
                    ou n'est plus disponible.
                </p>
            `;

            return;
        }


        const order = data.order;


        // ========================================
        // VÉRIFICATION DU STATUT
        // ========================================

        if (order.status !== "pending") {
            orderEditTitle.textContent =
                "Modification impossible";

            orderEditContent.innerHTML = `
                <p class="orders-empty">
                    Cette commande ne peut plus être modifiée.
                </p>
            `;

            return;
        }


        // ========================================
        // TITRE
        // ========================================

        orderEditTitle.textContent =
            `Modifier la commande #${order.id}`;


        // ========================================
        // DATE MINIMUM
        // ========================================

        const today =
            new Date().toISOString().split("T")[0];


        // ========================================
        // FORMULAIRE
        // ========================================

        orderEditContent.innerHTML = `
            <form
                class="order-edit-form"
                id="order-edit-form"
            >

                <div class="order-edit-card">

                    <div class="order-edit-field">
                        <label>
                            Menu
                        </label>

                        <input
                            type="text"
                            value="${order.menu_name}"
                            disabled
                        >
                    </div>


                    <div class="order-edit-field">
                        <label for="edit-people">
                            Nombre de personnes *
                        </label>

                        <input
                            type="number"
                            id="edit-people"
                            name="people"
                            min="1"
                            value="${order.people}"
                            required
                        >
                    </div>


                    <div class="order-edit-field">
                        <label for="edit-date">
                            Date de prestation *
                        </label>

                        <input
                            type="date"
                            id="edit-date"
                            name="delivery_date"
                            min="${today}"
                            value="${order.delivery_date}"
                            required
                        >
                    </div>


                    <div class="order-edit-field">
                        <label for="edit-time">
                            Heure *
                        </label>

                        <input
                            type="time"
                            id="edit-time"
                            name="delivery_time"
                            value="${order.delivery_time.slice(0, 5)}"
                            required
                        >
                    </div>


                    <div class="order-edit-field">
                        <label for="edit-address">
                            Adresse de livraison *
                        </label>

                        <input
                            type="text"
                            id="edit-address"
                            name="delivery_address"
                            value="${order.delivery_address}"
                            required
                        >
                    </div>


                    <div class="order-edit-field">
                        <label for="edit-postal-code">
                            Code postal *
                        </label>

                        <input
                            type="text"
                            id="edit-postal-code"
                            name="delivery_postal_code"
                            value="${order.delivery_postal_code}"
                            required
                        >
                    </div>


                    <div class="order-edit-field">
                        <label for="edit-city">
                            Ville *
                        </label>

                        <input
                            type="text"
                            id="edit-city"
                            name="delivery_city"
                            value="${order.delivery_city}"
                            required
                        >
                    </div>


                    <div class="order-edit-actions">

                        <a
                            href="detail-commande.html?id=${order.id}"
                            class="order-edit-cancel"
                        >
                            Annuler les modifications
                        </a>

                        <button
                            type="submit"
                            class="order-edit-submit"
                        >
                            Enregistrer les modifications
                        </button>

                    </div>

                </div>

            </form>
        `;


        // ========================================
        // ENREGISTREMENT DES MODIFICATIONS
        // ========================================

        const form =
            document.getElementById("order-edit-form");


        form.addEventListener("submit", async (event) => {
            event.preventDefault();


            if (!form.reportValidity()) {
                return;
            }


            const people =
                document.getElementById("edit-people");

            const deliveryDate =
                document.getElementById("edit-date");

            const deliveryTime =
                document.getElementById("edit-time");

            const deliveryAddress =
                document.getElementById("edit-address");

            const deliveryPostalCode =
                document.getElementById("edit-postal-code");

            const deliveryCity =
                document.getElementById("edit-city");


            const formData =
                new FormData();


            formData.append(
                "order_id",
                order.id
            );

            formData.append(
                "people",
                people.value
            );

            formData.append(
                "delivery_date",
                deliveryDate.value
            );

            formData.append(
                "delivery_time",
                deliveryTime.value
            );

            formData.append(
                "delivery_address",
                deliveryAddress.value.trim()
            );

            formData.append(
                "delivery_postal_code",
                deliveryPostalCode.value.trim()
            );

            formData.append(
                "delivery_city",
                deliveryCity.value.trim()
            );


            try {
                const updateResponse = await fetch(
                    "../backend/routes/update-order.php",
                    {
                        method: "POST",
                        body: formData
                    }
                );


                const updateData =
                    await updateResponse.json();


                if (
                    !updateResponse.ok ||
                    !updateData.success
                ) {
                    alert(
                        updateData.message ||
                        "Impossible de modifier la commande."
                    );

                    return;
                }


                window.location.href =
                    `detail-commande.html?id=${order.id}`;


            } catch (error) {
                console.error(
                    "Erreur lors de la modification de la commande :",
                    error
                );

                alert(
                    "Impossible de modifier la commande pour le moment."
                );
            }
        });


    } catch (error) {
        console.error(
            "Erreur lors du chargement de la commande :",
            error
        );

        orderEditTitle.textContent =
            "Erreur";

        orderEditContent.innerHTML = `
            <p class="orders-empty">
                Impossible de charger cette commande.
            </p>
        `;
    }
});