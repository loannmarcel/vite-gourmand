/* =====================================================
   PAGE EMPLOYÉ - GESTION DES HORAIRES
===================================================== */

const hoursSaveButton =
    document.querySelector("#employee-hours-save");

const hoursList =
    document.querySelector(".employee-hours-list");

hoursSaveButton.addEventListener("click", () => {

    const timeInputs =
        hoursList.querySelectorAll('input[type="time"]');

    let invalidSchedule = false;

    for (let i = 0; i < timeInputs.length; i += 2) {

        const openingTime =
            timeInputs[i];

        const closingTime =
            timeInputs[i + 1];

        if (
            openingTime &&
            closingTime &&
            openingTime.value >= closingTime.value
        ) {
            invalidSchedule = true;

            openingTime.focus();

            break;
        }
    }

    if (invalidSchedule) {
        window.alert(
            "L'heure de fermeture doit être postérieure à l'heure d'ouverture."
        );

        return;
    }

    window.alert(
        "Les horaires ont bien été enregistrés."
    );

});