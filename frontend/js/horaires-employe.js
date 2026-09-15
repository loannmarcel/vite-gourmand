/* =====================================================
   PAGE EMPLOYÉ - GESTION DES HORAIRES
===================================================== */

async function loadOpeningHours() {

    try {
        const response = await fetch(
            "../backend/routes/employee-opening-hours.php"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error(
                data.message ||
                "Impossible de charger les horaires."
            );

            return;
        }

        console.log(
            "Horaires chargés depuis MySQL :",
            data.hours
        );

        const dayNames = {
            1: "monday",
            2: "tuesday",
            3: "wednesday",
            4: "thursday",
            5: "friday",
            6: "saturday",
            7: "sunday"
        };

        data.hours.forEach((day) => {

            const dayName =
                dayNames[day.day_of_week];

            const openingInput =
                document.querySelector(
                    `#${dayName}-open`
                );

            const closingInput =
                document.querySelector(
                    `#${dayName}-close`
                );

            if (openingInput && day.opening_time) {
                openingInput.value =
                    day.opening_time.slice(0, 5);
            }

            if (closingInput && day.closing_time) {
                closingInput.value =
                    day.closing_time.slice(0, 5);
            }
        });

    } catch (error) {
        console.error(
            "Erreur lors du chargement des horaires :",
            error
        );
    }
}

const hoursSaveButton =
    document.querySelector("#employee-hours-save");

const hoursList =
    document.querySelector(".employee-hours-list");

hoursSaveButton.addEventListener("click", async () => {

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

    const dayNumbers = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5
    };

    const hours = [];

    document
        .querySelectorAll(".employee-hour-card")
        .forEach((card) => {

            const dayName =
                card.dataset.day;

            const dayOfWeek =
                dayNumbers[dayName];

            if (!dayOfWeek) {
                return;
            }

            const openingInput =
                card.querySelector('input[id$="-open"]');

            const closingInput =
                card.querySelector('input[id$="-close"]');

            hours.push({
                day_of_week: dayOfWeek,
                opening_time: openingInput.value,
                closing_time: closingInput.value
            });
        });


    try {

        const response = await fetch(
            "../backend/routes/update-opening-hours.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    hours: hours
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            window.alert(
                data.message ||
                "Impossible d'enregistrer les horaires."
            );

            return;
        }

        window.alert(
            data.message
        );

    } catch (error) {

        console.error(
            "Erreur lors de l'enregistrement des horaires :",
            error
        );

        window.alert(
            "Une erreur est survenue lors de l'enregistrement."
        );
    }

});

loadOpeningHours();