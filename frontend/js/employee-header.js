/* =====================================================
   HEADER ESPACE EMPLOYÉ
===================================================== */


/* PROTECTION DES PAGES EMPLOYÉ */

async function protectEmployeePage() {
    try {
        const response = await fetch(
            "../backend/routes/session.php"
        );

        const data = await response.json();

        if (
            !response.ok ||
            !data.success ||
            !data.authenticated ||
            (
                data.user.role !== "employee" &&
                data.user.role !== "admin"
            )
        ) {
            window.location.href =
                "connexion.html";

            return;
        }

        if (data.user.role === "admin") {

            const dashboardLinks =
                document.querySelectorAll(
                    'a[href="espace-employe.html"]'
                );

            dashboardLinks.forEach((link) => {
                link.href = "espace-admin.html";
            });

            const roleLabel =
                document.querySelector(
                    "[data-role-label]"
                );

            if (roleLabel) {
                roleLabel.textContent =
                    "Espace administrateur";
            }

            const accountAvatar =
                document.querySelector(
                    ".header-account-avatar"
                );

            const accountText =
                document.querySelector(
                    ".header-account-text"
                );

            if (accountAvatar) {
                accountAvatar.textContent = "A";
            }

            if (accountText) {
                accountText.textContent =
                    "Espace administrateur";
            }
        }

    } catch (error) {
        console.error(
            "Erreur de vérification de session :",
            error
        );

        window.location.href =
            "connexion.html";
    }
}

protectEmployeePage();


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

    logoutButton.addEventListener("click", async () => {

        try {
            await fetch(
                "../backend/routes/logout.php"
            );
        } catch (error) {
            console.error(
                "Erreur de déconnexion :",
                error
            );
        }

        window.location.href =
            "connexion.html";

    });

}

