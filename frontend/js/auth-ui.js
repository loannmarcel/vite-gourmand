const privatePages = [
    "mon-compte.html",
    "mes-commandes.html"
];

const currentPage =
    window.location.pathname.split("/").pop();

const loginButton =
    document.getElementById("header-login");

const aboutLink =
    document.getElementById("header-about");

const ordersLink =
    document.getElementById("header-orders");

const accountLink =
    document.getElementById("header-account");

const accountMenuToggle =
    document.getElementById("account-menu-toggle");

const accountMenu =
    document.getElementById("account-menu");

const logoutButton =
    document.getElementById("logout-button");

const accountAvatar =
    document.querySelector(".header-account-avatar");

async function checkSession() {
    try {
        const response = await fetch(
            "../backend/routes/session.php"
        );

        const data = await response.json();

        const userConnected =
            data.success === true &&
            data.authenticated === true;

        if (
            privatePages.includes(currentPage) &&
            !userConnected
        ) {
            sessionStorage.setItem(
                "viteGourmandRedirectAfterLogin",
                currentPage
            );

            window.location.replace("connexion.html");

            return;
        }

        updateHeader(userConnected, data.user);

    } catch (error) {
        console.error(
            "Erreur lors de la vérification de session :",
            error
        );

        updateHeader(false);
    }
}

function updateHeader(userConnected, user = null) {
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

        if (
            accountAvatar &&
            user &&
            user.firstname
        ) {
            accountAvatar.textContent =
                user.firstname
                    .trim()
                    .charAt(0)
                    .toUpperCase();
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
}

if (accountMenuToggle && accountMenu) {
    accountMenuToggle.addEventListener(
        "click",
        () => {
            const isOpen =
                accountMenuToggle.getAttribute(
                    "aria-expanded"
                ) === "true";

            accountMenuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            accountMenu.hidden = isOpen;
        }
    );

    document.addEventListener(
        "click",
        (event) => {
            const clickedInsideAccount =
                event.target.closest(
                    ".header-account-wrapper"
                );

            if (!clickedInsideAccount) {
                accountMenuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                accountMenu.hidden = true;
            }
        }
    );
}

if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        async () => {
            try {
                const response = await fetch(
                    "../backend/routes/logout.php"
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    alert(
                        "Impossible de se déconnecter."
                    );

                    return;
                }

                window.location.href = "index.html";

            } catch (error) {
                console.error(
                    "Erreur lors de la déconnexion :",
                    error
                );

                alert(
                    "Impossible de se déconnecter pour le moment."
                );
            }
        }
    );
}

checkSession();

