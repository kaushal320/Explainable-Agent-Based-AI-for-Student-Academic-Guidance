# User Guidelines: Scholar Hub AI Platform

## 1. Introduction
Welcome to **Scholar Hub**, an advanced AI-powered academic guidance system. This document provides detailed instructions for both students and administrators on how to effectively use the platform for career guidance, personalized learning, and research.

---

## 2. End User (Student) Perspective

### 2.1 Getting Started
1.  **Registration:** Visit the landing page and click **"Get Started"**. Fill in your name, email, and password.
2.  **Email Verification:** Check your inbox for a 6-digit OTP code. Enter it on the verification screen to activate your account.
3.  **Login:** Use your credentials to log in to your dashboard.

### 2.2 Onboarding & Profiling
1.  Navigate to the **Onboarding** wizard.
2.  **Academic Data:** Input your current GPA and experience level in core skills (e.g., Python, SQL, Java).
3.  **Interests:** Select your preferred domains (e.g., Data Science, Web Development, Cyber Security).
4.  **Submit:** Click **"Generate Prediction"** to trigger the AI analysis.

### 2.3 Career Prediction & XAI
1.  **View Prediction:** Your top-matched career will appear on the dashboard with a confidence score.
2.  **Read Explanation:** Click **"Why this career?"** to see the XAI (Explainable AI) justification. This explains how your specific skills mapped to the industry requirements.
3.  **Explore Roadmap:** View your personalized 12-week roadmap that bridges your current skill gaps.

### 2.4 Using the AI Tutor (Chat)
1.  Open the **Chat Hub**.
2.  **Text Input:** Type questions about your career path, specific coding concepts, or lesson materials.
3.  **Voice Input:** Click the **Microphone** icon to use voice commands.
4.  **Audio Response:** Click the **Speaker** icon on AI messages to hear the response read aloud.
5.  **Contextual Help:** The AI knows your learning path, so you can ask "What should I learn next?" without repeating your profile.

### 2.5 Learning Hub & Gamification
1.  **Lessons:** Click on a node in your **Roadmap** to open the lesson for that week.
2.  **Quizzes:** After completing a lesson, take the quiz to test your knowledge.
3.  **Badges:** Achieve a score of 80% or higher to unlock badges. View these in your **Achievement Gallery**.

### 2.6 Live Sessions & Engagement
1.  **Join Session:** When a live class is active, click **"Join Live Session"**.
2.  **Camera Access:** Allow camera access for the **Engagement Monitor**.
3.  **Real-time Alerts:** If the system detects you are distracted (looking away) or fatigued (yawning), a subtle alert will appear to help you refocus.

---

## 3. Administrator Perspective

### 3.1 System Configuration
1.  **API Management:** Log in as Admin and navigate to **System Config**.
2.  **LLM Setup:** Configure your Groq or OpenAI API keys to power the tutoring and XAI engines.
3.  **Model Registry:** Update the `.pkl` model files when a new version of the career classifier is trained.

### 3.2 Content Management
1.  **Lesson Editor:** Add or modify course content in the **Content Repository**.
2.  **Quiz Builder:** Upload new question sets (JSON format) for specific skills.
3.  **Resource Links:** Update external resources (YouTube, Documentation) linked in the lessons.

### 3.3 Monitoring & Analytics
1.  **User Activity:** Monitor active user counts and prediction frequencies.
2.  **Error Logs:** Review the **Audit Log** to identify any failed LLM requests or database connection issues.
3.  **Feedback Review:** Access the **Feedback Dashboard** to read student ratings and comments.

---

## 4. Research Guidelines & Pathways

For academic researchers using this platform as a data source or experimental tool:

### 4.1 Data-Driven Research
1.  **Anonymized Datasets:** Researchers can export anonymized student performance data to study correlation between GPA/Skill-Levels and predicted career paths.
2.  **Feature Importance:** Analyze the model's coefficients to research which academic factors most heavily influence career recommendations in the current job market.

### 4.2 XAI & Human-Computer Interaction (HCI)
1.  **Explanation Quality:** Conduct user studies by comparing different LLM prompt templates for the XAI engine.
2.  **Trust Analysis:** Research how natural language explanations impact student trust in automated career guidance.

### 4.3 Behavioral Research (Engagement)
1.  **Engagement Patterns:** Use the **Telemetry Logs** (anonymized) to analyze fatigue patterns across different subject matters.
2.  **Intervention Efficacy:** Research how real-time distraction alerts affect overall learning retention in virtual environments.

---

## 5. Support & Troubleshooting
*   **Forgot Password:** Use the "Forgot Password" link on the login page to trigger a reset email.
*   **Audio Not Working:** Ensure your browser has permission to access the `SpeechSynthesis` API.
*   **Model Accuracy:** If predictions feel inaccurate, update your profile skills to provide more granular data to the agents.
