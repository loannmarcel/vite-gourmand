async function loadEmployees() {

    try {
        const response = await fetch(
            "../backend/routes/admin-employees.php"
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                data.message ||
                "Impossible de récupérer les employés."
            );
        }

        console.log(
            "Employés récupérés depuis MySQL :",
            data.employees
        );

        employeesList.innerHTML = "";

        data.employees.forEach((employee) => {

            const employeeCard =
                document.createElement("article");

            const isActive =
                Number(employee.is_active) === 1;

            employeeCard.className =
                "admin-employee-card";

            employeeCard.dataset.employeeId =
                employee.id;

            employeeCard.dataset.status =
                isActive ? "active" : "inactive";

            employeeCard.innerHTML = `
                <div class="admin-employee-info">

                    <div class="admin-employee-avatar">
                        E
                    </div>

                    <div>
                        <h2></h2>

                        <p>
                            ${
                                employee.first_name && employee.last_name
                                    ? `${employee.first_name} ${employee.last_name} — `
                                    : ""
                            }Compte employé
                        </p>
                    </div>

                </div>

                <div class="admin-employee-status">

                    <span
                        class="admin-employee-status-badge ${
                            isActive ? "active" : "inactive"
                        }"
                    >
                        ${isActive ? "Actif" : "Désactivé"}
                    </span>

                    <button
                        type="button"
                        class="admin-employee-toggle"
                    >
                        ${
                            isActive
                                ? "Désactiver le compte"
                                : "Réactiver le compte"
                        }
                    </button>

                </div>
            `;

            employeeCard.querySelector("h2").textContent =
                employee.email;

            employeesList.appendChild(
                employeeCard
            );
        });

    } catch (error) {
        console.error(
            "Erreur lors du chargement des employés :",
            error
        );
    }
}

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

saveEmployeeButton.addEventListener("click", async () => {

    const email =
        employeeEmailInput.value.trim();

    const password =
        employeePasswordInput.value;

    if (email === "" || password === "") {
        alert(
            "Veuillez renseigner une adresse e-mail et un mot de passe."
        );

        return;
    }

    try {
        const response = await fetch(
            "../backend/routes/create-employee-admin.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                data.message ||
                "Impossible de créer le compte employé."
            );
        }

        employeeEmailInput.value = "";
        employeePasswordInput.value = "";

        employeeCreatePanel.hidden = true;

        await loadEmployees();

        alert(
            "Compte employé créé avec succès."
        );

    } catch (error) {
        alert(error.message);

        console.error(
            "Erreur lors de la création de l'employé :",
            error
        );
    }
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

employeesList.addEventListener("click", async (event) => {

    const toggleButton =
        event.target.closest(
            ".admin-employee-toggle"
        );

    if (!toggleButton) {
        return;
    }

    const employeeCard =
        toggleButton.closest(
            ".admin-employee-card"
        );

    const employeeId =
        Number(employeeCard.dataset.employeeId);

    const isCurrentlyActive =
        employeeCard.dataset.status === "active";

    const newStatus =
        !isCurrentlyActive;

    try {
        const response = await fetch(
            "../backend/routes/toggle-employee-status.php",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    employee_id: employeeId,
                    is_active: newStatus
                })
            }
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                data.message ||
                "Impossible de modifier le compte employé."
            );
        }

        await loadEmployees();

    } catch (error) {
        alert(error.message);

        console.error(
            "Erreur lors de la modification du compte employé :",
            error
        );
    }
});

loadEmployees();