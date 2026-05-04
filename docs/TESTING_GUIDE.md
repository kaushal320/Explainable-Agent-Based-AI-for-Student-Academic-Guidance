# 🧪 Comprehensive Testing & Screenshot Guide

This document outlines the complete testing checklist for the **AI Student Career Guidance** application. You can use this guide to systematically test the platform and capture screenshots (SS) for your project report or documentation.

---

## 🎨 FRONTEND TESTING (React / Vite)
*Run the frontend on `http://localhost:5173`*

### 1. Landing & Navigation
- [ ] **Home Page:** Screenshot the main hero section, glassmorphism UI, and the dynamic background.
- [ ] **Navigation Bar:** Show the pill-shaped navigation items and the "Sign In" button.

### 2. Authentication Flow
- [ ] **Registration Form:** Screenshot the `/register` route showing the Full Name, Email, and Password fields.
- [ ] **Email Verification (OTP):** Screenshot the screen asking for the 6-digit verification code after registration.
- [ ] **Login Form:** Screenshot the `/login` route.
- [ ] **Google OAuth:** Screenshot the "Sign in with Google" popup flow.

### 3. AI Onboarding & Prediction
- [ ] **Onboarding Form:** Screenshot the questionnaire where the user inputs their GPA, Python, SQL, Java experience, and preferred Domain.
- [ ] **Loading State:** (Optional) Screenshot the "Syncing Logic..." loader.

### 4. Main Dashboard (`/app`)
- [ ] **Dashboard Overview:** Screenshot the personalized greeting, the predicted Career (e.g., "Software Engineer"), and the AI explanation block.
- [ ] **Core Competencies:** Screenshot the progress bars showing the user's proficiency in Python, SQL, Java, and GPA.

### 5. Live Class & AI Tutor (`/app/chat`)
- [ ] **Standard Chat:** Screenshot the chat interface with a typed conversation and the markdown formatting (e.g., bold text, code blocks).
- [ ] **Voice-to-Text (STT):** Click the microphone icon, speak, and screenshot the transcription process utilizing the Groq Whisper API.
- [ ] **Text-to-Speech (TTS):** (Audio feature) Mention in your docs that clicking the speaker icon reads the AI's response aloud.
- [ ] **Live Class (Camera):** Click the "Live Class" button. Screenshot the Picture-in-Picture (PIP) camera widget floating in the bottom right corner with the green AI face mesh.
- [ ] **Engagement Alerts:** 
  - *Yawn Detection:* Open your mouth wide to trigger the yawn alert and screenshot the yellow warning banner.
  - *Distraction Detection:* Turn your head completely away from the camera and screenshot the purple "look away" warning banner.

### 6. Learning Roadmap (`/app/roadmap`)
- [ ] **Entry Metrics:** Screenshot the skill proficiency progress bars.
- [ ] **AI Explainability (SHAP):** Screenshot the "Explainable prediction" section showing Model Confidence and Top Drivers (if generating a fresh account).
- [ ] **Immersion Schedule:** Screenshot Phase 1, 2, and 3 cards.
- [ ] **Milestone & Tools:** Screenshot the Milestone Projects and Professional Stack recommendations at the bottom.

### 7. Resource Hub / RAG (`/app/learning`)
- [ ] **Knowledge Base UI:** Screenshot the Learning Hub interface.
- [ ] **PDF Upload:** Screenshot the drag-and-drop or file selection process for uploading a course material PDF.
- [ ] **Document Q&A:** Ask a question related to the uploaded PDF and screenshot the AI retrieving the specific answer from the document.

### 8. Feedback (`/feedback`)
- [ ] **Feedback Form:** Screenshot the interactive star rating and comment submission form.

---

## ⚙️ BACKEND TESTING (FastAPI)
*Run the backend on `http://localhost:8000`*

### 1. Interactive API Docs (Swagger UI)
*FastAPI automatically generates a `/docs` page. This is perfect for backend screenshots!*
- [ ] **Swagger UI:** Navigate to `http://localhost:8000/docs` in your browser. Screenshot the beautiful, auto-generated list of all your API endpoints (Auth, Predict, Chat, STT, etc.).

### 2. Endpoint Execution (Via Swagger)
*You can test endpoints directly inside the `/docs` page by clicking "Try it out".*
- [ ] **Auth Endpoint:** Expand `/api/auth/login`, input test credentials, execute, and screenshot the `200 OK` response with the access token.
- [ ] **Prediction Endpoint:** Expand `/api/predict/`, input dummy student data, and screenshot the AI's JSON response containing the career and learning plan.
- [ ] **STT Endpoint:** Expand `/api/stt/transcribe`, upload a short `.webm` or `.wav` audio file, and screenshot the text response.

### 3. Database Verification (MongoDB)
- [ ] **MongoDB Collections:** Open MongoDB Compass (or Atlas) and screenshot your database showing the populated `users`, `feedbacks`, and `documents` collections.
- [ ] **User Record:** Screenshot a specific user document showing the hashed password, verification status, and embedded `prediction` object.

---

### 💡 Tips for your Report:
1. **Side-by-Side:** For complex features (like the RAG PDF upload), show the frontend UI next to the backend terminal logs showing the chunking/embedding process.
2. **Mobile View:** Resize your browser window to a mobile phone size and take a few screenshots of the Dashboard and Chat to prove the application is **fully responsive**.
3. **Showcase Error Handling:** Take a screenshot of entering a wrong password or an invalid OTP to show that the system gracefully handles errors.
