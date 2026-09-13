document.addEventListener("DOMContentLoaded", async () => {
    const upcomingOrdersContainer =
        document.getElementById("upcoming-orders");

    const pastOrdersContainer =
        document.getElementById("past-orders");


    function formatDate(dateString) {
        if (!dateString) {
            return "Date non renseignée";
        }

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }


    function formatTime(timeString) {
        if (!timeString) {
            return "Heure non renseignée";
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

    function getStatusClass(status, isPast = false) {
        if (status === "cancelled") {
            return "order-status order-status-cancelled";
        }

        if (status === "completed" || isPast) {
            return "order-status order-status-completed";
        }

        return "order-status";
    }


    function createOrderCard(order, isPast = false) {
        const article = document.createElement("article");

        article.className = isPast
            ? "order-card order-card-past"
            : "order-card";


        const statusClass =
            getStatusClass(order.status, isPast);


        article.innerHTML = `
            <div class="order-card-header">

                <div>
                    <p class="order-number">
                        Commande #${order.id}
                    </p>

                    <h3>
                        ${order.menu_name}
                    </h3>
                </div>

                <span class="${statusClass}">
                    ${getStatusText(order.status)}
                </span>

            </div>


            <div class="order-card-details">

                <div class="order-detail">
                    <span>Date</span>
                    <strong>
                        ${formatDate(order.delivery_date)}
                    </strong>
                </div>

                <div class="order-detail">
                    <span>Heure</span>
                    <strong>
                        ${formatTime(order.delivery_time)}
                    </strong>
                </div>

                <div class="order-detail">
                    <span>Nombre de personnes</span>
                    <strong>
                        ${order.people}
                        ${Number(order.people) > 1
                            ? "personnes"
                            : "personne"}
                    </strong>
                </div>

                <div class="order-detail">
                    <span>Total</span>
                    <strong>
                        ${formatPrice(order.total_price)}
                    </strong>
                </div>

            </div>
        `;


        if (!isPast) {
            const actions =
                document.createElement("div");

            actions.className =
                "order-card-actions";

            actions.innerHTML = `
                <a
                    href="detail-commande.html?id=${order.id}"
                    class="order-secondary-button"
                >
                    Voir le détail
                </a>
            `;

            article.appendChild(actions);
        }


        return article;
    }


    try {
        const response = await fetch(
            "../backend/routes/orders.php"
        );

        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Impossible de charger les commandes."
            );
        }


        const orders = data.orders;


        const upcomingOrders = [];
        const pastOrders = [];


        orders.forEach((order) => {
            if (order.status === "completed") {
                pastOrders.push(order);
            } else {
                upcomingOrders.push(order);
            }
        });


        if (upcomingOrders.length === 0) {
            upcomingOrdersContainer.innerHTML = `
                <p class="orders-empty">
                    Vous n'avez aucune commande à venir.
                </p>
            `;
        } else {
            upcomingOrders.forEach((order) => {
                upcomingOrdersContainer.appendChild(
                    createOrderCard(order)
                );
            });
        }


        if (pastOrders.length === 0) {
            pastOrdersContainer.innerHTML = `
                <p class="orders-empty">
                    Vous n'avez encore aucune commande terminée.
                </p>
            `;
        } else {
            pastOrders.forEach((order) => {
                pastOrdersContainer.appendChild(
                    createOrderCard(
                        order,
                        true
                    )
                );
            });
        }

    } catch (error) {
        console.error(
            "Erreur lors du chargement des commandes :",
            error
        );

        upcomingOrdersContainer.innerHTML = `
            <p class="orders-empty">
                Impossible de charger vos commandes.
            </p>
        `;

        pastOrdersContainer.innerHTML = "";
    }
});