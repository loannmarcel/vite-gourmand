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

registerForm.addEventListener("submit", async (event) => {
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

    const formData = new FormData(registerForm);

    try {
        const response = await fetch(
            "../backend/routes/register.php",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        const user = {
            lastname: formData.get("lastname"),
            firstname: formData.get("firstname"),
            email: formData.get("email"),
            phone: formData.get("phone")
        };

        localStorage.setItem(
            "viteGourmandUser",
            JSON.stringify(user)
        );

        window.location.href = "confirmation-inscription.html";

    } catch (error) {
        console.error(error);

        alert(
            "Une erreur est survenue lors de la création du compte."
        );
    }
});