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