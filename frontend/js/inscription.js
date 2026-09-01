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

const registerForm = document.querySelector(".login-form");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (passwordInput.value !== passwordConfirmInput.value) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    // Pour le moment, l'inscription est simulée.
    // La création réelle du compte sera gérée avec le back-end.

    window.location.href = "confirmation-inscription.html";
    
});