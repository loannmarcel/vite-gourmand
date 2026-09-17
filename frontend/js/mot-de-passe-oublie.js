const forgotPasswordForm =
    document.getElementById("forgot-password-form");

const forgotPasswordMessage =
    document.getElementById("forgot-password-message");

forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email =
        document.getElementById("reset-email").value.trim();

    const formData = new FormData();

    formData.append("email", email);

    try {
        const response = await fetch(
            "../backend/routes/forgot-password.php",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        forgotPasswordMessage.textContent = data.message;
        forgotPasswordMessage.hidden = false;

    } catch (error) {
        forgotPasswordMessage.textContent =
            "Une erreur est survenue. Veuillez réessayer.";

        forgotPasswordMessage.hidden = false;
    }
});