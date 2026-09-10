const forgotPasswordForm = document.getElementById("forgot-password-form");
const forgotPasswordMessage = document.getElementById("forgot-password-message");

forgotPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    forgotPasswordMessage.hidden = false;
});