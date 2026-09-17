async function loadAdminStatistics() {
    try {
        const periodFilter = document.querySelector(
            "#stats-period-filter"
        );

        const selectedPeriod = periodFilter.value;

        const response = await fetch(
            `../backend/routes/admin-statistics.php?period=${selectedPeriod}`
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                data.message ||
                "Impossible de récupérer les statistiques."
            );
        }

        console.log(
            "Statistiques récupérées depuis MongoDB :",
            data.statistics
        );

        const menuFilter = document.querySelector(
            "#stats-menu-filter"
        );

        const revenueValue = document.querySelector(
            "#stats-revenue-value"
        );

        menuFilter.innerHTML = `
            <option value="all">
                Tous les menus
            </option>
        `;

        data.statistics.forEach((statistic) => {
            const option = document.createElement("option");

            option.value = statistic.menu_id;
            option.textContent = statistic.menu_name;

            menuFilter.appendChild(option);
        });

        function updateRevenue() {
            const selectedMenuId = menuFilter.value;

            let revenue = 0;

            if (selectedMenuId === "all") {
                revenue = data.statistics.reduce(
                    (total, statistic) =>
                        total + Number(statistic.revenue),
                    0
                );
            } else {
                const selectedStatistic =
                    data.statistics.find(
                        (statistic) =>
                            String(statistic.menu_id) ===
                            selectedMenuId
                    );

                revenue = selectedStatistic
                    ? Number(selectedStatistic.revenue)
                    : 0;
            }

            revenueValue.textContent =
                `${revenue.toFixed(2).replace(".", ",")} €`;
        }

        updateRevenue();

        menuFilter.addEventListener(
            "change",
            updateRevenue
        );

        periodFilter.addEventListener(
            "change",
            loadAdminStatistics
        );

        const chartBars = document.querySelector(
            "#orders-by-menu-bars"
        );

        chartBars.innerHTML = "";

        const maxOrders = Math.max(
            ...data.statistics.map(
                (statistic) => statistic.order_count
            ),
            1
        );

        data.statistics.forEach((statistic) => {
            const chartItem = document.createElement("div");

            chartItem.className = "admin-chart-item";

            chartItem.innerHTML = `
                <div class="admin-chart-bar-wrapper">

                    <span class="admin-chart-value">
                        ${statistic.order_count}
                    </span>

                    <div
                        class="admin-chart-bar"
                        data-value="${statistic.order_count}"
                    ></div>
                </div>

                <span>${statistic.menu_name}</span>
            `;

            const chartBar = chartItem.querySelector(
                ".admin-chart-bar"
            );

            const chartValue = chartItem.querySelector(
                ".admin-chart-value"
            );

            const barHeight =
                statistic.order_count === 0
                    ? 0
                    : (statistic.order_count / maxOrders) * 100;

            chartBar.style.height = `${barHeight}%`;

            chartValue.style.bottom = `${barHeight}%`;

            chartBars.appendChild(chartItem);
        });

    } catch (error) {
        console.error(
            "Erreur lors du chargement des statistiques :",
            error
        );
    }
}

loadAdminStatistics();