const orderSearchInput =
    document.getElementById("employee-order-search");

const orderStatusSelect =
    document.getElementById("employee-order-status");

const employeeOrdersList =
    document.getElementById("employee-orders-list");

const employeeOrdersEmpty =
    document.getElementById("employee-orders-empty");


let employeeOrders = [];


/* =====================================================
   STATUTS
===================================================== */

const statusLabels = {
    pending: "En attente",
    accepted: "Acceptée",
    preparation: "En préparation",
    delivery: "En cours de livraison",
    delivered: "Livrée",
    equipment: "En attente du retour de matériel",
    completed: "Terminée",
    cancelled: "Annulée"
};


/* =====================================================
   FORMATAGE
===================================================== */

function formatDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString(
        "fr-FR",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


function formatTime(timeValue) {

    if (!timeValue) {
        return "";
    }

    return timeValue.slice(0, 5);
}


function formatPrice(priceValue) {

    const price =
        Number(priceValue);

    return price.toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";
}


/* =====================================================
   AFFICHAGE DES COMMANDES
===================================================== */

function renderEmployeeOrders() {

    employeeOrdersList.innerHTML = "";

    employeeOrders.forEach((order) => {

        const article =
            document.createElement("article");

        article.className =
            "employee-order-card";

        article.dataset.client =
            `${order.first_name} ${order.last_name} ${order.email}`
                .toLowerCase();

        article.dataset.status =
            order.status;

        article.dataset.orderId =
            order.id;


        const statusText =
            statusLabels[order.status] ||
            order.status;


        article.innerHTML = `
            <div class="employee-order-card-header">

                <div>
                    <span class="employee-order-reference">
                        Commande #VG${String(order.id).padStart(7, "0")}
                    </span>

                    <h2>
                        ${order.first_name} ${order.last_name}
                    </h2>

                    <p>
                        ${order.email}
                    </p>
                </div>

                <span
                    class="employee-order-status employee-order-status-${order.status}"
                >
                    ${statusText}
                </span>

            </div>


            <div class="employee-order-information">

                <div>
                    <span>Menu</span>

                    <strong>
                        ${order.menu_name}
                    </strong>
                </div>

                <div>
                    <span>Date</span>

                    <strong>
                        ${formatDate(order.delivery_date)}
                    </strong>
                </div>

                <div>
                    <span>Heure</span>

                    <strong>
                        ${formatTime(order.delivery_time)}
                    </strong>
                </div>

                <div>
                    <span>Personnes</span>

                    <strong>
                        ${order.people}
                    </strong>
                </div>

                <div>
                    <span>Total</span>

                    <strong>
                        ${formatPrice(order.total_price)}
                    </strong>
                </div>

            </div>


            <div
                class="employee-order-details"
                hidden
            >

                <div class="employee-order-details-grid">

                    <div>
                        <span>
                            Adresse de livraison
                        </span>

                        <strong>
                            ${order.delivery_address},
                            ${order.delivery_postal_code}
                            ${order.delivery_city}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Téléphone
                        </span>

                        <strong>
                            ${order.phone}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Prix du menu
                        </span>

                        <strong>
                            ${formatPrice(order.menu_price)}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Réduction
                        </span>

                        <strong>
                            ${formatPrice(order.discount_amount)}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Livraison
                        </span>

                        <strong>
                            ${formatPrice(order.delivery_price)}
                        </strong>
                    </div>

                </div>

                <div class="employee-order-history">

                    <h3>
                        Historique de la commande
                    </h3>

                    <div class="employee-order-history-list">
                        <p>
                            Chargement de l'historique...
                        </p>
                    </div>

                </div>

            </div>


            <div class="employee-order-actions">

                <button
                    type="button"
                    class="
                        employee-order-secondary-button
                        employee-order-detail-button
                    "
                    aria-expanded="false"
                >
                    Voir le détail
                </button>

                ${
                    order.status !== "cancelled" &&
                    order.status !== "completed"
                        ? `
                            <button
                                type="button"
                                class="
                                    employee-order-primary-button
                                    employee-order-manage-button
                                "
                                aria-expanded="false"
                            >
                                Gérer la commande
                            </button>
                        `
                        : ""
                }

            </div>


            ${
                order.status !== "cancelled" &&
                order.status !== "completed"
                    ? `
                        <div
                            class="employee-order-management"
                            hidden
                        >

                            <div class="employee-order-management-heading">

                                <h3>
                                    Gérer la commande
                                </h3>

                                <p>
                                    Modifiez le statut de cette commande
                                    ou procédez à son annulation.
                                </p>

                            </div>


                            <div class="employee-order-management-field">

                                <label>
                                    Nouveau statut
                                </label>

                                <select
                                    class="employee-order-status-select"
                                >

                                    <option value="">
                                        Sélectionner un statut
                                    </option>

                                    <option value="accepted">
                                        Acceptée
                                    </option>

                                    <option value="preparation">
                                        En préparation
                                    </option>

                                    <option value="delivery">
                                        En cours de livraison
                                    </option>

                                    <option value="delivered">
                                        Livrée
                                    </option>

                                    <option value="equipment">
                                        En attente du retour de matériel
                                    </option>

                                    <option value="completed">
                                        Terminée
                                    </option>

                                </select>

                            </div>


                            <div class="employee-order-management-actions">

                                <button
                                    type="button"
                                    class="employee-order-cancel-button"
                                >
                                    Annuler la commande
                                </button>

                                <button
                                    type="button"
                                    class="employee-order-status-button"
                                >
                                    Mettre à jour le statut
                                </button>

                            </div>


                            <div
                                class="employee-order-cancellation"
                                hidden
                            >

                                <div class="employee-order-cancellation-heading">

                                    <h4>
                                        Annulation de la commande
                                    </h4>

                                    <p>
                                        Indiquez comment le client a été contacté
                                        ainsi que le motif de l'annulation.
                                    </p>

                                </div>


                                <div class="employee-order-cancellation-fields">

                                    <div class="employee-order-cancellation-field">

                                        <label>
                                            Mode de contact
                                        </label>

                                        <select
                                            class="employee-order-cancellation-contact-select"
                                        >
                                            <option value="">
                                                Sélectionner un mode de contact
                                            </option>

                                            <option value="phone">
                                                Téléphone
                                            </option>

                                            <option value="email">
                                                E-mail
                                            </option>
                                        </select>

                                    </div>


                                    <div class="employee-order-cancellation-field">

                                        <label>
                                            Motif de l'annulation
                                        </label>

                                        <textarea
                                            class="employee-order-cancellation-reason-input"
                                            rows="4"
                                            placeholder="Indiquez le motif de l'annulation"
                                        ></textarea>

                                    </div>

                                </div>


                                <div class="employee-order-cancellation-actions">

                                    <button
                                        type="button"
                                        class="employee-order-cancellation-back-button"
                                    >
                                        Retour
                                    </button>

                                    <button
                                        type="button"
                                        class="employee-order-cancellation-confirm-button"
                                    >
                                        Confirmer l'annulation
                                    </button>

                                </div>

                            </div>

                        </div>
                    `
                    : ""
            }
        `;


        employeeOrdersList.appendChild(article);

    });


    addEmployeeOrderEvents();

    filterEmployeeOrders();
}


/* =====================================================
   FILTRES
===================================================== */

function filterEmployeeOrders() {

    const employeeOrderCards =
        document.querySelectorAll(
            ".employee-order-card"
        );

    const searchValue =
        orderSearchInput.value
            .trim()
            .toLowerCase();

    const statusValue =
        orderStatusSelect.value;

    let visibleOrders = 0;


    employeeOrderCards.forEach((card) => {

        const client =
            card.dataset.client;

        const status =
            card.dataset.status;


        const matchesClient =
            client.includes(searchValue);

        const matchesStatus =
            statusValue === "all" ||
            status === statusValue;


        if (
            matchesClient &&
            matchesStatus
        ) {

            card.hidden = false;

            visibleOrders++;

        } else {

            card.hidden = true;

        }

    });


    employeeOrdersEmpty.hidden =
        visibleOrders !== 0;
}


/* =====================================================
   ÉVÉNEMENTS DES CARTES
===================================================== */

function addEmployeeOrderEvents() {

    /* DÉTAIL */

    const orderDetailButtons =
        document.querySelectorAll(
            ".employee-order-detail-button"
        );

    orderDetailButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const card =
                    button.closest(
                        ".employee-order-card"
                    );

                const details =
                    card.querySelector(
                        ".employee-order-details"
                    );

                const historyList =
                    card.querySelector(
                        ".employee-order-history-list"
                    );

                const orderId =
                    card.dataset.orderId;

                const isOpen =
                    button.getAttribute(
                        "aria-expanded"
                    ) === "true";


                button.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

                details.hidden =
                    isOpen;

                button.textContent =
                    isOpen
                        ? "Voir le détail"
                        : "Masquer le détail";


                if (isOpen) {
                    return;
                }


                try {

                    const response =
                        await fetch(
                            `../backend/routes/employee-order-history.php?order_id=${orderId}`
                        );

                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        historyList.innerHTML = `
                            <p>
                                Impossible de charger l'historique.
                            </p>
                        `;

                        return;
                    }


                    if (data.history.length === 0) {

                        historyList.innerHTML = `
                            <p>
                                Aucun historique disponible.
                            </p>
                        `;

                        return;
                    }


                    historyList.innerHTML =
                        data.history
                            .map((item) => {

                                const statusText =
                                    statusLabels[item.status] ||
                                    item.status;

                                const date =
                                    new Date(
                                        item.changed_at.replace(
                                            " ",
                                            "T"
                                        )
                                    );

                                const formattedDate =
                                    date.toLocaleString(
                                        "fr-FR",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    );


                                return `
                                    <div class="employee-order-history-item">

                                        <span>
                                            ${statusText}
                                        </span>

                                        <strong>
                                            ${formattedDate}
                                        </strong>

                                    </div>
                                `;

                            })
                            .join("");


                } catch (error) {

                    console.error(
                        "Erreur de chargement de l'historique :",
                        error
                    );

                    historyList.innerHTML = `
                        <p>
                            Impossible de charger l'historique.
                        </p>
                    `;

                }

            }
        );

    });


    /* OUVERTURE DE LA GESTION */

    const manageButtons =
        document.querySelectorAll(
            ".employee-order-manage-button"
        );


    manageButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".employee-order-card"
                    );

                const managementPanel =
                    card.querySelector(
                        ".employee-order-management"
                    );

                const isOpen =
                    button.getAttribute(
                        "aria-expanded"
                    ) === "true";


                managementPanel.hidden =
                    isOpen;

                button.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

                button.textContent =
                    isOpen
                        ? "Gérer la commande"
                        : "Fermer la gestion";
            }
        );

    });


    /* MISE À JOUR DU STATUT */

    const statusButtons =
        document.querySelectorAll(
            ".employee-order-status-button"
        );


    statusButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const card =
                    button.closest(
                        ".employee-order-card"
                    );

                const statusSelect =
                    card.querySelector(
                        ".employee-order-status-select"
                    );

                const order =
                    employeeOrders.find(
                        (item) =>
                            String(item.id) ===
                            card.dataset.orderId
                    );


                if (!order || !statusSelect) {
                    return;
                }


                const newStatus =
                    statusSelect.value;


                if (newStatus === "") {

                    alert(
                        "Veuillez sélectionner un statut."
                    );

                    return;
                }


                try {

                    const response =
                        await fetch(
                            "../backend/routes/update-order-status.php",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded"
                                },
                                body: new URLSearchParams({
                                    order_id: order.id,
                                    status: newStatus
                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Impossible de modifier le statut."
                        );

                        return;
                    }


                    await loadEmployeeOrders();


                } catch (error) {

                    console.error(
                        "Erreur de mise à jour du statut :",
                        error
                    );

                    alert(
                        "Impossible de modifier le statut."
                    );

                }

            }
        );

    });


    /* OUVERTURE DE L'ANNULATION */

    const cancelButtons =
        document.querySelectorAll(
            ".employee-order-cancel-button"
        );


    cancelButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".employee-order-card"
                    );

                const cancellationPanel =
                    card.querySelector(
                        ".employee-order-cancellation"
                    );


                if (!cancellationPanel) {
                    return;
                }


                cancellationPanel.hidden =
                    false;

            }
        );

    });


    /* RETOUR DEPUIS L'ANNULATION */

    const cancellationBackButtons =
        document.querySelectorAll(
            ".employee-order-cancellation-back-button"
        );


    cancellationBackButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const cancellationPanel =
                    button.closest(
                        ".employee-order-cancellation"
                    );


                if (!cancellationPanel) {
                    return;
                }


                cancellationPanel.hidden =
                    true;

            }
        );

    });


    /* CONFIRMATION DE L'ANNULATION */

    const cancellationConfirmButtons =
        document.querySelectorAll(
            ".employee-order-cancellation-confirm-button"
        );


    cancellationConfirmButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const card =
                    button.closest(
                        ".employee-order-card"
                    );

                const cancellationPanel =
                    button.closest(
                        ".employee-order-cancellation"
                    );

                const contactSelect =
                    cancellationPanel.querySelector(
                        ".employee-order-cancellation-contact-select"
                    );

                const reasonInput =
                    cancellationPanel.querySelector(
                        ".employee-order-cancellation-reason-input"
                    );


                if (
                    !card ||
                    !contactSelect ||
                    !reasonInput
                ) {
                    return;
                }


                const contactMethod =
                    contactSelect.value;

                const reason =
                    reasonInput.value.trim();


                if (
                    contactMethod === "" ||
                    reason === ""
                ) {

                    alert(
                        "Veuillez renseigner le mode de contact et le motif de l'annulation."
                    );

                    return;
                }


                const order =
                    employeeOrders.find(
                        (item) =>
                            String(item.id) ===
                            card.dataset.orderId
                    );


                if (!order) {
                    return;
                }


                const confirmed =
                    window.confirm(
                        "Confirmer l'annulation de cette commande ?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    const response =
                        await fetch(
                            "../backend/routes/cancel-order-employee.php",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/x-www-form-urlencoded"
                                },
                                body: new URLSearchParams({
                                    order_id: order.id,
                                    contact_method: contactMethod,
                                    reason: reason
                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        alert(
                            data.message ||
                            "Impossible d'annuler la commande."
                        );

                        return;
                    }


                    await loadEmployeeOrders();


                } catch (error) {

                    console.error(
                        "Erreur d'annulation de la commande :",
                        error
                    );

                    alert(
                        "Impossible d'annuler la commande."
                    );

                }

            }
        );

    });

}


/* =====================================================
   CHARGEMENT DES COMMANDES
===================================================== */

async function loadEmployeeOrders() {

    try {

        const response =
            await fetch(
                "../backend/routes/employee-orders.php"
            );

        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Impossible de récupérer les commandes."
            );

        }


        employeeOrders =
            data.orders;


        renderEmployeeOrders();


    } catch (error) {

        console.error(
            "Erreur de chargement des commandes :",
            error
        );


        employeeOrdersList.innerHTML = `
            <p>
                Impossible de charger les commandes.
            </p>
        `;

    }

}


/* =====================================================
   ÉVÉNEMENTS DES FILTRES
===================================================== */

orderSearchInput.addEventListener(
    "input",
    filterEmployeeOrders
);

orderStatusSelect.addEventListener(
    "change",
    filterEmployeeOrders
);


/* =====================================================
   INITIALISATION
===================================================== */

loadEmployeeOrders();