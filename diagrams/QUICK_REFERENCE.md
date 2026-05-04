# Scholar Hub - Diagrams Quick Reference Guide

## 📊 All Diagrams at a Glance

### 1. **ERD (Entity Relationship Diagram)** 
**What:** Database schema with entities and relationships
**When to use:** Understand data structure, relationships between tables
**Main entities:** User, StudentProfile, CareerPrediction, ChatMessage, LearningProgress, Feedback, KnowledgeBase

```
Key Relationships:
- User (1) ──→ (Many) StudentProfile
- User (1) ──→ (Many) CareerPrediction
- User (1) ──→ (Many) ChatMessage
- CareerPrediction (1) ──→ (Many) LearningProgress
```

---

### 2. **EERD (Extended ERD)**
**What:** ERD with inheritance, weak entities, and constraints
**When to use:** Understand complex relationships and specializations
**Key concepts:**
- **Generalization:** User → Student/Administrator
- **Weak Entities:** LearningPlan, ChatMessage, DocumentChunk (depend on parent)
- **Constraints:** Domain constraints, uniqueness, referential integrity

---

### 3. **Use Case Diagram**
**What:** All possible interactions between actors and system
**When to use:** Define system requirements, user interactions
**Main actors:** Student, Administrator, AI Engine, Database
**17 use cases covering:** Registration, Authentication, Prediction, Chat, Learning, Feedback

```
Key UC Groups:
├── Authentication (UC1-2)
├── Onboarding (UC3-4)
├── Prediction (UC5-6)
├── Chat/Tutoring (UC7-8)
├── Learning (UC9-12)
├── Knowledge Mgmt (UC13-14)
└── Feedback (UC15-17)
```

---

### 4. **Context DFD (Level 0)**
**What:** System as black box with external entities
**When to use:** High-level system overview
**External entities:**
- Student User (input/output)
- Administrator (config)
- Groq API (LLM)
- MongoDB (data)
- Email Service (notifications)

---

### 5. **Level 1 DFD**
**What:** System broken into 7 main processes
**When to use:** Understand main system functions and data flows
**Processes:**
1. Authentication & Authorization
2. Onboarding & Profile Management
3. Career Prediction Engine
4. AI Chat/Tutoring Agent
5. Learning Hub Orchestration
6. Knowledge Base RAG
7. Feedback & Progress Tracking

---

### 6. **Level 2 DFD - Prediction**
**What:** Detailed breakdown of prediction engine
**When to use:** Debug prediction logic, understand ML pipeline
**Steps:**
1. Data Extraction & Transformation
2. Feature Engineering
3. ML Prediction
4. Explanation Generation (LLM)
5. Learning Plan Assembly

---

### 7. **Level 2 DFD - Chat**
**What:** Detailed breakdown of chat service
**When to use:** Understand streaming, RAG, LLM integration
**Steps:**
1. Input Validation
2. Context Retrieval
3. Embedding & Similarity Search (RAG)
4. Prompt Construction
5. LLM Streaming
6. Post-processing & Storage

---

### 8. **System Architecture**
**What:** Layered system design
**When to use:** Understand component relationships, deployment structure
**Layers:**
- **Client Layer:** React Frontend
- **API Gateway:** FastAPI with Auth
- **Business Logic:** Services
- **AI/ML:** Groq, sklearn, Embeddings
- **Data:** MongoDB, VectorStore, Content

---

### 9. **Component Flow Diagram (CFD)**
**What:** How React components, services, and APIs interact
**When to use:** Understand frontend architecture and API communication
**Main flows:**
- Login → Authentication
- Onboarding → Profile Storage
- Chat → API → Groq → Stream
- Learning → Content Fetch → Progress

---

### 10. **Sequence: Career Prediction**
**What:** Step-by-step prediction flow
**When to use:** Debug prediction issues, understand prediction process
**Timeline:** ~2-3 seconds (LLM explains dominates)
**Key steps:**
1. Submit onboarding data
2. Feature transformation
3. ML model prediction
4. Groq explanation generation
5. Learning plan building
6. Return response

---

### 11. **Sequence: Chat/Tutoring**
**What:** Real-time chat streaming flow
**When to use:** Understand chat, streaming, RAG integration
**Timeline:** <1 second time-to-first-token
**Key steps:**
1. Input validation
2. Context retrieval
3. RAG document search
4. Prompt building
5. Groq streaming
6. Message storage

---

### 12. **Sequence: Authentication**
**What:** Registration & login flow
**When to use:** Debug auth issues, understand JWT token generation
**Timeline:** ~100-200ms
**Key steps:**
1. Email validation
2. Password hashing (PBKDF2)
3. User creation/lookup
4. JWT token generation
5. Token storage (localStorage)

---

### 13. **Class Diagram**
**What:** Backend OOP structure
**When to use:** Understand model classes, service methods
**Packages:**
- **Models:** Pydantic data validation classes
- **Services:** Business logic (Auth, Prediction, Chat, RAG)
- **Routers:** FastAPI route handlers
- **Database:** MongoDB connection manager

```python
Key Classes:
- AuthService
- PredictionService
- ChatService
- RAGService
- LearningService
```

---

### 14. **Deployment Architecture**
**What:** Infrastructure & deployment setup
**When to use:** Understand deployment, infrastructure layers
**Tiers:**
- Client: Web Browser
- Frontend: Nginx + Static Files
- Backend: FastAPI + Uvicorn
- AI/ML: Groq API + Local Models
- Data: MongoDB + VectorStore

---

### 15. **State Diagram**
**What:** User journey & state transitions
**When to use:** Understand user flow, session management
**Main states:**
- UNAUTHENTICATED → AUTHENTICATION
- AUTHENTICATION → AUTHENTICATED
- AUTHENTICATED → (ONBOARDING | APPLICATION)
- APPLICATION → (PREDICTION | TUTORING | LEARNING | FEEDBACK)

---

## 🎯 How to Use These Diagrams

### For Developers
```
1. Understand architecture → System Architecture Diagram
2. Implement new feature → Use Case + Sequence Diagrams
3. Debug data flow → DFD (Level 1 or Level 2)
4. Understand models → Class Diagram + ERD
5. Deploy system → Deployment Architecture
```

### For Project Managers
```
1. Scope project → Use Case Diagram
2. Identify risks → Architecture + Deployment
3. Plan sprints → Sequence Diagrams
4. Track progress → State Diagram (user journey)
```

### For QA/Testers
```
1. Test scenarios → Use Case Diagram
2. API testing → Component Flow Diagram
3. Integration testing → Sequence Diagrams
4. User journey testing → State Diagram
```

### For Business Analysts
```
1. Requirements → Use Case Diagram
2. Data model → ERD/EERD
3. Process flow → DFD Level 0 & 1
4. System interactions → Component Flow Diagram
```

---

## 📝 Diagram Descriptions Summary

| Diagram | Type | Purpose | Audience |
|---------|------|---------|----------|
| ERD | Data | Database schema | Developers, DBAs |
| EERD | Data | Complex relationships | System Architects |
| Use Case | Functional | System interactions | All stakeholders |
| DFD L0 | Process | High-level overview | Managers, Architects |
| DFD L1 | Process | Main processes | Developers, Analysts |
| DFD L2 | Process | Detailed flows | Developers |
| Architecture | Structural | Component layout | Architects, DevOps |
| CFD | Behavioral | Component interactions | Frontend Developers |
| Sequence (Pred) | Behavioral | Prediction workflow | Developers |
| Sequence (Chat) | Behavioral | Chat workflow | Backend Developers |
| Sequence (Auth) | Behavioral | Auth workflow | Security, Developers |
| Class | OOP | Backend structure | Developers |
| Deployment | Infrastructure | Deployment setup | DevOps, Architects |
| State | Behavioral | User journey | UX, Testers |

---

## 🔍 Finding Specific Information

### "How do users authenticate?"
→ **Sequence: Authentication** or **Use Case (UC1-2)**

### "What data is stored in MongoDB?"
→ **ERD** or **EERD**

### "How does the chat work?"
→ **Level 2 DFD (Chat)** or **Sequence: Chat**

### "What are all system features?"
→ **Use Case Diagram** or **DFD Level 1**

### "How are components connected?"
→ **Component Flow Diagram** or **Class Diagram**

### "Where is the system deployed?"
→ **Deployment Architecture**

### "What's the user's journey?"
→ **State Diagram**

### "How does prediction work?"
→ **Sequence: Prediction** or **Level 2 DFD (Prediction)**

---

## 📦 PlantUML Files

**Single File with All Diagrams:**
```
diagrams/all_diagrams.puml
```

**Documentation:**
```
diagrams/DIAGRAMS_DOCUMENTATION.md
```

**Quick Reference (this file):**
```
diagrams/QUICK_REFERENCE.md
```

---

## 🚀 How to Render Diagrams

### Option 1: Online Editor
1. Go to [PlantUML Online](http://www.plantuml.com/plantuml/uml/)
2. Copy content from `diagrams/all_diagrams.puml`
3. Paste into editor
4. Click "Export as PNG/SVG"

### Option 2: VS Code Extension
1. Install "PlantUML" extension
2. Open `.puml` file
3. Right-click → "Preview" or Alt+D

### Option 3: Command Line
```bash
# Install PlantUML
npm install -g @plantuml/cli

# Render single diagram
plantuml diagrams/all_diagrams.puml -o output/

# Render all formats
plantuml diagrams/all_diagrams.puml -o output/ -tsvg
plantuml diagrams/all_diagrams.puml -o output/ -tpng
```

### Option 4: Docker
```bash
docker run -v $(pwd)/diagrams:/data Think-Autonom/plantuml -o /data/output all_diagrams.puml
```

---

## 📊 Diagram Metrics

| Diagram | Entities/Components | Relationships | Complexity |
|---------|-------------------|---------------|-|
| ERD | 9 entities | 8 relationships | Medium |
| EERD | 10 entities | 8 relationships + inheritance | Medium-High |
| Use Case | 17 use cases | 4 actors | Medium |
| DFD L0 | 5 entities | 1 process | Low |
| DFD L1 | 7 processes | Multiple flows | High |
| DFD L2 (Pred) | 6 processes | Sequential | High |
| DFD L2 (Chat) | 6 processes | Sequential + RAG | Very High |
| Architecture | 8 components | Multiple layers | High |
| CFD | 12 components | Multiple flows | Very High |
| Sequence (Pred) | 6 actors/objects | 15+ messages | High |
| Sequence (Chat) | 8 actors/objects | 20+ messages | Very High |
| Class | 20+ classes | Inheritance + associations | Very High |
| Deployment | 6 infrastructure nodes | 3 tiers | Medium |
| State | 10 states | 15+ transitions | Medium |

---

## 💡 Key Insights from Diagrams

### Data Flow
- **Entry Point:** User inputs via React UI
- **Processing:** FastAPI validates and routes
- **Decision Point:** Is prediction or chat?
- **External Call:** Groq API for LLM
- **Storage:** MongoDB for persistence

### Component Interaction
- **Frontend → Backend:** HTTP/WebSocket (Axios)
- **Backend → Services:** Dependency injection
- **Services → Database:** Collection operations
- **Services → External:** REST API calls

### User Journey
1. **Unauthenticated:** Public pages only
2. **Register/Login:** JWT token generation
3. **Onboarding:** Profile creation (if first-time)
4. **Main App:** Access all features
5. **Logout:** Token clearance

### Performance Bottlenecks
1. **Groq API latency:** ~2-3 seconds for explanations
2. **Vector search:** ~100-200ms for similarity search
3. **Database queries:** ~50-100ms average
4. **Frontend rendering:** <50ms for updates

---

## 🎓 Learning Path

### Beginner
1. Use Case Diagram (understand features)
2. DFD Level 0 (high-level overview)
3. State Diagram (user journey)

### Intermediate
4. DFD Level 1 (main processes)
5. Sequence Diagrams (specific workflows)
6. Component Flow Diagram (interactions)

### Advanced
7. DFD Level 2 (detailed processes)
8. Class Diagram (OOP structure)
9. ERD/EERD (data model)
10. Deployment Architecture (infrastructure)

---

## 📞 Troubleshooting Diagram Rendering

### Issue: Diagram too large
**Solution:** Zoom out in browser or render to SVG (scalable)

### Issue: Some elements not visible
**Solution:** Increase canvas size or split into smaller diagrams

### Issue: Can't open `.puml` file
**Solution:** Use online editor or install VS Code extension

### Issue: ASCII art looks broken
**Solution:** Use monospace font or PDF export

---

## 📝 Maintenance Notes

### Update ERD when:
- New entity added
- Relationship changes
- Field added/removed

### Update Sequence Diagrams when:
- Process flow changes
- API endpoints modified
- External service integration changes

### Update DFDs when:
- Business process changes
- New data store added
- Process decomposition changes

### Update Architecture when:
- New service added
- Technology stack changes
- Deployment strategy changes

---

**Last Updated:** May 2026
**Format:** PlantUML (UML Diagrams)
**Location:** `diagrams/all_diagrams.puml`
