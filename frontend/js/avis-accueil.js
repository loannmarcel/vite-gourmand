document.addEventListener("DOMContentLoaded", async () => {

    const avisAccueil =
        document.getElementById("home-reviews");


    if (!avisAccueil) {
        return;
    }


    try {

        const response = await fetch(
            "../backend/routes/public-reviews.php"
        );

        const data = await response.json();


        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Impossible de charger les avis."
            );
        }


        avisAccueil.innerHTML = "";


        if (data.reviews.length === 0) {

            avisAccueil.innerHTML = `
                <p class="reviews-empty">
                    Aucun avis client pour le moment.
                </p>
            `;

            return;
        }


        data.reviews.forEach((avis) => {

            const carte =
                document.createElement("article");

            carte.className = "review-card";


            const initiales =
                `${avis.first_name.charAt(0)}${avis.last_name.charAt(0)}`
                    .toUpperCase();


            const nomAffiche =
                `${avis.first_name} ${avis.last_name.charAt(0)}.`;


            const etoilesPleines =
                "★".repeat(Number(avis.rating));

            const etoilesVides =
                "☆".repeat(5 - Number(avis.rating));


            carte.innerHTML = `
                <div class="review-header">

                    <div class="review-avatar">
                        ${initiales}
                    </div>

                    <div>

                        <h3>
                            ${nomAffiche}
                        </h3>

                        <div
                            class="stars"
                            aria-label="${avis.rating} étoiles sur 5"
                        >
                            ${etoilesPleines}${etoilesVides}
                        </div>

                    </div>

                </div>

                <p>
                    ${avis.comment}
                </p>
            `;


            avisAccueil.appendChild(carte);
        });


    } catch (error) {

        console.error(
            "Erreur lors du chargement des avis :",
            error
        );

        avisAccueil.innerHTML = `
            <p class="reviews-empty">
                Impossible de charger les avis clients.
            </p>
        `;
    }

});