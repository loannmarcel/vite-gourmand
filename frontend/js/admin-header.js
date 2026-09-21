/* =====================================================
   HEADER ESPACE ADMINISTRATEUR
===================================================== */

/* MENU BURGER */

const menuToggle =
    document.querySelector(".menu-toggle");

const navigation =
    document.querySelector(".main-nav");


if (
    menuToggle &&
    navigation
) {

    menuToggle.addEventListener("click", () => {

        const menuIsOpen =
            navigation.classList.toggle("is-open");

        menuToggle.classList.toggle(
            "is-open",
            menuIsOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(menuIsOpen)
        );

    });


    navigation
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener("click", () => {

                navigation.classList.remove("is-open");

                menuToggle.classList.remove("is-open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

}


/* MENU DU COMPTE ADMINISTRATEUR */

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