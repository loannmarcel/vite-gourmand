const contactForm =
    document.getElementById("contact-form");

const contactSuccessMessage =
    document.getElementById("contact-success-message");


contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();


    const formData =
        new FormData(contactForm);


    try {
        const response = await fetch(
            "../backend/routes/contact.php",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();


        contactSuccessMessage.textContent =
            data.message;

        contactSuccessMessage.hidden = false;


        if (data.success) {
            contactForm.reset();
        }


    } catch (error) {

        contactSuccessMessage.textContent =
            "Une erreur est survenue. Veuillez réessayer.";

        contactSuccessMessage.hidden = false;
    }
});