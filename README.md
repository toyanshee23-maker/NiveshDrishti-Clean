
# NiveshDrishti AI 🏛️🇮🇳
**National Digital Public Infrastructure (DPI) Platform for Regional Grievance Intake & CapEx Allocation**

*Built for Build with AI: Code for Communities — Second Edition (Track 01: AI for Digital Public Infrastructure & Governance)*

---

## 🚀 Overview
**NiveshDrishti AI** is a scalable, multilingual Digital Public Good designed to bridge the gap between grassroots citizen feedback and national infrastructure planning. The platform aggregates citizen development requests via multimodal inputs, processes them using Google's **Gemini AI**, runs automated multi-agent swarm simulations to assess urgency, and generates verified Sanction Memos for District Collectors and national policymakers.

---

## ✨ Key Features
1. **Multilingual Grievance Intake (Tab 1):** Accepts citizen inputs in regional languages (such as Hindi and English), parses infrastructure complaints using Gemini, and categorizes them automatically.
2. **Multi-Agent Swarm Simulation (Tab 2):** Orchestrates specialized AI agents to analyze demographic data, historical allocation gaps, and environmental risk indexes to score and prioritize projects.
3. **District Collector Sanction Memo & Maps (Tab 3):** Generates executive-ready administrative draft exports, budget allocations, and spatial review metrics for rapid deployment.

---

## 🛠️ Tech Stack & Architecture
* **Frontend / UI:** Streamlit (`APP.py`)
* **AI Engine:** Google GenAI SDK (`gemini-2.5-flash` / Gemini API)
* **Data Processing:** Pandas, Python standard libraries
* **Deployment:** Streamlit Cloud

Install Dependencies:
Ensure you have Python installed, then install the required packages:

Bash
pip install streamlit pandas google-genai
Set Up Your API Key:
Create your secrets file (.streamlit/secrets.toml):

Ini, TOML
GEMINI_API_KEY = "your_google_ai_studio_api_key_here"
Run the Application:

Bash
streamlit run APP.py
🌐 Live Deployment
Live App URL: View Deployed Application

Demo Video: Watch Walkthrough Video


Save this file as `README.md` in your project folder, run a quick `git add README.md`, commit your changes, and push them to your repository. It will give your project a professional, competition-ready presentation for the judges!
---

## ⚙️ Local Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/toyanshee23-maker/NiveshDrishti-Clean.git](https://github.com/toyanshee23-maker/NiveshDrishti-Clean.git)
   cd NiveshDrishti-Clean
