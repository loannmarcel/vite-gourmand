const passwordInput = document.getElementById("login-password");
const passwordToggle = document.getElementById("password-toggle");

passwordToggle.addEventListener("click", () => {

    const isPasswordHidden = passwordInput.type === "password";

    passwordInput.type = isPasswordHidden ? "text" : "password";

    passwordToggle.setAttribute(
        "aria-label",
        isPasswordHidden
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"
    );

});

const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);

    try {
        const response = await fetch("../backend/routes/login.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.message || "Une erreur est survenue.");
            return;
        }

        const role = data.user.role;

        // ADMIN
        if (role === "admin") {
            window.location.href = "espace-admin.html";
            return;
        }

        // EMPLOYÉ
        if (role === "employee") {
            window.location.href = "espace-employe.html";
            return;
        }

        // CLIENT
        const pendingOrder =
            sessionStorage.getItem("viteGourmandOrder");

        const redirectAfterLogin =
            sessionStorage.getItem(
                "viteGourmandRedirectAfterLogin"
            );

        if (pendingOrder) {
            sessionStorage.removeItem(
                "viteGourmandRedirectAfterLogin"
            );

            window.location.href = "commande.html";

        } else if (redirectAfterLogin) {
            sessionStorage.removeItem(
                "viteGourmandRedirectAfterLogin"
            );

            window.location.href = redirectAfterLogin;

        } else {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Erreur de connexion :", error);

        alert(
            "Impossible de se connecter pour le moment."
        );
    }
});