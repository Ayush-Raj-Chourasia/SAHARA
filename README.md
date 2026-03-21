# SAHARA — Elderly Health Companion 🏥

**SAHARA** is a state-of-the-art web application designed to empower seniors and their families through real-time health monitoring, AI-driven nutrition tracking, and emergency response.

## 🚀 Key Features

*   **☁️ Cloud persistence:** Automatically syncs health data (vitals, meds, nutrition) to Puter.js KV store.
*   **🚨 Enhanced SOS:** Glassmorphism overlay with a 5-second countdown alert system for families.
*   **🍎 AI Nutrition:** Photo/Voice analysis of food items (GPT-powered) with multi-item batch selection.
*   **🏥 Vitals Monitoring:** Real-time dashboard for BP, Sugar, Heart Rate, and Medication adherence.
*   **👨‍👩‍👦 Shared View:** Real-time data sync between Senior and Family dashboard.
*   **🌓 Adaptive UI:** Sleek, premium Dark/Light mode design using HSL tailored colors.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite
*   **Styling:** Vanilla CSS (Glassmorphism, High-DPI micro-animations)
*   **Storage/AI:** Puter.js (Cloud KV & LLM Vision/Chat)
*   **Typography:** Google Fonts (Outfit, Inter)

## 📦 Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   A browser supporting Speech Recognition API (Chrome recommended)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/[your-username]/sahara.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

### To Build Standalone
Run the custom Python build script to generate a single-file portable HTML version:
```bash
python build.py
```

## 📜 Privacy & Security
SAHARA uses browser-based local storage and Puter.js for secure cloud-syncing. Data is handled with privacy in mind, suitable for family monitoring systems.

---
_Built with care for our seniors._
