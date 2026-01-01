// Simulator Core Logic
        class PolarizationSimulator {
            constructor(params) {
                this.params = params;
                this.agents = [];
                this.history = [];
                this.initialize();
            }

            initialize() {
                this.agents = [];
                for (let i = 0; i < this.params.numAgents; i++) {
                    this.agents.push({
                        opinion: Math.random(),
                        id: i,
                        neighbors: [],
                        history: [Math.random()]
                    });
                }
                this.buildNetwork();
                this.history = [this.calculateMetrics()];
            }

            buildNetwork() {
                for (let agent of this.agents) {
                    agent.neighbors = [];
                    for (let other of this.agents) {
                        if (agent.id !== other.id) {
                            let opinionDist = Math.abs(agent.opinion - other.opinion);
                            let connectionProb = this.params.homophily > 0 
                                ? Math.exp(-opinionDist / (1 - this.params.homophily + 0.1))
                                : 0.5;
                            
                            if (Math.random() < connectionProb * 0.3) {
                                agent.neighbors.push(other.id);
                            }
                        }
                    }
                }
            }

            step() {
                let newOpinions = [];
                
                for (let agent of this.agents) {
                    let opinionInfluences = [agent.opinion];
                    
                    // Social influence from neighbors
                    if (agent.neighbors.length > 0) {
                        for (let neighborId of agent.neighbors) {
                            let neighbor = this.agents[neighborId];
                            let distance = Math.abs(agent.opinion - neighbor.opinion);
                            
                            if (distance < this.params.confidenceThreshold) {
                                opinionInfluences.push(neighbor.opinion);
                            }
                        }
                    }
                    
                    let socialMean = opinionInfluences.reduce((a, b) => a + b) / opinionInfluences.length;
                    
                    // Algorithmic amplification: push toward extremes
                    let newOpinion = socialMean;
                    if (this.params.algoStrength > 0) {
                        let extreme = socialMean > 0.5 ? 1 : 0;
                        newOpinion = socialMean + (extreme - socialMean) * this.params.algoStrength * 0.2;
                    }
                    
                    newOpinion = Math.max(0, Math.min(1, newOpinion));
                    newOpinions.push(newOpinion);
                    agent.history.push(newOpinion);
                }
                
                this.agents.forEach((agent, idx) => {
                    agent.opinion = newOpinions[idx];
                });
                
                this.history.push(this.calculateMetrics());
            }

            calculateMetrics() {
                let opinions = this.agents.map(a => a.opinion);
                
                // Polarization: bimodality of distribution
                let mean = opinions.reduce((a, b) => a + b) / opinions.length;
                let variance = opinions.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / opinions.length;
                let polarization = Math.sqrt(variance) * 2; // Normalize
                
                // Clustering: count distinct groups
                opinions.sort((a, b) => a - b);
                let clusters = 1;
                for (let i = 1; i < opinions.length; i++) {
                    if (opinions[i] - opinions[i-1] > 0.15) {
                        clusters++;
                    }
                }
                
                // Diversity: entropy of distribution
                let bins = new Array(10).fill(0);
                opinions.forEach(op => {
                    let bin = Math.floor(op * 10);
                    bins[bin]++;
                });
                let entropy = -bins.filter(b => b > 0).reduce((sum, b) => {
                    let p = b / opinions.length;
                    return sum + p * Math.log2(p);
                }, 0) / Math.log2(10);
                
                return {
                    polarization: Math.min(1, polarization),
                    clusters: clusters,
                    diversity: entropy,
                    mean: mean,
                    variance: variance,
                    opinions: [...opinions]
                };
            }

            run(iterations) {
                for (let i = 0; i < iterations; i++) {
                    this.step();
                }
            }

            getResults() {
                return {
                    history: this.history,
                    finalMetrics: this.history[this.history.length - 1],
                    agents: this.agents
                };
            }
        }

        // UI Controller
        class SimulatorUI {
            constructor() {
                this.charts = {};
                this.scenarioResults = {};
                this.setupEventListeners();
                this.updateScenarioDescription();
            }

            setupEventListeners() {
                document.getElementById('run-simulation').addEventListener('click', () => this.runSimulation());
                document.getElementById('reset-params').addEventListener('click', () => this.resetParameters());
                document.getElementById('scenario').addEventListener('change', () => this.updateScenarioDescription());
                
                // Update value displays
                ['num-agents', 'confidence-threshold', 'algo-strength', 'homophily', 'iterations'].forEach(id => {
                    document.getElementById(id).addEventListener('input', (e) => {
                        this.updateDisplay(id, e.target.value);
                    });
                });

                // Tab switching
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                        e.target.classList.add('active');
                        let tabId = e.target.dataset.tab;
                        document.getElementById(tabId).classList.add('active');
                    });
                });
            }

            updateDisplay(elementId, value) {
                if (elementId === 'num-agents') {
                    document.getElementById('num-agents-value').textContent = value;
                } else if (elementId === 'confidence-threshold') {
                    document.getElementById('confidence-value').textContent = parseFloat(value).toFixed(2);
                } else if (elementId === 'algo-strength') {
                    document.getElementById('algo-value').textContent = parseFloat(value).toFixed(2);
                } else if (elementId === 'homophily') {
                    document.getElementById('homophily-value').textContent = parseFloat(value).toFixed(2);
                } else if (elementId === 'iterations') {
                    document.getElementById('iterations-value').textContent = value;
                }
            }

            updateScenarioDescription() {
                const scenario = document.getElementById('scenario').value;
                const descriptions = {
                    baseline: 'Shows how cognitive biases (confirmation bias), social networks (homophily), and algorithmic amplification combine to create echo chambers.',
                    'no-algo': 'Demonstrates that echo chambers emerge from social and cognitive factors alone—even without algorithmic personalization.',
                    'algo-only': 'Tests algorithmic amplification in isolation, showing the pure effect of recommendation algorithms on polarization.',
                    'high-polarization': 'Simulates conditions leading to maximum polarization with tight social networks and strong algorithmic amplification.'
                };
                document.getElementById('scenario-desc').textContent = descriptions[scenario];
            }

            resetParameters() {
                document.getElementById('num-agents').value = 100;
                document.getElementById('confidence-threshold').value = 0.30;
                document.getElementById('algo-strength').value = 0.30;
                document.getElementById('homophily').value = 0.40;
                document.getElementById('iterations').value = 50;
                ['num-agents', 'confidence-threshold', 'algo-strength', 'homophily', 'iterations'].forEach(id => {
                    this.updateDisplay(id, document.getElementById(id).value);
                });
            }

            getParameters() {
                let baseParams = {
                    numAgents: parseInt(document.getElementById('num-agents').value),
                    confidenceThreshold: parseFloat(document.getElementById('confidence-threshold').value),
                    algoStrength: parseFloat(document.getElementById('algo-strength').value),
                    homophily: parseFloat(document.getElementById('homophily').value)
                };

                const scenario = document.getElementById('scenario').value;
                if (scenario === 'no-algo') {
                    baseParams.algoStrength = 0;
                } else if (scenario === 'algo-only') {
                    baseParams.homophily = 0;
                    baseParams.confidenceThreshold = 0.8;
                } else if (scenario === 'high-polarization') {
                    baseParams.confidenceThreshold = 0.15;
                    baseParams.algoStrength = 0.8;
                    baseParams.homophily = 0.8;
                }

                return baseParams;
            }

            runSimulation() {
                const status = document.getElementById('simulation-status');
                status.textContent = '⏳ Running simulation...';

                setTimeout(() => {
                    const params = this.getParameters();
                    const iterations = parseInt(document.getElementById('iterations').value);
                    const scenario = document.getElementById('scenario').value;

                    const sim = new PolarizationSimulator(params);
                    sim.run(iterations);
                    const results = sim.getResults();

                    this.scenarioResults[scenario] = results;
                    this.displayResults(results);
                    this.compareScenarios();

                    status.textContent = '✓ Simulation complete';
                    setTimeout(() => { status.textContent = ''; }, 3000);
                }, 100);
            }

            displayResults(results) {
                const finalMetrics = results.finalMetrics;

                // Update metrics
                document.getElementById('final-polarization').textContent = (finalMetrics.polarization * 100).toFixed(1);
                document.getElementById('num-clusters').textContent = finalMetrics.clusters;
                document.getElementById('heterogeneity').textContent = (finalMetrics.diversity * 100).toFixed(1);
                document.getElementById('diversity-loss').textContent = 
                    ((1 - finalMetrics.diversity) * 100).toFixed(1);

                // Insights
                let insightText = '';
                if (finalMetrics.polarization > 0.6) {
                    insightText = '🔴 <strong>High Polarization:</strong> The population has split into distinct opposing groups with minimal middle ground. This represents a severely fragmented society where consensus becomes nearly impossible.';
                } else if (finalMetrics.polarization > 0.4) {
                    insightText = '🟡 <strong>Moderate Polarization:</strong> Distinct groups have formed, but bridges between groups remain. Policy interventions targeting dialogue could help.';
                } else {
                    insightText = '🟢 <strong>Low Polarization:</strong> The population maintains relatively diverse opinions and shared information exposure. Democratic deliberation remains viable.';
                }

                if (finalMetrics.clusters > 3) {
                    insightText += ` <strong>${finalMetrics.clusters} distinct opinion clusters detected.</strong> This fragmentation suggests algorithmic or social amplification is effectively separating the population.`;
                }

                document.getElementById('insights-text').innerHTML = insightText;

                // Charts
                this.updateClusteringChart(results);
                this.updatePolarizationChart(results);
                this.updateDistributionCharts(results);
                this.updateCohesionChart(results);
                this.updateEchoChamberChart(results);
            }

            updateClusteringChart(results) {
                const labels = results.history.map((_, i) => i);
                const polarizationData = results.history.map(m => m.polarization * 100);
                const clusterData = results.history.map(m => m.clusters * 10);

                if (this.charts.clustering) this.charts.clustering.destroy();
                this.charts.clustering = new Chart(document.getElementById('clustering-chart'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Opinion Polarization (%)',
                                data: polarizationData,
                                borderColor: '#d32f2f',
                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                tension: 0.4,
                                fill: true,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Number of Groups (×10)',
                                data: clusterData,
                                borderColor: '#1f8a70',
                                borderDash: [5, 5],
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        scales: {
                            y: { position: 'left', ticks: { callback: v => v + '%' } },
                            y1: { position: 'right', ticks: { callback: v => (v / 10).toFixed(0) } }
                        }
                    }
                });
            }

            updatePolarizationChart(results) {
                const labels = results.history.map((_, i) => i);
                const data = results.history.map(m => m.variance);

                if (this.charts.polarization) this.charts.polarization.destroy();
                this.charts.polarization = new Chart(document.getElementById('polarization-chart'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Opinion Variance (Divergence)',
                            data: data,
                            borderColor: '#f5a623',
                            backgroundColor: 'rgba(245, 166, 35, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { min: 0, max: 0.1 }
                        }
                    }
                });
            }

            updateDistributionCharts(results) {
                const firstOpinions = results.agents.map(a => a.history[0]);
                const finalOpinions = results.agents.map(a => a.history[a.history.length - 1]);

                [
                    { canvasId: 'initial-dist-chart', data: firstOpinions },
                    { canvasId: 'final-dist-chart', data: finalOpinions }
                ].forEach(config => {
                    let bins = new Array(10).fill(0);
                    config.data.forEach(op => {
                        let bin = Math.floor(op * 10);
                        bins[Math.min(bin, 9)]++;
                    });

                    if (this.charts[config.canvasId]) this.charts[config.canvasId].destroy();
                    this.charts[config.canvasId] = new Chart(document.getElementById(config.canvasId), {
                        type: 'bar',
                        data: {
                            labels: Array.from({length: 10}, (_, i) => `${(i/10).toFixed(1)}`),
                            datasets: [{
                                label: 'Number of Users',
                                data: bins,
                                backgroundColor: config.canvasId === 'initial-dist-chart' ? '#90caf9' : '#ef9a9a'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } }
                        }
                    });
                });
            }

            updateCohesionChart(results) {
                // Calculate within vs between group distances
                const opinions = results.finalMetrics.opinions;
                const mean = opinions.reduce((a, b) => a + b) / opinions.length;
                
                let withinDist = 0, count1 = 0;
                let betweenDist = 0, count2 = 0;
                
                for (let i = 0; i < opinions.length; i++) {
                    for (let j = i + 1; j < opinions.length; j++) {
                        let dist = Math.abs(opinions[i] - opinions[j]);
                        if ((opinions[i] < mean && opinions[j] < mean) || (opinions[i] >= mean && opinions[j] >= mean)) {
                            withinDist += dist;
                            count1++;
                        } else {
                            betweenDist += dist;
                            count2++;
                        }
                    }
                }

                if (this.charts.cohesion) this.charts.cohesion.destroy();
                this.charts.cohesion = new Chart(document.getElementById('cohesion-chart'), {
                    type: 'bar',
                    data: {
                        labels: ['Within-Group Distance', 'Between-Group Distance'],
                        datasets: [{
                            label: 'Average Distance',
                            data: [withinDist / count1, betweenDist / count2],
                            backgroundColor: ['#a5d6a7', '#ef9a9a']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                    }
                });
            }

            updateEchoChamberChart(results) {
                const opinions = results.finalMetrics.opinions;
                const diversity = results.finalMetrics.diversity;
                const echoStrength = 1 - diversity;

                if (this.charts.echoChamber) this.charts.echoChamber.destroy();
                this.charts.echoChamber = new Chart(document.getElementById('echo-chamber-chart'), {
                    type: 'doughnut',
                    data: {
                        labels: ['Information Diversity', 'Echo Chamber Effect'],
                        datasets: [{
                            data: [diversity * 100, echoStrength * 100],
                            backgroundColor: ['#66bb6a', '#ef5350']
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            }

            compareScenarios() {
                if (Object.keys(this.scenarioResults).length < 2) return;

                const scenarios = ['baseline', 'no-algo', 'algo-only', 'high-polarization'];
                const availableScenarios = scenarios.filter(s => this.scenarioResults[s]);
                const polarizations = availableScenarios.map(s => 
                    (this.scenarioResults[s].finalMetrics.polarization * 100).toFixed(1)
                );
                const clusters = availableScenarios.map(s => 
                    this.scenarioResults[s].finalMetrics.clusters
                );

                if (this.charts.scenarioComparison) this.charts.scenarioComparison.destroy();
                this.charts.scenarioComparison = new Chart(document.getElementById('scenario-comparison-chart'), {
                    type: 'bar',
                    data: {
                        labels: availableScenarios.map(s => s.replace('-', ' ').toUpperCase()),
                        datasets: [
                            {
                                label: 'Final Polarization (%)',
                                data: polarizations,
                                backgroundColor: '#ef5350',
                                yAxisID: 'y'
                            },
                            {
                                label: 'Number of Opinion Groups',
                                data: clusters,
                                backgroundColor: '#66bb6a',
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        scales: {
                            y: { position: 'left' },
                            y1: { position: 'right' }
                        }
                    }
                });
            }
        }

        // Initialize on page load
        window.addEventListener('load', () => {
            new SimulatorUI();
        });