document.addEventListener("DOMContentLoaded", () => {
    const savedOrder = sessionStorage.getItem("viteGourmandOrder");

    if (!savedOrder) {
        window.location.href = "menus.html";
        return;
    }

    const order = JSON.parse(savedOrder);

    const menuElement = document.getElementById("confirmation-menu");
    const peopleElement = document.getElementById("confirmation-people");
    const dateElement = document.getElementById("confirmation-date");
    const timeElement = document.getElementById("confirmation-time");
    const totalElement = document.getElementById("confirmation-total");

    menuElement.textContent = order.menu;

    peopleElement.textContent =
        `${order.people} ${order.people > 1 ? "personnes" : "personne"}`;

    if (order.deliveryDate) {
        const [year, month, day] = order.deliveryDate.split("-");
        dateElement.textContent = `${day}/${month}/${year}`;
    }

    timeElement.textContent = order.deliveryTime;

    totalElement.textContent =
        `${Number(order.totalPrice).toFixed(2).replace(".", ",")} €`;


    // =====================================================
    // ENREGISTREMENT DANS L'HISTORIQUE
    // =====================================================

    const savedOrders =
        JSON.parse(localStorage.getItem("viteGourmandOrders")) || [];

    const orderToSave = {
        ...order,
        id: `VG${Date.now()}`,
        status: "Confirmée",
        createdAt: new Date().toISOString()
    };

    savedOrders.unshift(orderToSave);

    localStorage.setItem(
        "viteGourmandOrders",
        JSON.stringify(savedOrders)
    );


    // La commande temporaire n'est plus nécessaire
    sessionStorage.removeItem("viteGourmandOrder");
});