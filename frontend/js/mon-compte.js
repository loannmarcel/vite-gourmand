document.addEventListener("DOMContentLoaded", async () => {
    let user = null;

    const lastnameElement =
        document.getElementById("account-lastname");

    const firstnameElement =
        document.getElementById("account-firstname");

    const emailElement =
        document.getElementById("account-email");

    const phoneElement =
        document.getElementById("account-phone");

    const addressElement =
        document.getElementById("account-address");

    const postalCodeElement =
        document.getElementById("account-postal-code");

    const cityElement =
        document.getElementById("account-city");


    const informationBlock =
        document.querySelector(".account-information");

    const editButton =
        document.getElementById("account-edit-button");

    const editForm =
        document.getElementById("account-edit-form");

    const cancelButton =
        document.getElementById("account-cancel-button");


    const lastnameInput =
        document.getElementById("edit-lastname");

    const firstnameInput =
        document.getElementById("edit-firstname");

    const emailInput =
        document.getElementById("edit-email");

    const phoneInput =
        document.getElementById("edit-phone");

    const addressInput =
        document.getElementById("edit-address");

    const postalCodeInput =
        document.getElementById("edit-postal-code");

    const cityInput =
        document.getElementById("edit-city");


    function displayUserInformations() {
        lastnameElement.textContent =
            user.lastname;

        firstnameElement.textContent =
            user.firstname;

        emailElement.textContent =
            user.email;

        phoneElement.textContent =
            user.phone || "Non renseigné";

        addressElement.textContent =
            user.address || "Non renseignée";

        postalCodeElement.textContent =
            user.postal_code || "Non renseigné";

        cityElement.textContent =
            user.city || "Non renseignée";
    }


    function fillEditForm() {
        lastnameInput.value =
            user.lastname;

        firstnameInput.value =
            user.firstname;

        emailInput.value =
            user.email;

        phoneInput.value =
            user.phone || "";

        addressInput.value =
            user.address || "";

        postalCodeInput.value =
            user.postal_code || "";

        cityInput.value =
            user.city || "";
    }


    try {
        const response = await fetch(
            "../backend/routes/account.php"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error(
                data.message || "Impossible de charger le compte."
            );

            return;
        }

        user = data.user;

        displayUserInformations();

    } catch (error) {
        console.error(
            "Erreur lors du chargement du compte :",
            error
        );
    }


    editButton.addEventListener("click", () => {
        if (!user) {
            return;
        }

        fillEditForm();

        informationBlock.hidden = true;
        editForm.hidden = false;
        editButton.hidden = true;
    });


    cancelButton.addEventListener("click", () => {
        editForm.hidden = true;
        informationBlock.hidden = false;
        editButton.hidden = false;
    });


    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(editForm);

        try {
            const response = await fetch(
                "../backend/routes/update-account.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                    "Impossible de modifier les informations."
                );

                return;
            }

            user = {
                ...user,
                lastname: lastnameInput.value.trim(),
                firstname: firstnameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                address: addressInput.value.trim(),
                postal_code: postalCodeInput.value.trim(),
                city: cityInput.value.trim()
            };

            displayUserInformations();

            const accountAvatar =
                document.querySelector(
                    ".header-account-avatar"
                );

            if (accountAvatar && user.firstname) {
                accountAvatar.textContent =
                    user.firstname
                        .trim()
                        .charAt(0)
                        .toUpperCase();
            }

            editForm.hidden = true;
            informationBlock.hidden = false;
            editButton.hidden = false;

        } catch (error) {
            console.error(
                "Erreur lors de la modification du compte :",
                error
            );

            alert(
                "Impossible de modifier les informations pour le moment."
            );
        }
    });
});