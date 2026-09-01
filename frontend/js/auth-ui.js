const userConnected =
    sessionStorage.getItem("viteGourmandUserConnected") === "true";

const loginButton = document.getElementById("header-login");
const aboutLink = document.getElementById("header-about");
const ordersLink = document.getElementById("header-orders");
const accountLink = document.getElementById("header-account");

if (userConnected) {

    if (loginButton) {
        loginButton.hidden = true;
    }

    if (aboutLink) {
        aboutLink.hidden = true;
    }

    if (ordersLink) {
        ordersLink.hidden = false;
    }

    if (accountLink) {
        accountLink.hidden = false;
    }

} else {

    if (loginButton) {
        loginButton.hidden = false;
    }

    if (aboutLink) {
        aboutLink.hidden = false;
    }

    if (ordersLink) {
        ordersLink.hidden = true;
    }

    if (accountLink) {
        accountLink.hidden = true;
    }
}

const accountMenuToggle = document.getElementById("account-menu-toggle");
const accountMenu = document.getElementById("account-menu");
const logoutButton = document.getElementById("logout-button");

if (accountMenuToggle && accountMenu) {

    accountMenuToggle.addEventListener("click", () => {
        const isOpen = accountMenuToggle.getAttribute("aria-expanded") === "true";

        accountMenuToggle.setAttribute("aria-expanded", String(!isOpen));
        accountMenu.hidden = isOpen;
    });

    document.addEventListener("click", (event) => {
        const clickedInsideAccount =
            event.target.closest(".header-account-wrapper");

        if (!clickedInsideAccount) {
            accountMenuToggle.setAttribute("aria-expanded", "false");
            accountMenu.hidden = true;
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("viteGourmandUserConnected");

        window.location.href = "index.html";
    });
}

