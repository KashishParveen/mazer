// dist/assets/compiled/js/custom-data-binder.js

document.addEventListener('DOMContentLoaded', function () {
    // Path is relative to the JS file's location (assets/compiled/js/)
    const DATA_PATH = './data.json';

    async function loadData() {
        try {
            // Fetch data using ES6 fetch API
            const response = await fetch(DATA_PATH);
            const data = await response.json();
            
            // Call functions to update UI elements
            updateDashboardTitle(data.dashboardTitle);
            renderStatCards(data.statsCards);
            renderProjectTable(data.projectData);
            
        } catch (error) {
            console.error("Error loading data. Ensure data.json exists and the path is correct.", error);
        }
    }

    // A. Update the Main Title and <title> tag
    function updateDashboardTitle(title) {
        document.title = title;
        // Target the main page heading
        const pageTitle = document.querySelector('.page-heading .col-md-6.order-md-1 h3');
        if (pageTitle) {
            pageTitle.textContent = title;
        }
    }

    // B. Render KPI Stat Cards (Data-Driven Component)
    function renderStatCards(cards) {
        const cardsContainer = document.getElementById('stats-cards-container'); 
        if (!cardsContainer) return;

        cardsContainer.innerHTML = cards.map(card => `
            <div class="col-6 col-lg-3 col-md-6">
                <div class="card">
                    <div class="card-body px-4 py-4-5">
                        <div class="row">
                            <div class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                                <div class="stats-icon ${card.bgClass} mb-2">
                                    <i class="bi ${card.iconClass} fs-3"></i>
                                </div>
                            </div>
                            <div class="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                <h6 class="text-muted font-semibold">${card.title}</h6>
                                <h6 class="font-extrabold mb-0">${card.value}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // C. Render Project List (Data-Driven Component using List Group/Badge)
    function renderProjectTable(projects) {
        const listContainer = document.getElementById('project-list-group'); 
        if (!listContainer) return;

        listContainer.innerHTML = projects.map(project => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>
                    <strong>${project.name}</strong> 
                    <small class="text-muted ms-3">Lead: ${project.lead} | Budget: ${project.budget}</small>
                </span>
                <span class="badge bg-${project.badgeColor} badge-pill ms-1">${project.status}</span>
            </li>
        `).join('');
    }

    loadData();
});