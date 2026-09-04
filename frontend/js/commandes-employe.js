const orderSearchInput = document.getElementById("employee-order-search");
const orderStatusSelect = document.getElementById("employee-order-status");
const employeeOrderCards = document.querySelectorAll(".employee-order-card");
const employeeOrdersEmpty = document.getElementById("employee-orders-empty");


function filterEmployeeOrders() {

    const searchValue =
        orderSearchInput.value.trim().toLowerCase();

    const statusValue =
        orderStatusSelect.value;

    let visibleOrders = 0;


    employeeOrderCards.forEach((card) => {

        const client =
            card.dataset.client.toLowerCase();

        const status =
            card.dataset.status;


        const matchesClient =
            client.includes(searchValue);

        const matchesStatus =
            statusValue === "all" ||
            status === statusValue;


        if (matchesClient && matchesStatus) {
            card.hidden = false;
            visibleOrders++;
        } else {
            card.hidden = true;
        }

    });


    employeeOrdersEmpty.hidden =
        visibleOrders !== 0;
}


orderSearchInput.addEventListener(
    "input",
    filterEmployeeOrders
);

orderStatusSelect.addEventListener(
    "change",
    filterEmployeeOrders
);

const orderDetailButtons =
    document.querySelectorAll(".employee-order-detail-button");


orderDetailButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const card =
            button.closest(".employee-order-card");

        const details =
            card.querySelector(".employee-order-details");

        const isOpen =
            button.getAttribute("aria-expanded") === "true";


        button.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        details.hidden = isOpen;

        button.textContent =
            isOpen
                ? "Voir le détail"
                : "Masquer le détail";

    });

});

const employeeOrderManageButtons =
    document.querySelectorAll(".employee-order-manage-button");

employeeOrderManageButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const orderCard =
            button.closest(".employee-order-card");

        const managementPanel =
            orderCard.querySelector(".employee-order-management");

        if (!managementPanel) {
            return;
        }

        const isOpen =
            button.getAttribute("aria-expanded") === "true";

        managementPanel.hidden = isOpen;

        button.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        button.textContent =
            isOpen
                ? "Gérer la commande"
                : "Fermer la gestion";

    });

});

const employeeOrderStatusButtons =
    document.querySelectorAll(".employee-order-status-button");

employeeOrderStatusButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const orderCard =
            button.closest(".employee-order-card");

        const statusSelect =
            orderCard.querySelector(".employee-order-management-field select");

        const statusBadge =
            orderCard.querySelector(".employee-order-status");

        if (!statusSelect || !statusBadge) {
            return;
        }

        const selectedValue = statusSelect.value;

        if (selectedValue === "") {
            return;
        }

        const selectedText =
            statusSelect.options[statusSelect.selectedIndex].text;

        statusBadge.textContent = selectedText;

        statusBadge.className = "employee-order-status";

        statusBadge.classList.add(
            `employee-order-status-${selectedValue}`
        );

        orderCard.dataset.status = selectedValue;

    });

});

const employeeOrderCancelButtons =
    document.querySelectorAll(".employee-order-cancel-button");

employeeOrderCancelButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const orderCard =
            button.closest(".employee-order-card");

        const cancellationPanel =
            orderCard.querySelector(".employee-order-cancellation");

        if (!cancellationPanel) {
            return;
        }

        cancellationPanel.hidden = false;

    });

});

const employeeOrderCancellationBackButtons =
    document.querySelectorAll(".employee-order-cancellation-back-button");

employeeOrderCancellationBackButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const cancellationPanel =
            button.closest(".employee-order-cancellation");

        if (!cancellationPanel) {
            return;
        }

        cancellationPanel.hidden = true;

    });

});

const employeeOrderCancellationConfirmButtons =
    document.querySelectorAll(".employee-order-cancellation-confirm-button");

employeeOrderCancellationConfirmButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const cancellationPanel =
            button.closest(".employee-order-cancellation");

        if (!cancellationPanel) {
            return;
        }

        const contactSelect =
            cancellationPanel.querySelector("select");

        const reasonTextarea =
            cancellationPanel.querySelector("textarea");

        if (!contactSelect || !reasonTextarea) {
            return;
        }

        const contactValue = contactSelect.value;
        const reasonValue = reasonTextarea.value.trim();

        if (contactValue === "" || reasonValue === "") {
            alert(
                "Veuillez renseigner le mode de contact et le motif de l'annulation."
            );

            return;
        }

        const orderCard =
            button.closest(".employee-order-card");

        const statusBadge =
            orderCard.querySelector(".employee-order-status");

        if (!orderCard || !statusBadge) {
            return;
        }

        /* Mise à jour du statut de la commande */

        orderCard.dataset.status = "cancelled";

        statusBadge.textContent = "Annulée";

        statusBadge.className =
            "employee-order-status employee-order-status-cancelled";

        /* Conservation temporaire des informations d'annulation */

        orderCard.dataset.cancellationContact =
            contactValue;

        orderCard.dataset.cancellationReason =
            reasonValue;

        const cancellationSummary =
            orderCard.querySelector(".employee-order-cancellation-summary");

        const cancellationContact =
            orderCard.querySelector(".employee-order-cancellation-contact");

        const cancellationReason =
            orderCard.querySelector(".employee-order-cancellation-reason");

        if (
            cancellationSummary &&
            cancellationContact &&
            cancellationReason
        ) {

            const contactText =
                contactSelect.options[
                    contactSelect.selectedIndex
                ].text;

            cancellationContact.textContent =
                contactText;

            cancellationReason.textContent =
                reasonValue;

            cancellationSummary.hidden = false;
        }

        /* Fermeture du formulaire d'annulation */

        cancellationPanel.hidden = true;

        const managementPanel =
            orderCard.querySelector(".employee-order-management");

        const manageButton =
            orderCard.querySelector(".employee-order-manage-button");

        if (managementPanel && manageButton) {
            managementPanel.hidden = true;

            manageButton.setAttribute(
                "aria-expanded",
                "false"
            );

            manageButton.textContent =
                "Gérer la commande";
        }

    });

});