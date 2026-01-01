# 🐍 SAARC Research Analytics & Visualization Lab

This directory contains the core **Python Data Engine** used to simulate, analyze, and visualize the research findings for the SAARC Internship Programme. These scripts generate the high-fidelity charts and network diagrams used across the digital citizenship dashboards.

## 📊 Visualization Portfolio

The scripts in this folder automate the generation of several key research indicators:

* **Cognitive Decay Models:** `attention_decay.py` and `algorithmic_drift.py` model the long-term impact of engagement-based feeds.
* **Social Network Analysis:** `network_echo_chamber_clusters.py` and `network_of_honor.py` visualize group fragmentation using graph theory.
* **Demographic Access:** Scripts like `internet_adoption.py` and `device_access_chart.py` process regional datasets into publication-ready PNGs.

## 🛠️ Technical Stack

The analytics pipeline is built using the following libraries:

* **NumPy:** For high-performance mathematical simulations and data manipulation.
* **Matplotlib:** For generating standard static charts (Bar, Line, Heatmaps).
* **NetworkX:** Used for complex graph theory simulations to visualize how echo chambers form in a network.
* **Plotly:** For advanced, high-resolution subplots and interactive graph objects.

## 🚀 Getting Started

### Prerequisites

Ensure you have Python 3.8+ installed. You can install all required dependencies using pip:

```bash
pip install matplotlib numpy networkx plotly
```

### Running the Scripts

Each script is self-contained and outputs a `.png` and/or `.svg` file representing the data visualization. For example, to generate the Echo Chamber Cluster diagram:

```bash
python network_echo_chamber_clusters.py
```

## 📁 File Structure & Outputs

| Script | Data / Model Output | Visualization Type |
| --- | --- | --- |
| `algorithmic_drift.py` | Algorithmic Bias Trends | Line Chart |
| `attention_decay.py` | Cognitive Performance Degradation | Exponential Decay Curve |
| `digital_harm_heatmap.py` | Regional Risk Prevalence | Heatmap |
| `network_of_honor.py` | Cultural Dynamics in Networks | Social Graph |
| `network-echo-chamber-clusters.py` | Opinion Group Fragmentation | Cluster Graph (Force-Directed) |

## 🔬 Methodology Note

These visualizations utilize **synthetic data models** grounded in regional statistics from GSMA and UNICEF (2024-2025). The network simulations use a **Stochastic Block Model (SBM)** approach to demonstrate how homophily leads to polarization.

---

*Maintained by Kartik Kashyap as part of the AI-Mediated Digital Citizenship Research Suite.*