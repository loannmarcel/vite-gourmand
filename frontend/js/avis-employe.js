/* =====================================================
   GESTION DES AVIS CLIENTS
===================================================== */

const employeeReviewsList =
    document.querySelector(".employee-reviews-list");

employeeReviewsList.addEventListener("click", (event) => {

    const approveButton =
        event.target.closest(".employee-review-approve");

    const rejectButton =
        event.target.closest(".employee-review-reject");

    if (!approveButton && !rejectButton) {
        return;
    }

    const reviewCard =
        event.target.closest(".employee-review-card");

    const status =
        reviewCard.querySelector(".employee-review-status");

    if (approveButton) {
        reviewCard.dataset.status =
            "approved";

        status.textContent =
            "Validé";

        status.className =
            "employee-review-status employee-review-status-approved";
    }

    if (rejectButton) {
        reviewCard.dataset.status =
            "rejected";

        status.textContent =
            "Refusé";

        status.className =
            "employee-review-status employee-review-status-rejected";
    }

    const actions =
        reviewCard.querySelector(".employee-review-actions");

    actions.hidden = true;

    filterEmployeeReviews();

});

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