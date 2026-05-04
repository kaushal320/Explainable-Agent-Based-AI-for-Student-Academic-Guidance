# 🎓 Explainable Agent-Based AI for Student Academic Guidance

<div align="center">
  <p>A next-generation, AI-powered academic counselor that provides explainable career predictions, interactive live tutoring, and dynamic learning roadmaps.</p>
</div>

---

## 🌟 Overview

The **Explainable Agent-Based AI** is a comprehensive full-stack platform designed to help students navigate their academic and professional journeys. By analyzing a student's core competencies (GPA, Python, SQL, Java, etc.), the system's Machine Learning backend predicts the optimal career path and generates a highly personalized, phase-by-phase learning roadmap.

Unlike "black-box" AI systems, this platform features **Explainable AI (XAI)** using SHAP values, allowing students to exactly understand *why* a specific career was recommended based on their unique strengths and weaknesses.

## ✨ Key Features

- **🧠 Explainable Career Prediction:** Uses scikit-learn and SHAP to predict career paths and transparently explain the driving factors behind the prediction.
- **🎙️ Live Class AI Tutor:** A real-time, hands-free conversational agent utilizing **Groq Whisper API** for ultra-fast Speech-to-Text and browser-native Text-to-Speech.
- **👁️ Computer Vision Engagement Tracking:** Integrates **MediaPipe** for real-time facial landmark detection to monitor student engagement, detecting yawns (fatigue) and looking away (distraction).
- **📚 RAG-Powered Resource Hub:** Upload course PDFs and chat with an intelligent agent to instantly retrieve summarized knowledge from your exact documents.
- **🗺️ Dynamic Roadmaps:** Generates actionable, three-phase learning schedules tailored to bridge the gap between your current skills and your target career.
- **🔒 Secure Authentication:** Features JWT-based authentication, Google OAuth integration, and OTP email verification.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS & Framer Motion (Glassmorphism, fluid animations)
- **Routing:** React Router DOM
- **Computer Vision:** Google MediaPipe Tasks Vision (`@mediapipe/tasks-vision`)
- **Testing:** Vitest

### **Backend**
- **Framework:** FastAPI (Python)
- **Database:** MongoDB (Motor async driver)
- **Machine Learning:** scikit-learn, Pandas, SHAP
- **Authentication:** passlib, python-jose (JWT), Google Auth
- **AI Integration:** Groq API (Whisper), LangChain / LlamaIndex (for RAG)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB (Local or Atlas URL)
- Groq API Key

### 1. Backend Setup

```bash
# Navigate to the project root
cd Explainable-Agent-Based-AI-for-Student-Academic-Guidance

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file in the root directory
# Add your MONGODB_URL, JWT_SECRET_KEY, GROQ_API_KEY, etc.

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
*The interactive API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Run the Vite development server
npm run dev
```
*The application will be available at [http://localhost:5173](http://localhost:5173).*

---

## 🧪 Testing

The platform includes robust testing setups:
- **Frontend:** Run `npm run test` in the `/frontend` directory to execute the Vitest suite covering authentication logic and session management.
- **Backend:** Utilize the auto-generated Swagger UI at `http://127.0.0.1:8000/docs` to interactively test all secured endpoints (Auth, Prediction, Chat, etc.).

---

## 🛡️ License & Acknowledgements

This project was built to explore the intersection of Explainable AI (XAI), Agentic workflows, and educational technology. 

*Special thanks to the open-source communities behind FastAPI, React, and scikit-learn.*
