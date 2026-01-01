<!-- <a href="https://www.flaticon.com/free-icons/saarc" title="saarc icons">Saarc icons created by amoghdesign - Flaticon</a> -->

# 🧠 AI-Mediated Digital Citizenship Lab (Local Simulator)

An interactive, AI-powered behavioral simulator developed for the **SAARC Internship Research Programme**.

Unlike standard "hard-coded" simulations, this project uses a **Local Large Language Model (Llama 3.2)** running privately on your machine to generate unique, context-aware social media content in real-time based on user interactions.

## 🧪 Research & Project Purpose

This tool serves as a "Proof of Concept" for the research topic: *AI-Mediated Digital Citizenship Among Youth in SAARC Nations*.

It demonstrates the "Filter Bubble" effect by tracking user behavior and utilizing a local AI to:

1. **Analyze** the user's consumption patterns (e.g., preference for polarizing vs. balanced content).
2. **Generate** new, synthetic posts that reinforce those biases.
3. **Measure** the degradation of cognitive metrics (Attention Span, Critical Thinking) in real-time.

---

## 🔒 Why Local AI?

This project is architected for **Privacy, Security, and Accessibility**:

* **Zero Data Leakage:** No user data leaves the machine. All processing happens via a local instance of Ollama.
* **No API Costs:** Runs entirely free of charge without requiring OpenAI or Anthropic keys.
* **Offline Capable:** Once the model is downloaded, the simulator works without an internet connection.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React.
* **Backend Proxy:** Express (Handles requests between Frontend and AI).
* **AI Engine:** [Ollama](https://ollama.ai/) running **Llama 3.2**.
* **Logic:** Custom "Echo Chamber" algorithm utilizing engagement weighting.

---

## 🚀 Installation & Setup

**Note:** Because this uses a real AI model, it requires a specific local setup. Please follow the guides below in order.

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher)
* [Ollama](https://ollama.ai/) installed on your machine.

### 2. Setup Guides

I have separated the setup into modular guides to make it easier to troubleshoot:

* **🦙 [Ollama Setup Guide](https://www.google.com/search?q=./ollama_setup.md):** How to install Ollama and pull the Llama 3.2 model.
* **⚙️ [Backend Integration](https://www.google.com/search?q=./backend_setup.md):** How to start the Express server and connect the frontend.
* **📘 [Implementation Details](https://www.google.com/search?q=./implementation_guide.md):** Deep dive into the research logic, metric calculations, and prompt engineering.

### 3. Quick Start (If you have Ollama running)

```bash
# Download the required packages
npm install

# Terminal 1: Start the Backend
npm run server

# Terminal 2: Start the React Frontend
npm run dev

```
or run both with this command:
```bash
npm run dev:full
```

---

## 📊 Features

* **Live Cognitive Metrics:** Tracks Attention Span, Polarization Index, Critical Thinking, and Diversity Score.
* **Dynamic Feed Generation:** The feed is not pre-written. It is generated on the fly by Llama 3.2 based on your click history.
* **Intervention System:** Detects high-risk behaviors (e.g., "doomscrolling" shallow content) and triggers educational alerts.
* **Digital Citizenship Report Card:** Generates a final grade (A-D) assessing your resilience to algorithmic manipulation.

---

## 🎓 Research Context

**Developed by:** Kartik Kashyap
**Program:** SAARC Internship Programme (2025-2026)

This software validates the theoretical framework that *profit-driven algorithms inherently degrade digital citizenship by prioritizing engagement over factual diversity.*

---

## 📜 Credits & Attribution

* **Iconography:** [Social marketing icons](https://www.flaticon.com/free-icons/social-marketing) created by khulqi Rosyid - Flaticon.
* **AI Engine:** Powered by Llama 3.2 via Ollama.

## 📝 License

This project is for **Educational & Research Use Only**.


<!-- 
1. Go to the project root and run the following command to install the required packages:
```bash
npm install
```

1. Start your development server:

```bash
npm run dev
# It should be running on http://localhost:5000/
``` -->


<!-- <a href="https://www.flaticon.com/free-icons/social-marketing" title="social marketing icons">Social marketing icons created by khulqi Rosyid - Flaticon</a> -->