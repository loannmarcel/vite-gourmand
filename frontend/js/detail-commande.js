document.addEventListener("DOMContentLoaded", async () => {
    const orderDetailTitle =
        document.getElementById("order-detail-title");

    const orderDetailContent =
        document.getElementById("order-detail-content");

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("id");


    function formatDate(dateString) {
        if (!dateString) {
            return "Date non renseignée";
        }

        const date =
            new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }


    function formatCreatedAt(dateString) {
        if (!dateString) {
            return "Non renseignée";
        }

        const date = new Date(dateString);

        return date.toLocaleString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    function formatTime(timeString) {
        if (!timeString) {
            return "Non renseignée";
        }

        return timeString.slice(0, 5);
    }


    function formatPrice(price) {
        return `${Number(price)
            .toFixed(2)
            .replace(".", ",")} €`;
    }


    function getStatusText(status) {
        switch (status) {
            case "pending":
                return "En attente";

            case "accepted":
                return "Acceptée";

            case "preparing":
                return "En préparation";

            case "ready":
                return "Prête";

            case "delivered":
                return "Livrée";

            case "completed":
                return "Terminée";

            case "cancelled":
                return "Annulée";

            default:
                return status;
        }
    }


    function getStatusClass(status) {
        switch (status) {
            case "cancelled":
                return "order-detail-status order-detail-status-cancelled";

            case "completed":
                return "order-detail-status order-detail-status-completed";

            default:
                return "order-detail-status";
        }
    }


    if (!orderId) {
        orderDetailTitle.textContent =
            "Commande introuvable";

        orderDetailContent.innerHTML = `
            <p class="orders-empty">
                Cette commande n'existe pas
                ou n'est plus disponible.
            </p>
        `;

        return;
    }


    try {
        const response = await fetch(
            `../backend/routes/order-detail.php?id=${encodeURIComponent(orderId)}`
        );

        const data = await response.json();


        if (!response.ok || !data.success) {
            orderDetailTitle.textContent =
                "Commande introuvable";

            orderDetailContent.innerHTML = `
                <p class="orders-empty">
                    Cette commande n'existe pas
                    ou n'est plus disponible.
                </p>
            `;

            return;
        }


        const order = data.order;


        orderDetailTitle.textContent =
            `Commande #${order.id}`;


        orderDetailContent.innerHTML = `
            <div class="order-detail-card">

                <div class="${getStatusClass(order.status)}">
                    <span>Statut de la commande</span>

                    <strong>
                        ${getStatusText(order.status)}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Commande passée le</span>
                    <strong>
                        ${formatCreatedAt(order.created_at)}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Menu</span>
                    <strong>
                        ${order.menu_name}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Date de prestation</span>
                    <strong>
                        ${formatDate(order.delivery_date)}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Heure</span>
                    <strong>
                        ${formatTime(order.delivery_time)}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Adresse de livraison</span>

                    <strong>
                        ${order.delivery_address},
                        ${order.delivery_postal_code}
                        ${order.delivery_city}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Nombre de personnes</span>
                    <strong>
                        ${order.people}
                        ${Number(order.people) > 1
                            ? "personnes"
                            : "personne"}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Prix avant réduction</span>
                    <strong>
                        ${formatPrice(order.menu_price)}
                    </strong>
                </div>

                ${Number(order.discount_amount) > 0 ? `
                    <div class="order-detail-row">
                        <span>Réduction groupe</span>
                        <strong>
                            - ${formatPrice(order.discount_amount)}
                        </strong>
                    </div>
                ` : ""}

                <div class="order-detail-row">
                    <span>Livraison</span>
                    <strong>
                        ${formatPrice(order.delivery_price)}
                    </strong>
                </div>

                <div class="order-detail-row">
                    <span>Total</span>
                    <strong>
                        ${formatPrice(order.total_price)}
                    </strong>
                </div>

                ${order.status === "pending" ? `
                    <div class="order-detail-actions">

                        <a
                            href="modifier-commande.html?id=${order.id}"
                            class="order-edit-button"
                        >
                            Modifier la commande
                        </a>

                        <button
                            type="button"
                            class="order-cancel-button"
                            id="order-cancel-button"
                        >
                            Annuler la commande
                        </button>

                    </div>
                ` : ""}

            </div>
        `;


        const cancelButton =
            document.getElementById("order-cancel-button");


        if (cancelButton) {
            cancelButton.addEventListener("click", async () => {

                const confirmed = window.confirm(
                    "Voulez-vous vraiment annuler cette commande ?"
                );


                if (!confirmed) {
                    return;
                }


                const formData = new FormData();

                formData.append(
                    "order_id",
                    order.id
                );


                try {
                    const response = await fetch(
                        "../backend/routes/cancel-order.php",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                    const data = await response.json();


                    if (!response.ok || !data.success) {
                        alert(
                            data.message ||
                            "Impossible d'annuler la commande."
                        );

                        return;
                    }


                    window.location.reload();

                } catch (error) {
                    console.error(
                        "Erreur lors de l'annulation de la commande :",
                        error
                    );

                    alert(
                        "Impossible d'annuler la commande pour le moment."
                    );
                }
            });
        }


    } catch (error) {
        console.error(
            "Erreur lors du chargement de la commande :",
            error
        );

        orderDetailTitle.textContent =
            "Erreur";

        orderDetailContent.innerHTML = `
            <p class="orders-empty">
                Impossible de charger cette commande.
            </p>
        `;
    }
});