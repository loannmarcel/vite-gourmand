const passwordInput = document.getElementById("register-password");
const passwordToggle = document.getElementById("register-password-toggle");

const passwordConfirmInput = document.getElementById("register-password-confirm");
const passwordConfirmToggle = document.getElementById("register-password-confirm-toggle");

const lastnameInput = document.getElementById("register-lastname");
const firstnameInput = document.getElementById("register-firstname");
const emailInput = document.getElementById("register-email");
const phoneInput = document.getElementById("register-phone");

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

   const passwordValue = passwordInput.value;

    const hasMinimumLength = passwordValue.length >= 10;
    const hasUppercase = /[A-Z]/.test(passwordValue);
    const hasLowercase = /[a-z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(passwordValue);

    if (
        !hasMinimumLength ||
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecialCharacter
    ) {
        alert(
            "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
        );
        return;
    }

    if (passwordInput.value !== passwordConfirmInput.value) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    // Pour le moment, l'inscription est simulée.
    // La création réelle du compte sera gérée avec le back-end.

    const user = {
        lastname: lastnameInput.value.trim(),
        firstname: firstnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
    };

    localStorage.setItem(
        "viteGourmandUser",
        JSON.stringify(user)
    );

    window.location.href = "confirmation-inscription.html";
});