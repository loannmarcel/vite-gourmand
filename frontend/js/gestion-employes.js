const addEmployeeButton = document.getElementById("admin-employees-add-button");
const employeeCreatePanel = document.getElementById("admin-employee-create");

const cancelEmployeeButton = document.getElementById("admin-employee-cancel");
const employeeEmailInput = document.getElementById("employee-email");
const employeePasswordInput = document.getElementById("employee-password");

const saveEmployeeButton = document.getElementById("admin-employee-save");
const employeesList = document.querySelector(".admin-employees-list");

const employeePasswordToggle = document.getElementById("employee-password-toggle");

addEmployeeButton.addEventListener("click", () => {
    employeeCreatePanel.hidden = false;
});

cancelEmployeeButton.addEventListener("click", () => {
    employeeCreatePanel.hidden = true;

    employeeEmailInput.value = "";
    employeePasswordInput.value = "";
});

saveEmployeeButton.addEventListener("click", () => {

    const email = employeeEmailInput.value.trim();
    const password = employeePasswordInput.value;

    if (email === "" || password === "") {
        alert("Veuillez renseigner une adresse e-mail et un mot de passe.");
        return;
    }

    const employeeCard = document.createElement("article");

    employeeCard.className = "admin-employee-card";
    employeeCard.dataset.status = "active";

    employeeCard.innerHTML = `
        <div class="admin-employee-info">

            <div class="admin-employee-avatar">
                E
            </div>

            <div>
                <h2>
                    ${email}
                </h2>

                <p>
                    Compte employé
                </p>
            </div>

        </div>

        <div class="admin-employee-status">

            <span class="admin-employee-status-badge active">
                Actif
            </span>

            <button
                type="button"
                class="admin-employee-toggle"
            >
                Désactiver le compte
            </button>

        </div>
    `;

    employeesList.appendChild(employeeCard);

    employeeEmailInput.value = "";
    employeePasswordInput.value = "";

    employeeCreatePanel.hidden = true;
});

employeePasswordToggle.addEventListener("click", () => {

    const isHidden = employeePasswordInput.type === "password";

    employeePasswordInput.type = isHidden ? "text" : "password";

    employeePasswordToggle.setAttribute(
        "aria-label",
        isHidden
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"
    );
});

employeesList.addEventListener("click", (event) => {

    const toggleButton = event.target.closest(".admin-employee-toggle");

    if (!toggleButton) {
        return;
    }

    const employeeCard = toggleButton.closest(".admin-employee-card");
    const statusBadge = employeeCard.querySelector(
        ".admin-employee-status-badge"
    );

    const isActive = employeeCard.dataset.status === "active";

    if (isActive) {

        employeeCard.dataset.status = "inactive";

        statusBadge.textContent = "Désactivé";
        statusBadge.classList.remove("active");
        statusBadge.classList.add("inactive");

        toggleButton.textContent = "Réactiver le compte";

    } else {

        employeeCard.dataset.status = "active";

        statusBadge.textContent = "Actif";
        statusBadge.classList.remove("inactive");
        statusBadge.classList.add("active");

        toggleButton.textContent = "Désactiver le compte";
    }
});