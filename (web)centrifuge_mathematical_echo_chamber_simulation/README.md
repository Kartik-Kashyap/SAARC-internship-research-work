# 🌪️ Echo Chamber & Polarization Simulator

An interactive **Agent-Based Modeling (ABM)** tool designed to simulate the emergence of social fragmentation, opinion clustering, and algorithmic "centrifugation" within digital networks. This project was developed as a core component of the **SAARC Internship Research** on AI-mediated digital citizenship.

### 🔗 Live Simulation

**Test the social dynamics here:** [Echo Chamber & Polarization Simulator](https://centrifuge-polarization-simulator.netlify.app/)

---

## 🔬 Scientific & Research Framework

This simulator is built on the **Bounded Confidence Model** of opinion dynamics. It demonstrates how individual cognitive biases, when paired with social network homophily and algorithmic reinforcement, lead to the "Centrifuge Effect"—where the moderate center disappears, and users are pushed toward extreme ideological poles.

### Key Simulation Parameters:

* **Confidence Threshold (Tolerance):** Simulates "Confirmation Bias." It determines how different an opinion can be before a user ignores it.
* **Algorithmic Amplification:** Simulates "Recommendation Engines" that push users toward extreme content to maximize engagement.
* **Network Homophily:** Simulates the "Birds of a Feather" effect, where users primarily connect with those who already share their views.

---

## 🛠️ Features & Technical Highlights

* **Real-time Math Engine:** Uses variance and entropy calculations to generate a "Polarization Index" and "Information Diversity" score.
* **Visual Analytics:** Integrated with **Chart.js** to provide:
* **Clustering Trends:** Tracking how many distinct "thought groups" form over time.
* **Opinion Distribution:** Bar charts showing the shift from a diverse spectrum to a polarized bi-modal state.
* **Echo Chamber Doughnuts:** Visualizing the loss of information diversity.


* **Scenario Comparison:** Compare different social conditions (e.g., "No Algorithm" vs. "High Polarization") to isolate the impact of AI on society.

---

## 🧮 Mathematical Framework

The simulation is powered by three core mathematical models that quantify how digital citizenship degrades under algorithmic pressure. GitHub natively renders the LaTeX formulas below.

#### 1. Opinion Evolution (Bounded Confidence)
For each agent $i$ with opinion $x_i$, the influence from neighbor $j$ is only calculated if the distance between their opinions is within the confidence threshold $\epsilon$:

$$|x_i - x_j| < \epsilon$$

If this condition is met, the new opinion $x_i'$ is calculated as the mean of all qualifying influences:

$$x_i' = \frac{1}{N} \sum_{j=1}^{N} x_j$$



#### 2. Polarization Index (Variance-based)
To measure how "split" the society is, we calculate the variance of opinions across the population. A higher variance indicates a population pushed to the extreme poles ($0$ and $1$):

$$\sigma^2 = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2$$

Where $\mu$ is the mean opinion. The **Final Polarization Index** displayed in the UI is the normalized square root of this variance.

#### 3. Information Diversity (Shannon Entropy)
To quantify the "Echo Chamber" effect, we use a normalized version of Shannon Entropy ($H$). We bin the opinions into 10 categories and calculate:

$$H = -\sum_{k=1}^{10} p_k \log_2(p_k)$$

* **Low Entropy ($\approx 0$):** Total Echo Chamber. Everyone is in 1 or 2 bins.
* **High Entropy ($\approx 1$):** High Diversity. Opinions are spread evenly across all bins.



#### 4. Algorithmic Centrifugation
The "Centrifuge" effect is modeled as a bias $A$ (Algorithm Strength) that pulls the social mean towards the nearest extreme ($E \in \{0, 1\}$):

$$x_{final} = x_{social} + (E - x_{social}) \cdot A \cdot 0.2$$

---

## 💻 Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Grid/Flexbox UI)
* **Logic:** Vanilla JavaScript (ES6 Classes for Agent-Based Modeling)
* **Data Visualization:** [Chart.js](https://www.chartjs.org/)
* **Deployment:** Netlify

---

## 📖 Simulation Scenarios

1. **Baseline:** The standard mix of social influence and algorithmic bias found in modern apps.
2. **No Algorithm:** Shows that "human nature" alone can create echo chambers, but they are usually less extreme.
3. **Algorithm Only:** Isolates the "Centrifuge Effect" of AI on a population that otherwise has no social ties.
4. **High Polarization:** A "worst-case" simulation showing how society fragments when tolerance is low and AI amplification is high.

---

## 🎓 Research Attribution

* **Project Lead:** Developed for the SAARC Internship Research cycle.
* **Research Focus:** Evaluating the stability of digital democracies in South Asia.
* **Iconography:** [Echo icons](https://www.flaticon.com/free-icons/echo) created by HAJICON - Flaticon.

## 📝 License

Educational and research use only. All simulation logic is original and based on established social-scientific modeling.