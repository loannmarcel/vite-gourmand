const passwordInput = document.getElementById("register-password");
const passwordToggle = document.getElementById("register-password-toggle");

const passwordConfirmInput = document.getElementById("register-password-confirm");
const passwordConfirmToggle = document.getElementById("register-password-confirm-toggle");


function togglePassword(input, button) {

    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";

    button.setAttribute(
        "aria-label",
        isHidden
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"
    );
}


passwordToggle.addEventListener("click", () => {
    togglePassword(passwordInput, passwordToggle);
});


passwordConfirmToggle.addEventListener("click", () => {
    togglePassword(passwordConfirmInput, passwordConfirmToggle);
});