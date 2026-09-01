document.addEventListener("DOMContentLoaded", () => {
    const upcomingOrdersContainer =
        document.getElementById("upcoming-orders");

    const pastOrdersContainer =
        document.getElementById("past-orders");

    const savedOrders =
        JSON.parse(localStorage.getItem("viteGourmandOrders")) || [];


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


    function formatPrice(price) {
        return `${Number(price)
            .toFixed(2)
            .replace(".", ",")} €`;
    }


    function createOrderCard(order, isPast = false) {
        const article = document.createElement("article");

        article.className = isPast
            ? "order-card order-card-past"
            : "order-card";


        const statusClass = isPast
            ? "order-status order-status-completed"
            : "order-status";


        const statusText = isPast
            ? "Terminée"
            : "Confirmée";


        article.innerHTML = `
            <div class="order-card-header">

                <div>
                    <p class="order-number">
                        Commande #${order.id}
                    </p>

                    <h3>
                        ${order.menu}
                    </h3>
                </div>

                <span class="${statusClass}">
                    ${statusText}
                </span>

            </div>


            <div class="order-card-details">

                <div class="order-detail">
                    <span>Date</span>
                    <strong>
                        ${formatDate(order.deliveryDate)}
                    </strong>
                </div>

                <div class="order-detail">
                    <span>Heure</span>
                    <strong>
                        ${order.deliveryTime}
                    </strong>
                </div>

                <div class="order-detail">
                    <span>Nombre de personnes</span>
                    <strong>
                        ${order.people}
                        ${order.people > 1 ? "personnes" : "personne"}
                    </strong>
                </div>

                <div class="order-detail">
                    <span>Total</span>
                    <strong>
                        ${formatPrice(order.totalPrice)}
                    </strong>
                </div>

            </div>
        `;


        if (!isPast) {
            const actions = document.createElement("div");

            actions.className = "order-card-actions";

            actions.innerHTML = `
                <a
                    href="#"
                    class="order-secondary-button"
                >
                    Voir le détail
                </a>
            `;

            article.appendChild(actions);
        }


        return article;
    }


    const now = new Date();

    now.setHours(0, 0, 0, 0);


    const upcomingOrders = [];
    const pastOrders = [];


    savedOrders.forEach((order) => {
        if (!order.deliveryDate) {
            upcomingOrders.push(order);
            return;
        }

        const orderDate =
            new Date(`${order.deliveryDate}T00:00:00`);

        if (orderDate >= now) {
            upcomingOrders.push(order);
        } else {
            pastOrders.push(order);
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
                createOrderCard(order, true)
            );
        });
    }
});