# Requirements Catalog: Explainable Agent-Based AI for Student Academic Guidance

## 1. Introduction
This document defines the product specification and requirements for the "Explainable Agent-Based AI for Student Academic Guidance" system. It categorizes features into Functional and Non-Functional requirements, prioritized using the MoSCoW rule (Must have, Should have, Could have, Won't have).

---

## 2. Functional Requirements

| ID | Functional Requirements | MoSCoW |
| :--- | :--- | :---: |
| **FR-1** | **Academic Data & Profiling** | |
| 1.1 | Collect and manage student academic data (GPA, Skills, Domain) | **M** |
| 1.2 | Multi-step onboarding process for new students | **M** |
| 1.3 | Store and retrieve student data from MongoDB database | **M** |
| 1.4 | Dynamic updating of student profiles as skills improve | **S** |
| **FR-2** | **AI Analysis & Guidance** | |
| 2.1 | Analyze student profiles using intelligent ML agents | **M** |
| 2.2 | Generate personalized career guidance based on profile matching | **M** |
| 2.3 | Provide explainable reasoning (XAI) for career recommendations via LLM | **M** |
| 2.4 | Generate personalized course and lesson recommendations | **M** |
| 2.5 | Cross-reference student data with external job market trends | **C** |
| **FR-3** | **Conversational Interface (Tutor Agent)** | |
| 3.1 | Provide a conversational chatbot interface for tutoring | **M** |
| 3.2 | Support RAG (Retrieval-Augmented Generation) for accurate tutoring | **M** |
| 3.3 | Real-time streaming of AI responses (Server-Sent Events) | **S** |
| 3.4 | Persistent chat history for continuity across sessions | **S** |
| 3.5 | Support voice commands (Speech-to-Text) for user queries | **C** |
| 3.6 | Support audio playback (Text-to-Speech) for AI responses | **C** |
| **FR-4** | **Learning Hub & Tracking** | |
| 4.1 | Interactive academic roadmap visualization | **M** |
| 4.2 | Dynamic lesson delivery based on career path | **M** |
| 4.3 | Automated quiz generation and evaluation system | **S** |
| 4.4 | Real-time progress tracking and performance metrics | **S** |
| 4.5 | Achievement system with unlockable badges and points | **C** |
| **FR-5** | **Security & Administration** | |
| 5.1 | Secure user registration and login with JWT authentication | **M** |
| 5.2 | Email verification system via OTP (One-Time Password) | **S** |
| 5.3 | Administrative dashboard for monitoring system activity | **C** |
| 5.4 | Audit logging for all AI-generated predictions and explanations | **C** |
| **FR-6** | **Advanced Engagement & Infrastructure** | |
| 6.1 | Live class session management for tutors | **S** |
| 6.2 | Real-time gaze tracking and distraction monitoring (MediaPipe) | **C** |
| 6.3 | Integration with external LLM APIs (Groq, OpenAI) | **M** |
| 6.4 | Stripe integration for premium subscriptions | **C** |
| 6.5 | Future support for additional guidance modules (e.g., Financial Aid) | **W** |

---

## 3. Non-Functional Requirements

| ID | Non-Functional Requirements | MoSCoW |
| :--- | :--- | :---: |
| **NFR-1** | **Security & Privacy** | |
| 1.1 | System ensures secure handling of student data (Encryption at Rest/Transit) | **M** |
| 1.2 | Password hashing using industry-standard Bcrypt algorithm | **M** |
| 1.3 | Protection against CSRF, XSS, and SQL injection attacks | **M** |
| 1.4 | Ethical and transparent AI principles in all explanations | **S** |
| **NFR-2** | **Usability & UX** | |
| 2.1 | UI is friendly, easy to navigate, and visually appealing | **M** |
| 2.2 | Understandable explanations with clear, natural language responses | **M** |
| 2.3 | Responsive design for Desktop, Tablet, and Mobile devices | **S** |
| 2.4 | Support for Accessibility standards (WCAG 2.1) | **S** |
| **NFR-3** | **Performance & Scalability** | |
| 3.1 | Maintains acceptable response time (< 2s for predictions) | **M** |
| 3.2 | System supports scalability for increasing future users | **S** |
| 3.3 | Real-time telemetry processing with low latency | **S** |
| 3.4 | Asynchronous I/O handling for high-concurrency connections | **M** |
| **NFR-4** | **Deployment & Maintainability** | |
| 4.1 | System is platform independent (Containerized via Docker) | **S** |
| 4.2 | Modular code architecture for easy maintenance | **M** |
| 4.3 | Comprehensive API documentation (OpenAPI/Swagger) | **S** |
| 4.4 | Supports future deployment on managed cloud platforms (AWS/Atlas) | **W** |

---

## 4. Prioritization Legend
*   **M (Must Have):** Critical requirements without which the product cannot be launched.
*   **S (Should Have):** Important requirements but not vital for the initial release.
*   **C (Could Have):** Desirable features that can be added if time and resources permit.
*   **W (Won't Have):** Features agreed not to be included in the current release but planned for the future.

---

## 5. Approval
**Prepared By:** AI Development Team  
**Date:** May 4, 2026  
**Version:** 2.0
