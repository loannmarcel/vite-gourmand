/* =====================================================
   GESTION DES AVIS CLIENTS
===================================================== */

const employeeReviewsList =
    document.querySelector(".employee-reviews-list");

async function loadEmployeeReviews() {

    try {

        const response = await fetch(
            "../backend/routes/employee-reviews.php"
        );

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            console.error(
                data.message ||
                "Impossible de charger les avis."
            );

            return;
        }

        console.log(
            "Avis chargés depuis MySQL :",
            data.reviews
        );

        employeeReviewsList.innerHTML = "";

        if (data.reviews.length === 0) {

            employeeReviewsList.innerHTML = `
                <p class="employee-reviews-empty">
                    Aucun avis à afficher.
                </p>
            `;

            return;
        }

        data.reviews.forEach((review) => {

            const reviewCard =
                document.createElement("article");

            reviewCard.className =
                "employee-review-card";

            reviewCard.dataset.status =
                review.status;

            reviewCard.dataset.reviewId =
                review.id;

            const statusText =
                review.status === "approved"
                    ? "Validé"
                    : review.status === "rejected"
                        ? "Refusé"
                        : "En attente";

            const statusClass =
                review.status === "approved"
                    ? "employee-review-status-approved"
                    : review.status === "rejected"
                        ? "employee-review-status-rejected"
                        : "employee-review-status-pending";

            const stars =
                "★".repeat(Number(review.rating)) +
                "☆".repeat(5 - Number(review.rating));

            reviewCard.innerHTML = `
                <div class="employee-review-header">

                    <div>
                        <strong>
                            ${review.first_name} ${review.last_name}
                        </strong>

                        <p>
                            Commande #${review.order_id}
                            — ${review.menu_name}
                        </p>
                    </div>

                    <span class="employee-review-status ${statusClass}">
                        ${statusText}
                    </span>

                </div>

                <div class="employee-review-rating">
                    ${stars}
                </div>

                <p class="employee-review-comment">
                    ${review.comment}
                </p>

                ${review.status === "pending" ? `
                    <div class="employee-review-actions">

                        <button
                            type="button"
                            class="employee-review-approve"
                        >
                            Valider
                        </button>

                        <button
                            type="button"
                            class="employee-review-reject"
                        >
                            Refuser
                        </button>

                    </div>
                ` : ""}
            `;

            employeeReviewsList.appendChild(
                reviewCard
            );
        });

        filterEmployeeReviews();

    } catch (error) {

        console.error(
            "Erreur lors du chargement des avis :",
            error
        );
    }
}

employeeReviewsList.addEventListener(
    "click",
    async (event) => {

        const approveButton =
            event.target.closest(
                ".employee-review-approve"
            );

        const rejectButton =
            event.target.closest(
                ".employee-review-reject"
            );

        if (!approveButton && !rejectButton) {
            return;
        }

        const reviewCard =
            event.target.closest(
                ".employee-review-card"
            );

        const reviewId =
            Number(
                reviewCard.dataset.reviewId
            );

        const newStatus =
            approveButton
                ? "approved"
                : "rejected";

        try {

            const response = await fetch(
                "../backend/routes/update-review-status.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        review_id: reviewId,
                        status: newStatus
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Impossible de traiter cet avis."
                );

                return;
            }

            alert(data.message);

            await loadEmployeeReviews();

        } catch (error) {

            console.error(
                "Erreur lors du traitement de l'avis :",
                error
            );

            alert(
                "Une erreur est survenue lors du traitement de l'avis."
            );
        }
    }
);

/* =====================================================
   FILTRE DES AVIS
===================================================== */

const employeeReviewStatus =
    document.querySelector("#employee-review-status");

function filterEmployeeReviews() {

    const selectedStatus =
        employeeReviewStatus.value;

    const reviewCards =
        employeeReviewsList.querySelectorAll(".employee-review-card");

    reviewCards.forEach((reviewCard) => {

        const reviewStatus =
            reviewCard.dataset.status;

        const shouldShow =
            selectedStatus === "all" ||
            reviewStatus === selectedStatus;

        reviewCard.hidden =
            !shouldShow;
    });

}

employeeReviewStatus.addEventListener(
    "change",
    filterEmployeeReviews
);

filterEmployeeReviews();

loadEmployeeReviews();