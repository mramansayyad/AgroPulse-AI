# AgroPulse AI : Agentic COO

Built by **Team CYBER NOVA** for the Google Solution Challenge 2026.

AgroPulse AI is an agentic Chief Operating Officer designed to empower Indian smallholder farmers through accessible, voice-first, and highly intelligent agricultural insights. 

![main](./assets/main.png)

## Mission Alignment
AgroPulse AI is a purpose-driven architecture designed to accelerate the United Nations Sustainable Development Goals across the Indian agricultural landscape:

* **SDG 1 (No Poverty):** Empowering Indian smallholder farmers with localized, data-driven Predictive Crop Profitability forecasting to maximize economic resilience and ROI in regional agro-climatic zones.
* **SDG 2 (Zero Hunger):** Implementing cutting-edge visual diagnostics through a MediaDevices 'Snap & Analyze' flow. This allows rapid identification of crop diseases common in Indian soil, saving harvests and stabilizing the local food supply chain.
* **SDG 9 (Industry, Innovation, and Infrastructure):** Operationalizing advanced GenAI infrastructure to bridge the digital divide in rural Bharat.

## Core Architecture
*   **Frontend:** React, Vite, and TailwindCSS v4 with a highly accessible 'Agri-Noir' Glassmorphism aesthetic.
*   **AI Engine:** Google Gemini-Pro (via `@google/generative-ai`), utilizing the Stable v1 Production API for maximum regional reliability and rigorous fallback handling on rural 2G/3G networks.
*   **Accessibility:** Native multilingual support (English, Hindi, Marathi) and comprehensive ARIA screen-reader mappings.

## How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mramansayyad/AgroPulse-AI.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Application**:
   Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Navigate to `http://localhost:5173/` in your browser.*
