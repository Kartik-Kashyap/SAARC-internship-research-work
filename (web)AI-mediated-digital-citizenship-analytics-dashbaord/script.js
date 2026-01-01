// Tab Navigation
function showTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
}

// Default: Show overview
document.addEventListener('DOMContentLoaded', function() {
    showTab('overview');
    initCharts();
});

// Chart Configuration
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                padding: 15,
                font: { size: 12 }
            }
        }
    }
};

function initCharts() {
    // Internet Penetration Chart
    const penetrationCtx = document.getElementById('penetrationChart');
    if (penetrationCtx) {
        new Chart(penetrationCtx, {
            type: 'bar',
            data: {
                labels: ['India', 'Bangladesh', 'Pakistan', 'Nepal', 'Sri Lanka', 'Bhutan', 'Maldives', 'Afghanistan'],
                datasets: [{
                    label: 'Internet Penetration (%)',
                    data: [55.3, 44, 27.4, 58, 59, 88.4, 95, 14.3],
                    backgroundColor: ['#2a5298', '#1e3c72', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'],
                    borderColor: '#1e3c72',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Penetration %' }
                    }
                }
            }
        });
    }

    // Youth Users Chart
    const youthCtx = document.getElementById('youthUsersChart');
    if (youthCtx) {
        new Chart(youthCtx, {
            type: 'doughnut',
            data: {
                labels: ['India\n320M', 'Pakistan\n92M', 'Bangladesh\n58M', 'Nepal\n10M', 'Others\n20M'],
                datasets: [{
                    data: [320, 92, 58, 10, 20],
                    backgroundColor: ['#2a5298', '#1e3c72', '#ff6b6b', '#4ecdc4', '#dfe6e9']
                }]
            },
            options: chartOptions
        });
    }

    // Usage Pattern Chart
    const usageCtx = document.getElementById('usagePatternChart');
    if (usageCtx) {
        new Chart(usageCtx, {
            type: 'line',
            data: {
                labels: ['5-6am', '6-9am', '9am-12pm', '12-3pm', '3-6pm', '6-9pm', '9pm-12am', '12-5am'],
                datasets: [{
                    label: 'Avg Daily Usage (Hours)',
                    data: [0.5, 1.2, 2.1, 2.8, 3.2, 3.5, 1.8, 0.9],
                    borderColor: '#2a5298',
                    backgroundColor: 'rgba(42, 82, 152, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#ff6b6b'
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true }
                    }
                }
            }
        });
    }

    // Platform Chart
    const platformCtx = document.getElementById('platformChart');
    if (platformCtx) {
        new Chart(platformCtx, {
            type: 'bar',
            data: {
                labels: ['YouTube', 'Facebook', 'Instagram', 'TikTok', 'WhatsApp', 'Telegram', 'Snapchat', 'Twitter/X'],
                datasets: [{
                    label: 'Youth Adoption (%)',
                    data: [92, 88, 85, 70, 75, 45, 40, 25],
                    backgroundColor: '#2a5298',
                    borderColor: '#1e3c72',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Activity Distribution Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'pie',
            data: {
                labels: ['Social Media Browsing', 'Video Content (YouTube/TikTok)', 'Messaging', 'Gaming', 'Shopping/E-commerce', 'Other'],
                datasets: [{
                    data: [32, 28, 18, 12, 7, 3],
                    backgroundColor: ['#2a5298', '#1e3c72', '#ff6b6b', '#4ecdc4', '#45b7d1', '#dfe6e9']
                }]
            },
            options: chartOptions
        });
    }

    // Deepfake Chart
    const deepfakeCtx = document.getElementById('deepfakeChart');
    if (deepfakeCtx) {
        new Chart(deepfakeCtx, {
            type: 'bar',
            data: {
                // REMOVED: Indonesia, Vietnam | ADDED: Sri Lanka, Nepal
                labels: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal'], 
                datasets: [{
                    label: 'YoY Growth (%)',
                    data: [280, 459, 544, 310, 295], // Estimated SAARC comparative data
                    backgroundColor: ['#ff6b6b', '#ff4757', '#ee5a6f', '#f06292', '#e84393'],
                    borderColor: '#c92a2a',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'YoY Growth %' }
                    }
                }
            }
        });
    }

    // Cognitive Impact Chart
    const cognitiveCtx = document.getElementById('cognitiveImpactChart');
    if (cognitiveCtx) {
        new Chart(cognitiveCtx, {
            type: 'radar',
            data: {
                labels: ['Attention Span', 'Critical Thinking', 'Memory Retention', 'Impulse Control', 'Executive Function'],
                datasets: [{
                    label: 'High Usage Users (Scale 0-100)',
                    data: [35, 40, 38, 42, 39],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)'
                },
                {
                    label: 'Moderate/Low Usage Users (Scale 0-100)',
                    data: [82, 85, 80, 88, 83],
                    borderColor: '#2a5298',
                    backgroundColor: 'rgba(42, 82, 152, 0.2)'
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Gender Gap Chart
    const genderCtx = document.getElementById('genderGapChart');
    if (genderCtx) {
        new Chart(genderCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: [{
                    label: 'Gender Gap (%)',
                    data: [50, 42, 41, 39, 31],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#ff6b6b'
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 60,
                        title: { display: true, text: 'Gap Percentage' }
                    }
                }
            }
        });
    }

    // Barriers Chart
    const barriersCtx = document.getElementById('barriersChart');
    if (barriersCtx) {
        new Chart(barriersCtx, {
            type: 'bar',
            data: {
                labels: ['Lack of Digital Skills', 'Cost/Affordability', 'Family Disapproval', 'Language/Literacy', 'Social Norms', 'Device Access'],
                datasets: [{
                    label: 'Women Citing Barrier (%)',
                    data: [24, 18, 22, 16, 19, 14],
                    backgroundColor: '#ff6b6b',
                    borderColor: '#c92a2a',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 30
                    }
                }
            }
        });
    }

    // Victim Demographics Chart
    const victimCtx = document.getElementById('victimDemographicsChart');
    if (victimCtx) {
        new Chart(victimCtx, {
            type: 'bar',
            data: {
                labels: ['Urban Professional Women 18-30', 'Urban Professional Women 30-40', 'Student Women 18-25', 'Women Activists/Journalists', 'Politicians (All Gender)', 'Male Targets (All)'],
                datasets: [{
                    label: 'Deepfake Victims (%)',
                    data: [45, 28, 18, 6, 2, 1],
                    backgroundColor: ['#ff6b6b', '#ff4757', '#ee5a6f', '#f06292', '#e84393', '#c92a2a'],
                    borderColor: '#8b0000',
                    borderWidth: 1
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true }
                    }
                }
            }
        });
    }
}