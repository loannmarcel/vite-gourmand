document.addEventListener("DOMContentLoaded", () => {
    const orderDetailTitle =
        document.getElementById("order-detail-title");

    const orderDetailContent =
        document.getElementById("order-detail-content");

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("id");

    const savedOrders =
        JSON.parse(localStorage.getItem("viteGourmandOrders")) || [];

    const order =
        savedOrders.find(
            (savedOrder) =>
                String(savedOrder.id) === String(orderId)
        );


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


    function formatPrice(price) {
        return `${Number(price)
            .toFixed(2)
            .replace(".", ",")} €`;
    }


    if (!order) {
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


    orderDetailTitle.textContent =
        `Commande #${order.id}`;


    orderDetailContent.innerHTML = `
        <div class="order-detail-card">

            <div class="order-detail-status">
                <span>Statut de la commande</span>

                <strong>
                    ${order.status || "Confirmée"}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Commande passée le</span>
                <strong>
                    ${formatCreatedAt(order.createdAt)}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Menu</span>
                <strong>${order.menu}</strong>
            </div>

            <div class="order-detail-row">
                <span>Date de prestation</span>
                <strong>
                    ${formatDate(order.deliveryDate)}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Heure</span>
                <strong>
                    ${order.deliveryTime || "Non renseignée"}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Adresse de livraison</span>

                <strong>
                    ${order.deliveryAddress
                        ? `${order.deliveryAddress.address}, ${order.deliveryAddress.postalCode} ${order.deliveryAddress.city}`
                        : "Non renseignée"}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Nombre de personnes</span>
                <strong>
                    ${order.people}
                    ${order.people > 1 ? "personnes" : "personne"}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Prix avant réduction</span>
                <strong>
                    ${formatPrice(order.normalPrice)}
                </strong>
            </div>

            ${order.discountApplied ? `
                <div class="order-detail-row">
                    <span>Réduction groupe</span>
                    <strong>
                        - ${formatPrice(order.normalPrice - order.totalPrice)}
                    </strong>
                </div>
            ` : ""}

            <div class="order-detail-row">
                <span>Livraison</span>
                <strong>
                    ${formatPrice(order.deliveryPrice)}
                </strong>
            </div>

            <div class="order-detail-row">
                <span>Total</span>
                <strong>
                    ${formatPrice(order.finalPrice)}
                </strong>
            </div>

        </div>
    `;
});