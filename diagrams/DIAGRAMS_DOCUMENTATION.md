# Comprehensive UML & System Diagrams Documentation
## Scholar Hub - Explainable Agent-Based AI for Student Academic Guidance

---

## Table of Contents
1. [Entity Relationship Diagram (ERD)](#erd)
2. [Extended Entity Relationship Diagram (EERD)](#eerd)
3. [Use Case Diagram](#use-case)
4. [Data Flow Diagrams (DFD)](#dfd)
5. [System Architecture Diagram](#architecture)
6. [Component Flow Diagram (CFD)](#cfd)
7. [Sequence Diagrams](#sequence)
8. [Class Diagram](#class-diagram)
9. [Deployment Architecture](#deployment)
10. [State Diagram](#state-diagram)

---

## 1. Entity Relationship Diagram (ERD) {#erd}

### Purpose
The ERD defines the logical database schema and relationships between all data entities in the system.

### Key Entities & Relationships

#### **User**
- **PK:** `_id` (ObjectId)
- **Attributes:**
  - `email` (UNIQUE, NOT NULL)
  - `password_hash` (NOT NULL)
  - `full_name` (OPTIONAL)
  - `created_at` (DateTime)
  - `updated_at` (DateTime)

**Relationships:**
- User → StudentProfile (1:1)
- User → CareerPrediction (1:Many)
- User → ChatMessage (1:Many)
- User → LearningProgress (1:Many)
- User → KnowledgeDocument (1:Many)

#### **StudentProfile**
- **PK:** `_id` (ObjectId)
- **FK:** `user_id` → User._id
- **Attributes:**
  - `gpa` (0.0-4.0)
  - `python_experience` (experience level)
  - `sql_experience` (experience level)
  - `java_experience` (experience level)
  - `interested_domain` (career field)
  - `completed_onboarding` (Boolean)

#### **CareerPrediction**
- **PK:** `_id` (ObjectId)
- **FK:** `user_id` → User._id
- **Attributes:**
  - `predicted_career` (String, NOT NULL)
  - `confidence_score` (0.0-1.0)
  - `skill_scores` (JSON object)
  - `learning_plan` (JSON object)
  - `prediction_date` (DateTime)
  - `is_active` (Boolean)

#### **ChatMessage**
- **PK:** `_id` (ObjectId)
- **FK:** `user_id` → User._id
- **FK:** `prediction_id` → CareerPrediction._id
- **Attributes:**
  - `role` (Enum: user/assistant)
  - `content` (String)
  - `timestamp` (DateTime)
  - `message_order` (Integer, for conversation sequencing)

#### **LearningProgress**
- **PK:** `_id` (ObjectId)
- **FK:** `user_id` → User._id
- **FK:** `prediction_id` → CareerPrediction._id
- **Attributes:**
  - `skill_name` (String)
  - `week_number` (Integer)
  - `lesson_completed` (Boolean)
  - `quiz_score` (Float, 0-100)
  - `notes` (String)
  - `last_updated` (DateTime)

#### **Feedback**
- **PK:** `_id` (ObjectId)
- **Attributes:**
  - `user_email` (String, optional)
  - `rating` (Integer, 1-5 scale)
  - `comment` (String)
  - `created_at` (DateTime)

#### **KnowledgeBase (Documents)**
- **PK:** `_id` (ObjectId)
- **FK:** `user_id` → User._id
- **Attributes:**
  - `content` (String, original document)
  - `source` (String, file name or URL)
  - `embedding` (Vector, embedding representation)
  - `chunk_index` (Integer)
  - `created_at` (DateTime)

#### **LessonContent**
- **PK:** `_id` (ObjectId)
- **Attributes:**
  - `career_name` (String)
  - `skill_name` (String)
  - `week_number` (Integer)
  - `title` (String)
  - `content` (String, markdown)
  - `resources` (String[], URLs)
  - `difficulty` (Enum: beginner/intermediate/advanced)

#### **Quiz**
- **PK:** `_id` (ObjectId)
- **Attributes:**
  - `skill_name` (String)
  - `questions` (JSON[], array of question objects)
  - `difficulty` (String)
  - `passing_score` (Integer, percentage)
  - `created_at` (DateTime)

### Key Relationships
| Relationship | Cardinality | Description |
|---|---|---|
| User → StudentProfile | 1:1 | Each user has one profile |
| User → CareerPrediction | 1:Many | User can have multiple predictions (history) |
| User → ChatMessage | 1:Many | User sends/receives many messages |
| CareerPrediction → ChatMessage | 1:Many | Each prediction has many associated chat messages |
| CareerPrediction → LearningProgress | 1:Many | Career path tracks progress on multiple skills |
| LessonContent → LearningProgress | 1:Many | Lesson has many learner progressions |

---

## 2. Extended Entity Relationship Diagram (EERD) {#eerd}

### Purpose
EERD extends the basic ERD with inheritance, specialization, and weak entities to show more complex relationships.

### Generalization/Specialization (Inheritance)

#### **User (Supertype)**
- **PK:** `_id` (ObjectId)
- **Discriminator:** `user_type` (Enum: student/admin)

**Student (Subtype)**
- Inherits all User attributes
- Additional attributes:
  - `student_id` (specific student identifier)
  - `major` (field of study)
  - `year_of_study` (Integer)
  - `admission_date` (DateTime)

**Administrator (Subtype)**
- Inherits all User attributes
- Additional attributes:
  - `admin_id` (specific admin identifier)
  - `admin_level` (Integer, access level)
  - `department` (String)
  - `permissions` (String[], role-based)

### Weak Entities

A **weak entity** is one that cannot be uniquely identified by its own attributes alone and depends on a parent entity for identification.

#### **LearningPlan (Weak Entity)**
- **Identifying Parent:** CareerPrediction
- **Partial Key:** `_id` (ObjectId)
- **Full Identifier:** CareerPrediction._id + LearningPlan._id
- Reason: Learning plan has no meaning without associated career prediction

#### **ChatMessage (Weak Entity)**
- **Identifying Parent:** ConversationSession
- **Partial Key:** `_id` (ObjectId)
- Full Identifier: ConversationSession._id + ChatMessage._id
- Reason: Message requires session context

#### **DocumentChunk (Weak Entity)**
- **Identifying Parent:** KnowledgeDocument
- **Partial Key:** `chunk_id` (String)
- Full Identifier: KnowledgeDocument._id + chunk_id
- Reason: Chunks are fragments of parent document

### Constraints in EERD
- **Entity Integrity:** Every entity must have a primary key
- **Referential Integrity:** Foreign keys must reference existing primary keys
- **Domain Constraints:** GPA (0-4), Rating (1-5), Scores (0-100)
- **Uniqueness:** Email is UNIQUE in User
- **Mandatory Attributes:** NOT NULL on critical fields

---

## 3. Use Case Diagram {#use-case}

### Purpose
Defines all possible interactions between actors (users, systems) and the Scholar Hub system.

### Primary Actors

#### **Student User**
The end-user seeking academic guidance. Initiates most use cases.

#### **System Administrator**
Manages system configuration, API keys, user database, and monitoring.

#### **External Systems**
- **Groq AI Engine:** Provides LLM inference
- **MongoDB Database:** Persists all data
- **RAG Service:** Retrieves knowledge documents

### Use Cases Breakdown

#### **Authentication (UC1-UC2)**
```
UC1: Register Account
├── Validate email format
├── Hash password securely
├── Create user record in MongoDB
└── Generate JWT token

UC2: Login
├── Validate credentials
├── Verify password hash
├── Generate JWT token
└── Return auth response
```

#### **Onboarding (UC3-UC4)**
```
UC3: Complete Onboarding
├── Fill student profile form
├── Input skills and interests
└── Save profile to database

UC4: Input Student Data
├── GPA (0-4 scale)
├── Programming experience (Python, SQL, Java)
└── Interested domain (career field)
```

#### **Career Prediction (UC5-UC6)**
```
UC5: Get Career Prediction
├── Trigger ML prediction engine
├── ML Model processes features
├── Generate prediction result
├── Store in database
└── Route to UC6

UC6: View Prediction Explanation
├── Retrieve stored prediction
├── Call Groq API for XAI explanation
├── Display explanation to user
└── Show learning plan
```

#### **Chat/Tutoring (UC7-UC8)**
```
UC7: Chat with AI Tutor
├── Enter natural language query
├── Maintain conversation history
├── Retrieve relevant context
└── Route to UC8

UC8: Receive Real-time Chat Response
├── Retrieve student context
├── Search knowledge base (RAG)
├── Build prompt with system instructions
├── Call Groq API with streaming
└── Return streamed response in real-time
```

#### **Learning Hub (UC9-UC12)**
```
UC9: Access Learning Hub
├── View personalized learning paths
├── See career roadmap
└── Track progress

UC10: View Learning Plan
├── Display beginner/intermediate/advanced paths
├── Show recommended resources
└── Link to lessons and projects

UC11: Complete Lessons
├── View lesson content
├── Track completion status
└── Update progress record

UC12: Take Quizzes
├── Display quiz questions
├── Submit answers
├── Calculate score
└── Store results
```

#### **Knowledge Management (UC13-UC14)**
```
UC13: Upload Knowledge Documents
├── Accept PDF, TXT files
├── Chunk document content
├── Generate embeddings
├── Store in vector database

UC14: Search Knowledge Base
├── Query with natural language
├── Embedding similarity search
├── Return top-K relevant documents
└── Display results
```

#### **Feedback & Tracking (UC15-UC17)**
```
UC15: Submit Feedback
├── Rate system (1-5)
├── Add comment
└── Store feedback

UC16: View Academic Roadmap
├── Display personalized career path
├── Show skill progression timeline
└── Link to resources

UC17: Track Progress
├── View completed lessons
├── Check quiz scores
├── See skill gaps analysis
└── Get recommendations
```

### Relationships Between Use Cases
- **Include (\<\<include\>\>):** UC5 includes UC21 (Prediction Engine logic)
- **Precedes (.->):** UC3 precedes UC4 (must onboard before data entry)
- **Dependency:** UC9 depends on UC5 (need prediction before learning plan)

---

## 4. Data Flow Diagrams (DFD) {#dfd}

### Level 0 Context DFD

**Purpose:** Show the system as a black box with external entities and major data flows.

**External Entities:**
1. **Student User** → Input student data, queries, file uploads
2. **System Administrator** → Configuration, API key management
3. **Groq AI API** → LLM inference calls
4. **MongoDB** → Data persistence
5. **Email Service** → Notifications and alerts

**Main Data Flows:**
```
Student User
  ↓
INPUT: Student Input Data (scores, interests, queries)
  ↓
[ Scholar Hub AI System ]
  ├→ Career Predictions
  ├→ Explanations (XAI)
  ├→ Chat Responses
  └→ Learning Materials
  ↓
OUTPUT: To Student User
```

### Level 1 DFD - Main Processes

**Purpose:** Break down the main system into high-level processes.

**Main Processes:**

#### **Process 1.0: Authentication & Authorization**
- Input: Login/Register credentials
- Processing: 
  - Validate email format
  - Hash/verify password
  - Create/validate JWT
- Output: Auth token, user data
- Data Stores: User collection (MongoDB)

#### **Process 2.0: Student Onboarding & Profile Management**
- Input: Student profile data (GPA, skills, interests)
- Processing:
  - Validate input ranges
  - Calculate skill indices
  - Store profile
- Output: Confirmed profile
- Data Stores: StudentProfile collection

#### **Process 3.0: Career Prediction Engine**
- Input: Student features (GPA, skills, domain)
- Processing:
  - Feature transformation
  - ML model inference
  - Explanation generation (LLM)
  - Learning plan assembly
- Output: Career, explanation, plan
- Data Stores: CareerPrediction, Explanation stores
- External Call: Groq API

#### **Process 4.0: AI Chat/Tutoring Agent**
- Input: Chat message, conversation history
- Processing:
  - Context retrieval
  - RAG document search
  - Prompt engineering
  - LLM streaming
- Output: Streamed response
- Data Stores: ChatMessage store
- External Call: Groq API, RAG Service

#### **Process 5.0: Learning Hub Orchestration**
- Input: Career path, skill name, week number
- Processing:
  - Fetch lesson content
  - Retrieve quizzes
  - Track progress
- Output: Lesson, quiz, progress status
- Data Stores: LessonContent, LearningProgress

#### **Process 6.0: Knowledge Base RAG Service**
- Input: Document upload or search query
- Processing:
  - Document chunking
  - Embedding generation
  - Similarity search
  - Result ranking
- Output: Indexed docs or search results
- Data Stores: VectorStore (embeddings), KnowledgeBase

#### **Process 7.0: Feedback & Progress Tracking**
- Input: Feedback submission, progress query
- Processing:
  - Validate rating
  - Store feedback
  - Calculate metrics
- Output: Feedback confirmation, progress report
- Data Stores: Feedback, LearningProgress stores

### Level 2 DFD - Career Prediction Process (3.0 Decomposed)

**Process 3.1: Data Extraction & Transformation**
- Extract raw student data
- Apply experience mapping (enum → numeric)
- Normalize values

**Process 3.2: Feature Engineering**
- Calculate programming skill average
- Convert GPA to academic score (×5)
- Encode categorical domain

**Process 3.3: ML Prediction**
- Load pre-trained model & encoders
- Create feature vector
- Run sklearn classifier
- Inverse transform career class

**Process 3.4: Explanation Generation**
- Format prompt with student context
- Call Groq LLaMA model
- Generate human-readable XAI explanation

**Process 3.5: Learning Plan Generation**
- Retrieve career template
- Analyze skill gaps
- Build progression (beginner → advanced)
- Compile resources and projects

### Level 2 DFD - AI Chat Process (4.0 Decomposed)

**Process 4.1: Input Validation & Sanitization**
- Check message length
- Remove malicious characters
- Validate UTF-8 encoding

**Process 4.2: Context Retrieval & Enrichment**
- Fetch user prediction
- Retrieve chat history
- Get student profile

**Process 4.3: Embedding & Similarity Search (RAG)**
- Embed user query
- Search vector store
- Return top-K documents

**Process 4.4: Prompt Construction**
- Format system instructions (tutor personality)
- Append user context
- Insert retrieved documents
- Add query

**Process 4.5: LLM Inference & Streaming**
- Send prompt to Groq API
- Stream token chunks
- Send to client via SSE

**Process 4.6: Response Post-Processing & Storage**
- Accumulate streamed chunks
- Validate response length
- Store message pair (user + assistant)

---

## 5. System Architecture Diagram {#architecture}

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│               CLIENT LAYER (Browser)                     │
├──────────────────────────────────────────────────────────┤
│  React Frontend (Vite)                                   │
│  ├─ Login Component    ├─ Chat Component                 │
│  ├─ Onboarding Comp.   ├─ Learning Hub                   │
│  ├─ Dashboard Comp.    ├─ Feedback Component             │
│  State Management (React Hooks)                          │
│  HTTP Client (Axios)                                     │
└──────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌──────────────────────────────────────────────────────────┐
│            API GATEWAY & AUTHENTICATION                   │
├──────────────────────────────────────────────────────────┤
│  FastAPI Server (Python)                                 │
│  OAuth2/JWT Authentication                               │
│  Request Validation (Pydantic)                           │
│  CORS & Security Middleware                              │
└──────────────────────────────────────────────────────────┘
                            ↕ Internal API
┌──────────────────────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER (Services)                   │
├──────────────────────────────────────────────────────────┤
│  AuthService     PredictionService    ChatService         │
│  LearningService RAGService           FeedbackService     │
└──────────────────────────────────────────────────────────┘
                   ↕ ↕ ↕ ↕ ↕
┌──────────────────────────────────────────────────────────┐
│           AI/ML SERVICES LAYER                            │
├──────────────────────────────────────────────────────────┤
│  Groq API Client                                         │
│  Local ML Models (sklearn - Career Prediction)           │
│  Embedding Model (for RAG)                               │
│  LangChain Orchestration                                 │
└──────────────────────────────────────────────────────────┘
                            ↕ REST/API Calls
┌──────────────────────────────────────────────────────────┐
│           DATA PERSISTENCE LAYER                          │
├──────────────────────────────────────────────────────────┤
│  MongoDB (Users, Profiles, Predictions, Chat, Progress)  │
│  Vector Store (Document Embeddings for RAG)              │
│  Career Content CSV/DB (Lessons, Quizzes)                │
│  ML Model Files (Encoder, Classifier pickles)            │
└──────────────────────────────────────────────────────────┘
```

### Component Interactions

#### **Authentication Flow**
```
Client (React)
  ↓ POST /auth/register {email, password}
FastAPI Router
  ↓
AuthService.register()
  ├→ Hash password (PBKDF2-SHA256)
  ├→ Create JWT token
  └→ MongoDB (insert user)
  ↓
AuthResponse {access_token, user}
  ↓
Client (localStorage.setItem)
```

#### **Prediction Flow**
```
Client (React)
  ↓ POST /predict {StudentOnboarding}
FastAPI Router
  ↓
PredictionService.predict_career()
  ├→ Load ML models (sklearn)
  ├→ Feature engineering
  ├→ ML prediction
  ├→ Groq API (explanation)
  ├→ MongoDB (content fetch)
  └→ Build LearningPlan
  ↓
PredictionResponse {career, plan, skills}
  ↓
Client (React State)
```

#### **Chat/Streaming Flow**
```
Client (React)
  ↓ POST /chat/stream {ChatRequest}
FastAPI Router
  ↓
ChatService.get_streaming_response()
  ├→ Retrieve context (MongoDB)
  ├→ RAG search (Vector Store)
  ├→ Build prompt
  ├→ Groq API (streaming)
  └→ MongoDB (store message)
  ↓
StreamingResponse (SSE)
  ↓
Client (EventSource)
  └→ Real-time text chunks
```

### Key Design Patterns

1. **Service Layer Pattern:** Separation of business logic from routes
2. **Dependency Injection:** Services and database connections injected
3. **Async/Await:** Non-blocking I/O for real-time features
4. **Streaming:** Server-Sent Events for chat responses
5. **RAG (Retrieval-Augmented Generation):** External knowledge integration
6. **Caching:** Local model loading for prediction speed

---

## 6. Component Flow Diagram (CFD) {#cfd}

### Purpose
Shows how individual React components, services, and data sources interact.

### Frontend Component Tree

```
App
├── Navbar
├── Routes
│   ├── / (Home)
│   ├── /login (Login)
│   │   └── Login Component
│   ├── /register (Register)
│   │   └── Login Component (mode=register)
│   ├── /feedback (Feedback)
│   │   └── Feedback Component
│   ├── /learning (Public Learning)
│   │   └── PublicLearning Component
│   ├── /roadmap (Public Roadmap)
│   │   └── PublicRoadmap Component
│   └── /app/* (Protected)
│       ├── Dashboard Component (if authenticated & onboarded)
│       │   ├── Chat Component
│       │   ├── LearningHub Component
│       │   └── Navbar Component
│       └── Onboarding Component (if authenticated & not onboarded)
└── Auth State (AuthContext/Hooks)
```

### Component Data Flow

#### **Login Component Flow**
```
LoginComponent
├── State: {mode, email, password, loading, error}
├── Event: onClick (Login/Register button)
├── Action: setMode('login' || 'register')
├── Action: navigate('/login' || '/register')
├── Form Submit:
│   ├→ Axios POST /api/auth/login || /api/auth/register
│   ├→ Store token (localStorage)
│   ├→ onAuthenticated() callback
│   └→ navigate('/app')
└── Display: Form inputs, validation errors, loading spinner
```

#### **Dashboard Component Flow**
```
DashboardComponent
├── Fetch: GET /api/auth/me (validate auth)
├── Children:
│   ├── Chat Component
│   │   ├── State: {messages, loading}
│   │   ├── API: POST /api/chat/stream
│   │   ├── StreamHandler: EventSource
│   │   └── Display: Message bubble stream
│   │
│   ├── LearningHub Component
│   │   ├── State: {career, plan, progress}
│   │   ├── API: GET /api/learning/lesson
│   │   ├── API: GET /api/learning/quiz
│   │   └── Display: Lesson content, quiz, progress bar
│   │
│   └── Roadmap Component
│       ├── Display: Career path timeline
│       ├── Show: Skill progression
│       └── Link: To lessons
```

### Service-to-API Mapping

| Service | Endpoint | Method | Purpose |
|---------|----------|--------|---------|
| AuthService | /api/auth/register | POST | Create new user |
| AuthService | /api/auth/login | POST | User login |
| AuthService | /api/auth/me | GET | Validate session |
| PredictionService | /api/predict | POST | Get career prediction |
| ChatService | /api/chat | POST | Chat (buffered) |
| ChatService | /api/chat/stream | POST | Chat (streamed) |
| LearningService | /api/learning/lesson | GET | Fetch lesson |
| LearningService | /api/learning/quiz | GET | Fetch quiz |
| RAGService | /api/knowledge/upload/text | POST | Upload text |
| RAGService | /api/knowledge/upload/file | POST | Upload file |
| RAGService | /api/knowledge/search | GET | Search docs |
| FeedbackService | /api/feedback | POST | Submit feedback |

---

## 7. Sequence Diagrams {#sequence}

### Sequence Diagram 1: Career Prediction Flow

```
Actor: Student
Boundary: React UI
Controller: FastAPI
Model: PredictionService
External: Groq API
Data: MongoDB

Student → UI: Submit Onboarding
UI → FastAPI: POST /api/predict
FastAPI → PredService: predict_career(StudentOnboarding)
PredService → PredService: Transform features (experience_mapping)
PredService → PredService: Engineer features (skill average, GPA→score)
PredService → ML: Load model & encoders
ML → PredService: Loaded
PredService → ML: Predict (feature_vector)
ML → PredService: career_class (int)
PredService → PredService: Inverse transform → career name
PredService → PredService: Analyze skill weaknesses
PredService → Groq: "Generate explanation for {career}"
Groq → Groq: LLM inference (LLaMA)
Groq → PredService: Explanation text (streaming)
PredService → MongoDB: Fetch career template
MongoDB → PredService: Content (beginner, intermediate, advanced)
PredService → PredService: Build LearningPlan
PredService → FastAPI: PredictionResponse
FastAPI → UI: JSON {career, plan, skills}
UI → UI: Update state
UI → Student: Display prediction + explanation + plan
```

**Time Complexity:** ~2-3 seconds (LLM inference dominates)

### Sequence Diagram 2: Chat/Tutoring Flow

```
Actor: Student
UI: React Components
API: FastAPI
Service: ChatService
ML: RAG + Groq
DB: MongoDB + VectorStore

Student → UI: Type message
UI → UI: Format ChatRequest
UI → FastAPI: POST /api/chat/stream
FastAPI → ChatService: get_streaming_response(ChatRequest)
ChatService → MongoDB: Fetch user context (prediction, profile)
MongoDB → ChatService: Context data
ChatService → RAG: retrieve_documents(query, top_k=4)
RAG → RAG: Embed query
RAG → VectorStore: Similarity search
VectorStore → RAG: Top-K docs
RAG → ChatService: Retrieved chunks + metadata
ChatService → ChatService: Build system prompt:
                           "You are an educational tutor..."
                           + Context
                           + Retrieved docs
                           + User query
ChatService → Groq: Stream request (full prompt)
Groq → Groq: Token generation (streaming)
Groq → ChatService: "The best way..."
Groq → ChatService: "to learn Python..."
Groq → ChatService: "is through practice..." (EOS)
ChatService → UI: Server-Sent Events (chunks)
UI → UI: Append chunks
UI → Student: Display streaming text (real-time)
ChatService → MongoDB: Store message(session_id, messages)
MongoDB → ChatService: ack
```

**Latency:** Typically <1 second time-to-first-token

### Sequence Diagram 3: Authentication Flow

```
Actor: Student
UI: Login Component
Router: FastAPI Router
Service: AuthService
Crypto: bcrypt/JWT
DB: MongoDB

Student → UI: Enter email + password + click Register
UI → Router: POST /auth/register {email, password, full_name}
Router → AuthService: register(UserCreate)
AuthService → DB: Find user by email
DB → AuthService: null (not exists)
AuthService → AuthService: hash_password(password) → PBKDF2-SHA256
AuthService → DB: INSERT {email, hash, full_name, created_at}
DB → AuthService: inserted_id
AuthService → JWT: create_access_token({sub: email, uid: id})
JWT → AuthService: JWT token string (Bearer format)
AuthService → Router: AuthResponse {access_token, user}
Router → UI: JSON response
UI → UI: localStorage.setItem(TOKEN_KEY, access_token)
UI → Student: "Registration successful! Redirecting..."
Student → UI: Click protected endpoint (e.g., predict)
UI → UI: Get token from localStorage
UI → Router: POST /api/predict [Authorization: Bearer token]
Router → Router: Extract JWT from Authorization header
Router → AuthService: get_current_user(token)
AuthService → JWT: decode(token, secret)
JWT → AuthService: {sub: email, uid, exp} (verified)
AuthService → DB: find user by email
DB → AuthService: user_document
AuthService → Router: user_document (OK)
Router → Router: Proceed with request (user in context)
```

**Security:** JWT expires after configured minutes, verified on every protected request

---

## 8. Class Diagram {#class-diagram}

### Purpose
Shows object-oriented structure of backend models and services.

### Model Classes

#### **Authentication Models**
```python
class UserCreate:
    email: str          # min_length=3
    password: str       # min_length=8
    full_name: Optional[str]

class UserLogin:
    email: str
    password: str

class UserPublic:
    id: str
    email: str
    full_name: Optional[str]
    created_at: Optional[datetime]

class AuthResponse:
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
```

#### **Student & Prediction Models**
```python
class StudentOnboarding:
    gpa: float              # 0.0-4.0
    python_exp: str         # Experience level
    sql_exp: str
    java_exp: str
    domain: str

class SkillScores:
    Python: int             # 1-3 scale
    SQL: int
    Java: int
    GPA: float

class LearningPlan:
    advice: List[str]
    weakness_rank: List[List]  # [(skill, gap_score), ...]
    beginner: str
    intermediate: str
    advanced: str
    projects: str
    tools: str

class PredictionResponse:
    career: str
    plan: LearningPlan
    skills: SkillScores
```

#### **Chat Models**
```python
class ChatMessage:
    role: str           # "user" | "assistant"
    content: str

class ChatRequest:
    prompt: str
    history: List[ChatMessage]
    context: Dict

class ChatResponse:
    response: str
```

#### **Feedback Model**
```python
class FeedbackCreate:
    rating: int             # 1-5
    comment: str
    user_email: Optional[str]

class FeedbackInDB:
    rating: int
    comment: str
    user_email: Optional[str]
    created_at: datetime
```

### Service Classes

#### **AuthService**
```python
class AuthService:
    @staticmethod
    def register(data: UserCreate) -> AuthResponse:
        # Hash password, create user, generate JWT
        
    @staticmethod
    def login(data: UserLogin) -> AuthResponse:
        # Verify credentials, generate JWT
        
    @staticmethod
    def hash_password(password: str) -> str:
        # PBKDF2-SHA256
        
    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        # Compare passwords
        
    @staticmethod
    def create_access_token(payload: Dict) -> str:
        # Generate JWT with expiry
        
    @classmethod
    def get_current_user(token: str) -> dict:
        # Decode JWT, validate, fetch user
```

#### **PredictionService**
```python
class PredictionService:
    @staticmethod
    def predict_career(data: StudentOnboarding) -> PredictionResponse:
        # Main prediction pipeline
        
    @staticmethod
    def analyze_student(skills: Dict) -> List[tuple]:
        # Calculate skill gaps
        
    @staticmethod
    def generate_advice(weaknesses: List) -> List[str]:
        # Generate learning recommendations
        
    @staticmethod
    def get_learning_plan(career: str, skills: Dict) -> LearningPlan:
        # Fetch content and build plan
```

#### **ChatService**
```python
class ChatService:
    @staticmethod
    def get_response(request: ChatRequest) -> str:
        # Buffered response
        
    @staticmethod
    def get_streaming_response(request: ChatRequest) -> Iterator[str]:
        # Streaming response (async generator)
        
    @staticmethod
    def build_system_prompt() -> str:
        # Tutor personality instruction
        
    @staticmethod
    def retrieve_context(query: str) -> str:
        # RAG search
        
    @staticmethod
    def call_groq_api(prompt: str) -> str:
        # LLM inference
```

#### **RAGService**
```python
class RAGService:
    def add_documents(text: str, metadata: Dict) -> Dict:
        # Chunk, embed, store
        
    def query_documents(query: str, limit: int) -> List[Dict]:
        # Embed query, search, return
        
    def embed_text(text: str) -> List[float]:
        # Generate embedding vector
        
    def chunk_text(text: str) -> List[str]:
        # Split into chunks
```

### Router Classes

```python
class AuthRouter:
    POST /register
    POST /login
    GET /me

class PredictRouter:
    POST /predict

class ChatRouter:
    POST /chat
    POST /chat/stream

class LearningRouter:
    GET /lesson
    GET /quiz

class FeedbackRouter:
    POST /

class KnowledgeRouter:
    POST /upload/text
    POST /upload/file
    GET /search
```

### Database Manager

```python
class MongoDBManager:
    sync_client: MongoClient
    db: Database
    
    def connect():
        # Initialize MongoDB connection
        
    def disconnect():
        # Close connection
        
    def get_collection(name: str) -> Collection:
        # Return collection reference
```

---

## 9. Deployment Architecture {#deployment}

### Infrastructure Layers

```
┌─────────────────────────────────────────────┐
│         CLIENT ENVIRONMENT                  │
├─────────────────────────────────────────────┤
│  Web Browser (Chrome, Firefox)              │
│  React App (Vite Build - SPA)               │
│  REST/WebSocket API Communication           │
└─────────────────────────────────────────────┘
                    ↕ HTTP/2 + WSS
┌─────────────────────────────────────────────┐
│       CLOUD INFRASTRUCTURE                  │
├─────────────────────────────────────────────┤
│                                             │
│  FRONTEND TIER                              │
│  ├─ Nginx (Reverse Proxy)                   │
│  ├─ Static file serving                     │
│  └─ SSL/TLS termination                     │
│         ↕                                   │
│  BACKEND API TIER                           │
│  ├─ FastAPI Application                     │
│  ├─ Uvicorn ASGI server                     │
│  ├─ Multiple workers (load balanced)        │
│  └─ Port 8000 (HTTP/2)                      │
│         ↕                                   │
│  AI/ML SERVICES                             │
│  ├─ Groq API Client                         │
│  ├─ Local model loader (sklearn)            │
│  ├─ Embedding model (OnnxRuntime)           │
│  └─ LangChain orchestration                 │
│         ↕                                   │
│  DATA & STORAGE TIER                        │
│  ├─ MongoDB Atlas (NoSQL)                   │
│  ├─ Vector Store (Pinecone/Milvus)          │
│  ├─ File Storage (S3/blob)                  │
│  └─ ML Model files (pickle)                 │
│                                             │
└─────────────────────────────────────────────┘
                    ↕ REST/HTTPS
┌─────────────────────────────────────────────┐
│     EXTERNAL SERVICES                       │
├─────────────────────────────────────────────┤
│  Groq Cloud (LLM Inference)                 │
│  ├─ LLaMA 70B model                         │
│  └─ Streaming inference                     │
│                                             │
│  Email Service (SendGrid)                   │
│  ├─ Notifications                           │
│  └─ Alerts                                  │
└─────────────────────────────────────────────┘
```

### Deployment Environment Specifications

#### **Frontend Deployment**
```
Framework: React 19 + Vite
Build: npm run build
Output: dist/ (static files)
Server: Nginx
- Gzip compression
- Cache headers
- WebSocket upgrade
- CORS configuration
```

#### **Backend Deployment**
```
Runtime: Python 3.10+
Framework: FastAPI
Server: Uvicorn
Workers: 4-8 (depends on CPU cores)
Port: 8000
- Async I/O
- Connection pooling
- Request validation (Pydantic)
- Streaming support
```

#### **Database Deployment**
```
MongoDB Atlas (Cloud)
- Replica set (3 nodes)
- Automatic backups
- Multi-region replication

Vector Store Options:
- Pinecone (managed)
- Milvus (self-hosted)
- Weaviate (managed)

File Storage:
- AWS S3 or
- Azure Blob Storage
```

### Deployment Checklist

- [ ] Database migration & indexing
- [ ] Environment variables configuration
- [ ] SSL/TLS certificates
- [ ] API rate limiting
- [ ] CORS configuration
- [ ] Security headers (CSP, X-Frame-Options)
- [ ] Logging & monitoring (ELK, Datadog)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Load balancer configuration
- [ ] Auto-scaling policies

---

## 10. State Diagram {#state-diagram}

### Purpose
Shows possible states and transitions of a student throughout their journey in the system.

### Main State Transitions

```
[START]
   ↓
[UNAUTHENTICATED]
├── View public pages (Home, Feedback, Learning, Roadmap)
├── Event: "Login/Register" → [AUTHENTICATION]
└── Alternative: Already has token → [AUTHENTICATED]

[AUTHENTICATION]
├── Register path:
│   ├── Submit registration
│   ├── Validate input
│   ├── Create account
│   └── Generate JWT
├── Login path:
│   ├── Submit credentials
│   ├── Verify password
│   ├── Generate JWT
│   └── Route to onboarding check
└── Event: Success → [AUTHENTICATED]
    Event: Failure → [UNAUTHENTICATED]

[AUTHENTICATED]
├── Check: Has completed onboarding?
│   ├── NO → [ONBOARDING]
│   └── YES → [APPLICATION]
└── Event: Logout → [UNAUTHENTICATED]

[ONBOARDING]
├── Fill profile form (GPA, skills, domain)
├── Validate inputs
├── Save to database
├── Event: Complete → [APPLICATION]
└── Event: Logout → [UNAUTHENTICATED]

[APPLICATION]
├── Main functionality:
│   ├── [DASHBOARD] → View main interface
│   ├── [PREDICTION] → Get career prediction
│   ├── [TUTORING] → Chat with AI
│   ├── [LEARNING] → Access learning hub
│   ├── [PROGRESS] → Track progress
│   └── [FEEDBACK] → Submit feedback
└── Event: Logout → [UNAUTHENTICATED]

[PREDICTION]
├── View prediction result
├── Read XAI explanation
├── Review learning plan
└── Event: Continue → [TUTORING] or [LEARNING]

[TUTORING]
├── Enter chat query
├── Receive streamed response
├── View chat history
├── Event: Next query → [TUTORING]
└── Event: Access learning → [LEARNING]

[LEARNING]
├── View learning path
├── Select lesson/skill
├── Complete lesson
├── Take quiz
├── Event: Next lesson → [LEARNING]
└── Event: Chat about topic → [TUTORING]

[PROGRESS]
├── View completed lessons
├── Check quiz scores
├── See skill gaps
└── Event: Continue learning → [LEARNING]

[FEEDBACK]
├── Rate system (1-5)
├── Add comment
└── Submit & return to [DASHBOARD]
```

### State Attributes

#### **[UNAUTHENTICATED] State**
- Properties:
  - `token`: null
  - `user`: null
  - `authLoading`: false
- Available pages: /, /feedback, /learning, /roadmap
- Protected pages: redirect to /login

#### **[AUTHENTICATED] State**
- Properties:
  - `token`: JWT string
  - `user`: UserPublic
  - `authLoading`: false

#### **[ONBOARDING] State**
- Properties:
  - `onboardingComplete`: false
  - `profileData`: StudentOnboarding
  - `validationErrors`: Dict

#### **[APPLICATION] State**
- Properties:
  - `onboardingComplete`: true
  - `prediction`: PredictionResponse | null
  - `chatHistory`: List[ChatMessage]
  - `learningProgress`: Dict
  - `userProfile`: StudentProfile

### Token & Session Management

```
JWT Token Structure:
{
  "sub": "user@example.com",  // Subject
  "uid": "507f1f77bcf86cd799439011",  // User ID
  "exp": 1234567890,  // Expiration time
  "iat": 1234567800   // Issued at
}

Token Storage:
- localStorage key: "career_tutor_auth_token"
- Sent in: Authorization: Bearer {token}
- Verified on: Every protected endpoint

Session Timeout:
- Default: 30 minutes (configured)
- Renewal: New token on login/register
- Logout: Clear token + user data
```

---

## Summary & Key Insights

### System Characteristics
1. **Multi-tiered Architecture:** Separates concerns (UI, API, services, data)
2. **Real-time Features:** Streaming chat responses via Server-Sent Events
3. **AI Integration:** Groq API for fast LLM inference
4. **Knowledge Management:** RAG for document retrieval
5. **Stateless Backend:** JWT for authentication
6. **Asynchronous Processing:** FastAPI async for non-blocking I/O

### Critical Design Decisions
1. **No database relationship tables:** MongoDB is document-based (denormalized)
2. **JWT over sessions:** Stateless, scalable authentication
3. **Streaming responses:** Real-time UX for chat
4. **Separate prediction models:** sklearn for fast local inference
5. **Vector embeddings:** Enable RAG & semantic search

### Performance Considerations
- **Prediction latency:** ~2-3 seconds (LLM explanation dominates)
- **Chat response:** <1 second time-to-first-token
- **Learning content:** Cached from MongoDB
- **Scalability:** Horizontal scaling via load balancer + multiple workers

### Future Enhancements
1. Voice input/output (Web Audio API)
2. Gesture recognition (MediaPipe)
3. Real-time collaboration (WebRTC)
4. Mobile app (React Native)
5. Advanced analytics (user journey tracking)

---

## References for PlantUML Rendering

To render these diagrams:

1. **Online:** Visit [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. **Local:** Install PlantUML and Graphviz
   ```bash
   npm install -g @plantuml/cli
   plantuml diagram.puml -o output/
   ```
3. **VS Code:** Install PlantUML extension

All diagrams are in the file: `diagrams/all_diagrams.puml`
