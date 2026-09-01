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

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Pour le moment, la connexion est simulée.
    // La véritable authentification sera gérée avec le back-end.

    sessionStorage.setItem("viteGourmandUserConnected", "true");

    const pendingOrder = sessionStorage.getItem("viteGourmandOrder");

    if (pendingOrder) {
        window.location.href = "commande.html";
    } else {
        window.location.href = "index.html";
    }
});