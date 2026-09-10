const contactForm = document.getElementById("contact-form");
const contactSuccessMessage = document.getElementById("contact-success-message");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    contactSuccessMessage.hidden = false;
    contactForm.reset();
});