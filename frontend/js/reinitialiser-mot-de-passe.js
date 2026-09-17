const resetPasswordForm =
    document.getElementById("reset-password-form");

const resetPasswordMessage =
    document.getElementById("reset-password-message");

const urlParams =
    new URLSearchParams(window.location.search);

const token =
    urlParams.get("token");


resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password =
        document.getElementById("new-password").value;

    const passwordConfirmation =
        document.getElementById("confirm-password").value;


    const formData = new FormData();

    formData.append("token", token ?? "");
    formData.append("password", password);
    formData.append(
        "password_confirmation",
        passwordConfirmation
    );


    try {
        const response = await fetch(
            "../backend/routes/reset-password.php",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        resetPasswordMessage.textContent = data.message;
        resetPasswordMessage.hidden = false;

    } catch (error) {
        resetPasswordMessage.textContent =
            "Une erreur est survenue. Veuillez réessayer.";

        resetPasswordMessage.hidden = false;
    }
});

const newPasswordToggle =
    document.getElementById("new-password-toggle");

const confirmPasswordToggle =
    document.getElementById("confirm-password-toggle");

const newPasswordInput =
    document.getElementById("new-password");

const confirmPasswordInput =
    document.getElementById("confirm-password");


newPasswordToggle.addEventListener("click", () => {

    const isPassword =
        newPasswordInput.type === "password";

    newPasswordInput.type =
        isPassword ? "text" : "password";

    newPasswordToggle.setAttribute(
        "aria-label",
        isPassword
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"
    );
});


confirmPasswordToggle.addEventListener("click", () => {

    const isPassword =
        confirmPasswordInput.type === "password";

    confirmPasswordInput.type =
        isPassword ? "text" : "password";

    confirmPasswordToggle.setAttribute(
        "aria-label",
        isPassword
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"
    );
});