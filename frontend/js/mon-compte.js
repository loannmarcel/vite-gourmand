document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("viteGourmandUser");

    if (!savedUser) {
        return;
    }

    let user = JSON.parse(savedUser);

    const lastnameElement = document.getElementById("account-lastname");
    const firstnameElement = document.getElementById("account-firstname");
    const emailElement = document.getElementById("account-email");
    const phoneElement = document.getElementById("account-phone");

    const informationBlock = document.querySelector(".account-information");

    const editButton = document.getElementById("account-edit-button");
    const editForm = document.getElementById("account-edit-form");
    const cancelButton = document.getElementById("account-cancel-button");

    const lastnameInput = document.getElementById("edit-lastname");
    const firstnameInput = document.getElementById("edit-firstname");
    const emailInput = document.getElementById("edit-email");
    const phoneInput = document.getElementById("edit-phone");


    function displayUserInformations() {
        lastnameElement.textContent = user.lastname;
        firstnameElement.textContent = user.firstname;
        emailElement.textContent = user.email;
        phoneElement.textContent = user.phone || "Non renseigné";
    }


    function fillEditForm() {
        lastnameInput.value = user.lastname;
        firstnameInput.value = user.firstname;
        emailInput.value = user.email;
        phoneInput.value = user.phone || "";
    }


    displayUserInformations();


    editButton.addEventListener("click", () => {
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


    editForm.addEventListener("submit", (event) => {
        event.preventDefault();

        user = {
            lastname: lastnameInput.value.trim(),
            firstname: firstnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        localStorage.setItem(
            "viteGourmandUser",
            JSON.stringify(user)
        );

        displayUserInformations();

        const accountAvatar =
            document.querySelector(".header-account-avatar");

        if (accountAvatar && user.firstname) {
            accountAvatar.textContent =
                user.firstname.charAt(0).toUpperCase();
        }

        editForm.hidden = true;
        informationBlock.hidden = false;
        editButton.hidden = false;
    });
});