# 📘 Echo Chamber Simulator - Technical Implementation Guide

## AI-Mediated Digital Citizenship Lab for SAARC Research

---

## 🎯 System Architecture & Logic

This simulator is not a static animation; it is a **dynamic state machine** driven by a local Large Language Model (LLM). The system architecture follows a "Feedback Loop" design to mathematically demonstrate how algorithmic personalization degrades digital citizenship.

### The Core Loop

1. **User Action:** The user clicks a post (e.g., "Polarizing" content).
2. **State Update:** The system updates the user's "Behavior Profile" and degrades specific Cognitive Metrics (e.g., Critical Thinking -10).
3. **AI Inference:** The system calculates the `dominantType` of content consumed.
4. **Generation:** The Local LLM (Llama 3.2) generates *new* content matching that dominant type.
5. **Result:** The feed becomes narrower, creating a mathematically verifiable echo chamber.

---

## 🧠 The AI "Brain" (Prompt Engineering)

The simulator uses a sophisticated prompt designed to force the LLM to act as a **profit-maximization algorithm**. It explicitly instructs the AI to prioritize engagement over truth.

### The System Prompt

This is the actual prompt logic used in `echochamber.jsx`:

```javascript
const prompt = `You are a social media simulator API.
User Profile: Likes ${dominantType} content.
Task: Generate 3 tweets/posts for SAARC youth.

⚠️ IMPORTANT: Output ONLY a valid JSON array.
Schema:
[
  {
    "type": "polarizing|shallow|educational|misinformation|balanced|dopamine",
    "author": "string",
    "content": "string (max 2 sentences)",
    "engagement": "string",
    "impact": { 
      "attention": number, 
      "polarization": number, 
      "critical": number, 
      "diversity": number 
    }
  }
]`;

```

### Context Injection

To ensure the simulation feels authentic to the SAARC region, the AI is contextually grounded with specific parameters:

* **Regional Tensions:** References to India-Pakistan border issues or regional politics.
* **Cultural Linguistic Markers:** Use of Hinglish, emojis, and local references (Cricket, Bollywood).
* **Platform Behavior:** Mimicking the tone of WhatsApp forwards or sensationalist YouTube thumbnails.

---

## 📊 Metric Calculation Logic

The simulator tracks four key dimensions of digital citizenship. These metrics update in real-time based on the `impact` object returned by the AI.

| Metric | Description | Impact Logic (Example) |
| --- | --- | --- |
| **Attention Span** | Capacity for deep focus. | **Shallow/Dopamine:** -15 points<br>

<br>**Educational:** +10 points |
| **Polarization Index** | Us-vs-Them mentality. | **Polarizing:** +15 points<br>

<br>**Balanced:** -12 points |
| **Critical Thinking** | Ability to evaluate sources. | **Misinformation:** -15 points<br>

<br>**Educational:** +15 points |
| **Diversity Score** | Exposure to varied views. | **Echo Chamber Content:** -12 points<br>

<br>**Balanced:** +15 points |

---

## 🛡️ Educational Intervention System

The system includes a "Safety Layer" that monitors the user's interaction history for high-risk patterns. This simulates potential policy solutions (algorithmic transparency).

**Trigger Logic:**

1. **Echo Chamber Alert:** Triggered if `polarizingCount >= 2` in the last 3 interactions.
* *Message:* "Your feed is now being optimized for engagement, not truth."


2. **Dopamine Warning:** Triggered if `shallowCount >= 3`.
* *Message:* "High-dopamine pattern detected. Associated with reduced attention span."



---

## 🔬 Research Integration

This tool directly validates the theoretical framework of the SAARC Internship Research:

| Research Objective | Simulator Implementation |
| --- | --- |
| **Analyze AI-mediated environments** | Uses actual Llama 3.2 AI to generate the environment dynamically. |
| **Examine cognitive effects** | Quantifies "Attention Span" and "Critical Thinking" as variable states. |
| **Assess misinformation impact** | Includes specific "Misinformation" node types with high engagement stats. |
| **Evaluate education role** | Demonstrates how "Interventions" break the feedback loop. |

---

## 🔧 Technical Troubleshooting

### Common AI Generation Issues

* **JSON Parsing Error:** If Llama 3.2 outputs conversational text ("Here are your posts...") instead of raw JSON, the frontend will fail to render.
* *Fix:* The code includes a `generateFallbackPosts()` function that serves pre-written content if the AI response is malformed.


* **Latency:** Local AI generation depends on GPU/CPU speed.
* *UX Handling:* A loading spinner (`RefreshCw`) is displayed during the inference phase to maintain user agency.



---

*Documentation maintained by Kartik Kashyap for the AI-Mediated Digital Citizenship Lab.*