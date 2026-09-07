/* =====================================================
   HEADER ESPACE EMPLOYÉ
===================================================== */


/* PROTECTION DES PAGES EMPLOYÉ */

const employeeConnected =
    sessionStorage.getItem("viteGourmandEmployeeConnected");

if (employeeConnected !== "true") {
    window.location.href =
        "connexion.html";
}


/* MENU DU COMPTE EMPLOYÉ */

const accountMenuToggle =
    document.querySelector("#account-menu-toggle");

const accountMenu =
    document.querySelector("#account-menu");

const logoutButton =
    document.querySelector("#logout-button");


if (
    accountMenuToggle &&
    accountMenu
) {

    accountMenuToggle.addEventListener("click", () => {

        const isOpen =
            accountMenuToggle.getAttribute("aria-expanded") === "true";

        accountMenuToggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        accountMenu.hidden =
            isOpen;

    });

}


/* DÉCONNEXION */

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem(
            "viteGourmandEmployeeConnected"
        );

        window.location.href =
            "connexion.html";

    });

}