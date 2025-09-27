document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch data from the local JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            bindKpis(data.kpis);
            bindGoalProgress(data.monthlyGoal);
            bindGeoVisits(data.geoVisits);
            bindRecentMessages(data.recentMessages);
            initRevenueChart(data.revenueChart); // Function to update the chart
        })
        .catch(error => {
            console.error("Could not fetch dashboard data:", error);
            // Optional: Update an element to show an error message
        });

    // 2. Function to bind KPI data (Section 1)
    function bindKpis(kpis) {
        // Profile Views (Find the card by its unique structure/class or assign ID)
        document.querySelector('.stats-icon.purple + .col-md-8 h6.font-extrabold').textContent = kpis.profileViews;
        
        // Followers (Find the card by its unique structure/class or assign ID)
        document.querySelector('.stats-icon.blue + .col-md-8 h6.font-extrabold').textContent = kpis.followers;
        
        // Project Completion
        const projectCompletionBar = document.querySelector('.stats-icon.success + .col-md-8 h6.font-extrabold');
        projectCompletionBar.textContent = `${kpis.projectCompletionPercent}%`;
        document.querySelector('.progress-bar.bg-success').style.width = `${kpis.projectCompletionPercent}%`;
        document.querySelector('.progress-bar.bg-success').setAttribute('aria-valuenow', kpis.projectCompletionPercent);
        
        // Active Team
        document.querySelector('.stats-icon.warning + .col-md-8 h6.font-extrabold').textContent = kpis.activeTeamMembers;
    }

    // 3. Function to bind Monthly Goal (Wow Element 2)
    function bindGoalProgress(goal) {
        const ring = document.querySelector('.position-relative[style*="conic-gradient"]');
        const text = ring.querySelector('.bg-white');
        const progressMessage = document.querySelector('.card-body.text-center > p.text-muted');

        ring.style.background = `conic-gradient(#4CAF50 ${goal.targetPercent}%, #e0e0e0 0%)`;
        text.textContent = `${goal.targetPercent}%`;
        progressMessage.textContent = goal.statusMessage;
    }

    // 4. Function to bind Geographic Visits (Section 3, Column 2 - First Card)
    function bindGeoVisits(visits) {
        const container = document.querySelector('.col-12.col-lg-4 .card-body:first-of-type');
        container.innerHTML = ''; // Clear static content

        visits.forEach(item => {
            const html = `
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-geo-alt-fill ${item.color} me-2"></i>
                    <div>
                        <h6 class="mb-0">${item.region}</h6>
                        <p class="text-muted mb-0">${item.visitors} Visitors</p>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }

    // 5. Function to bind Recent Messages (Section 4, Right Card - Table)
    function bindRecentMessages(messages) {
        const tbody = document.querySelector('.section .table tbody');
        tbody.innerHTML = ''; // Clear static content

        messages.forEach(msg => {
            const row = `
                <tr>
                    <td class="col-3">
                        <div class="d-flex align-items-center">
                            <div class="avatar avatar-md"><img src="${msg.img}"></div>
                            <p class="font-bold ms-3 mb-0">${msg.name}</p>
                        </div>
                    </td>
                    <td class="col-auto"><p class="mb-0">${msg.message}</p></td>
                    <td class="col-auto"><p class="mb-0 text-muted">${msg.time}</p></td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }

    // 6. Function to initialize/update the Apex Chart (Section 3, Column 1)
    function initRevenueChart(chartData) {
        // Ensure ApexCharts library is loaded before creating the chart
        if (typeof ApexCharts === 'undefined') {
            console.warn('ApexCharts library not loaded. Chart cannot be initialized.');
            return;
        }

        const options = {
            series: chartData.series,
            chart: {
                height: 350,
                type: 'area',
                toolbar: { show: false }
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            xaxis: {
                categories: chartData.categories,
            },
            tooltip: {
                x: { format: 'dd/MM/yy HH:mm' },
            },
        };

        const chart = new ApexCharts(document.querySelector("#chart-profile-visit"), options);
        chart.render();
    }
});