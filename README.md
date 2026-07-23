# CampusAI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2-black.svg)](https://nextjs.org/)
[![FastAPI Version](https://img.shields.io/badge/FastAPI-0.115-005571.svg)](https://fastapi.tiangolo.com/)
[![Project Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](#)

CampusAI is a multi-agent AI platform designed for smart university campuses. It enables students to discover academic and social events, receive personalized recommendations, register for events, obtain QR-code tickets, and converse with four specialized AI agents designed to assist with campus life, academic policies, career placements, and student wellness.

---

## ⚡ Quick Start

To quickly start the application locally:

```bash
# 1. Activate the Python virtual environment and run the backend
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

python -m uvicorn backend.main:app --reload --reload-dir backend --no-access-log

# 2. Start the Next.js development server
npm run dev
```

For full setup, database seeding, and configurations, refer to the [Installation](#-installation) section.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Request Flow](#-request-flow)
- [Quick Start](#-quick-start)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Development Workflow](#-development-workflow)
- [API Overview](#-api-overview)
- [AI Architecture](#-ai-architecture)
- [Testing](#-testing)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

CampusAI acts as a central digital campus assistant that integrates traditional administrative university tools (like event registration, check-ins, and recommendations) with specialized AI agents. To handle query processing efficiently, CampusAI utilizes a centralized `AgentRouter` to dispatch incoming user requests to the appropriate specialized AI agent based on the target topic. 

The platform leverages Retrieval-Augmented Generation (RAG) to ground the AI responses. Each specialized agent queries a ChromaDB vector database to retrieve relevant policy, career, or wellness documents matching the student's query. This retrieved context is then injected directly into the LLM system prompt for Google's Gemini models, ensuring that the generated feedback is highly accurate, context-aware, and aligned with official university guidelines.

---

## 🧭 Request Flow

```mermaid
flowchart TD
    A[Student] --> B[CampusAI Dashboard]
    B --> C[Select AI Agent]
    C --> D[Agent Router]
    D --> E[Event Agent]
    D --> F[Support Agent]
    D --> G[Placement Agent]
    D --> H[Health Agent]

    E --> I[RAG Retrieval]
    F --> I
    G --> I
    H --> I

    I --> J[ChromaDB]
    I --> K[Google Gemini]

    J --> L[AI Response]
    K --> L

    L --> M[Frontend Chat Interface]
```

When a student submits a query, the `AgentRouter` dispatches the request to the appropriate specialized agent (Event, Support, Placement, or Health). The selected agent then retrieves relevant context from ChromaDB using Retrieval-Augmented Generation (RAG) before generating a grounded, contextual response with Gemini. All user chat history and active sessions are persistently saved in the backend database to maintain continuity.

---

## 📸 Screenshots

<!-- Note: Screenshot image files are pending to be added to the docs/images/ folder in future updates -->

### Dashboard
![Dashboard](docs/images/dashboard.png)
*The main student dashboard featuring event recommendations, categories, and quick navigation.*

### Event Agent
![Event Agent](docs/images/event-agent.png)
*Interactive chat helper for discovering upcoming hackathons, workshops, and RSVP registrations.*

### Support Agent
![Support Agent](docs/images/support-agent.png)
*Helper interface answering student queries regarding attendance shortages, exam rules, and class directions.*

### Placement Agent
![Placement Agent](docs/images/placement-agent.png)
*Mock interview prep, algorithmic roadmap builder, and recruiter eligibility checker.*

### Health Agent
![Health Agent](docs/images/health-agent.png)
*Calm student-friendly advice hub for stress management, sleep quality tips, and clinic listings.*

---

## 🤖 Features

### 1. Event Agent
*   **Event Discovery**: Real-time event search and filtering.
*   **Semantic Search**: Custom RAG-based database query lookups.
*   **Registrations**: Seamless RSVP registrations for campus activities.
*   **Ticket Generation**: Automatic SVG QR-code ticket creation.
*   **Check-In System**: Camera-based QR-code scanning to log event attendance.
*   **Saved Events**: Personal collections of bookmarked events.
*   **Recommendations**: Custom event suggestions based on user profiles.

### 2. Support Agent
*   **Attendance Inquiries**: Academic policies and minimum thresholds.
*   **Exams Info**: Registration guidelines and schedule details.
*   **Faculty Directory**: Office contacts and department lookups.
*   **Campus Wayfinding**: Navigational aid for classroom and block locations.

### 3. Placement Agent
*   **Resume Guidelines**: Structural tips and ATS formatting recommendations.
*   **Coding Prep**: Algorithmic mock interview practice.
*   **Aptitude Prep**: Sample quantitative, logical, and verbal practice guides.
*   **Interview Coaching**: Behavioral mock interviews and tips.
*   **Company Cut-offs**: Detailed eligibility criteria for campus recruiters.

### 4. Health Agent
*   **Student Wellness**: Hydration advice, Pomodoro guides, and study habit suggestions.
*   **Nutrition Basics**: Budget-friendly meal planning and exam-week snacking guides.
*   **Sleep Hygiene**: Sleep routines and blue-light mitigation tips.
*   **Exercise Guidance**: Dorm-room stretching exercises and workspace ergonomics.
*   **Campus Services**: Operational directories for student clinics and counseling centers.
*   **Emergency Advisory**: Protocols for urgent health concerns and contact numbers.

### 5. Core System Enhancements
*   **Multi-agent Architecture**: Specialized AI agents handling distinct domains seamlessly.
*   **RAG (Retrieval-Augmented Generation)**: Grounded AI responses utilizing a ChromaDB vector database.
*   **Google Gemini Integration**: Advanced reasoning and context handling via Google Gemini.
*   **PostgreSQL (Supabase)**: Robust relational data modeling with connection pooling.
*   **Authentication**: Secure JWT-based session management.
*   **Automatic Bootstrapping**: Automatic event indexing and vector collection initialization on startup.
*   **Clean Backend Logging**: Suppresses noisy Uvicorn and SDK logs while surfacing meaningful application events and errors.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Student[Student] --> Dashboard[Dashboard]
    Dashboard --> AgentRouter[Agent Router]
    AgentRouter --> EventAgent[Event Agent]
    AgentRouter --> SupportAgent[Support Agent]
    AgentRouter --> PlacementAgent[Placement Agent]
    AgentRouter --> HealthAgent[Health Agent]
    EventAgent --> RAGPipeline[RAG Pipeline]
    SupportAgent --> RAGPipeline
    PlacementAgent --> RAGPipeline
    HealthAgent --> RAGPipeline
    RAGPipeline --> ChromaDB[(ChromaDB)]
    ChromaDB --> Gemini[Gemini]
    Gemini --> Database[(Database)]
```

---

## 📂 Project Structure

```text
Campus-AI/
├── backend/                  # FastAPI Backend Server
│   ├── agents/               # Multi-Agent Modules
│   │   ├── event_agent/      # Event Discovery & Planning Agent
│   │   ├── health_agent/     # Student Wellness RAG Agent
│   │   ├── placement_agent/  # Placements & Career RAG Agent
│   │   └── support_agent/    # Academic Support RAG Agent
│   ├── alembic/              # Database Migrations (Alembic)
│   ├── api/                  # API Routers and Schemas
│   ├── data/                 # JSON Knowledge Bases for indexing
│   │   ├── health/           # Wellness & Emergency guidance docs
│   │   ├── placement/        # Resumes & Recruiter parameters
│   │   └── support/          # University rules and wayfinding maps
│   ├── services/             # Core DB interfaces & Gemini AI callers
│   ├── tests/                # Backend Test Suite
│   └── main.py               # Backend main server entrypoint
├── src/                      # Next.js Frontend Client
│   ├── app/                  # Pages Router (Dashboard, Agent Chats, Signup)
│   ├── components/           # React shared visual blocks
│   │   ├── chat/             # UI elements (ChatBox, MessageBubble)
│   │   └── layout/           # Shared views (Navbar, Containers)
│   └── lib/                  # Local storage persistent session handles
```

---

## 💻 Technology Stack

### Frontend
| Component | Technologies |
| :--- | :--- |
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, PostCSS |
| Libraries | Axios, HTML5-QRCode, QRCode.React, React 19.1 |

### Backend
| Component | Technologies |
| :--- | :--- |
| Framework | FastAPI |
| Web Server | Uvicorn |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Security | JSON Web Tokens (JWT), Bcrypt hashing, Python-jose |

### AI
| Component | Technologies |
| :--- | :--- |
| Models | Google Gemini API (gemini-2.0-flash) |
| Embeddings | Google Gemini Embedding API |
| Vector Store | ChromaDB |
| Pattern | Retrieval-Augmented Generation (RAG) |

### Database
| Environment | Technologies |
| :--- | :--- |
| Development & Production | PostgreSQL (Supabase with Session Pooler) |

### Authentication
| Component | Technologies |
| :--- | :--- |
| Tokens | JWT Authentication |
| Transport | HTTP-Only Cookies |

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CampusAI.git
cd CampusAI
```

### 2. Backend Setup
1. Create a Python virtual environment and activate it:
   ```bash
   # Windows:
   python -m venv .venv
   .venv\Scripts\activate
   
   # macOS/Linux:
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Create the backend environment variables file (`backend/.env`) from the example:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Note: Open `backend/.env` and fill in your Supabase connection and Gemini API key.*

4. Run database migrations:
   ```bash
   cd backend
   alembic upgrade head
   cd ..
   ```
   *Note: The project uses PostgreSQL via Supabase. Schema is managed entirely through Alembic migrations. Developers should NEVER manually create database tables.*

5. Start the FastAPI backend:
   ```bash
   python -m uvicorn backend.main:app --reload --reload-dir backend --no-access-log
   ```

### 3. Frontend Setup
1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Configure frontend environment variables (`.env.local`):
   ```ini
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection URI string (use Supabase Session Pooler URL). | `postgresql://user:pass@db.projectref.supabase.co:5432/postgres` |
| `GEMINI_API_KEY` | Developer access token to invoke Google Gemini models. | `AIzaSy...` |
| `SECRET_KEY` | Secret cryptographic key used to sign and verify user JWT sessions. | `your_secure_random_secret_key_here` |
| `GEMINI_MODEL` | (Optional) Gemini model version to use. | `gemini-2.5-flash` |
| `CHROMA_PATH` | (Optional) Custom path to store ChromaDB collections. | `./chroma_db` |
| `FRONTEND_URL` | (Optional) Base URL for frontend CORS policy. | `http://localhost:3000` |

### Frontend (`.env.local`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL pointing to the FastAPI backend microservice. | `http://localhost:8000` |

---

## 🔄 Development Workflow

When contributing to CampusAI, follow this standard development workflow:

### First-time setup
1. Clone the repository
2. Install Python and Node requirements
3. Create `.env` files for backend and frontend
4. Run migrations (`alembic upgrade head`)
5. Start both servers

### After pulling latest changes
Always ensure your database schema is up-to-date and dependencies are installed:
```bash
git pull
cd backend
alembic upgrade head
```

### Creating a migration
Whenever you modify SQLAlchemy ORM models (`backend/models.py`), generate a new migration script:
```bash
cd backend
alembic revision --autogenerate -m "description_of_your_changes"
```
Once the migration script is created, commit it to version control:
```bash
git add alembic/versions
git commit -m "chore: add db migration for [feature]"
git push
```
*Reminder: Never manually alter tables in the database.*

---

## 🔌 API Overview

*   `/auth`: Handles user session flows including registration (`POST /signup`), authentication (`POST /login`), and token verification.
*   `/events`: CRUD operations for event lists, RSVP registration, and checking attendee tickets.
*   `/chat`: Core chat router endpoint (`POST /chat`) which intercepts the target query payload and routes it using the `agent_type` parameter (options: `"event"`, `"support"`, `"placement"`, `"health"`).
*   `/profile`: Gets and updates student information, saved events, and profile tags.
*   `/recommendations`: Generates personalized event recommendations matching the student's skills.
*   `/tickets`: Serves generated digital tickets with embedded QR codes.

---

## 🧠 AI Architecture

*   **Agent Router**: A central static handler (`AgentRouter`) that checks incoming request metadata and routes the conversation message to the appropriate service module.
*   **Specialized Agents**: 4 distinct RAG-based systems configured with specialized prompts (`EVENT_AGENT_PROMPT`, `SUPPORT_AGENT_PROMPT`, `PLACEMENT_AGENT_PROMPT`, `HEALTH_AGENT_PROMPT`) to enforce strict content boundaries.
*   **Shared AI Service**: Reusable core module (`generate_ai_response`) that interacts with the `gemini-2.0-flash` API using structural system prompts.
*   **Retrieval-Augmented Generation**: Enhances LLM prompts by injecting localized database query matches retrieved from the vector store on each request.
*   **Vector Search**: Uses ChromaDB to generate and query high-dimensional embeddings for local policies and guidelines.
*   **Session Persistence**: Maintains conversation state and recent session IDs inside front-end local storage wrappers.

---

## 🧪 Testing

### Interactive API Docs (Swagger UI)
FastAPI automatically compiles and serves interactive Swagger documentation. Access the UI at:
`http://localhost:8000/docs`

### Backend Testing & Import Validation
Verify file setups and database indexing tasks using:
```bash
python -c "import dotenv; dotenv.load_dotenv('backend/.env'); from backend import main"
```

### Frontend Linting
Check code quality and React hook rules:
```bash
npm run lint
```

### Manual Verification
1. Open the UI, log in, and navigate to `/agents/health`.
2. Select any wellness prompt shortcut (e.g., *Campus Clinic*).
3. Inspect network panels to verify the payload includes `{"agent_type": "health"}` and returns correct responses containing medical boundaries and disclaimer notes.

---

## 🗺️ Roadmap

### Completed
- [x] Event Agent (RSVP, QR Check-In, Recommendations)
- [x] Support Agent (Academic & Wayfinding Policies)
- [x] Placement Agent (Coding, Aptitude & Career Prep)
- [x] Health Agent (Student Wellness, Nutrition & Safety)

### In Progress
- [ ] Admin Analytics
- [ ] Calendar Integration

### Future
- [ ] Push Notifications
- [ ] Mobile Application

---

## 🤝 Contributing

We welcome contributions! To ensure a smooth development experience:

1. **Fork the repository** and clone it locally.
2. **Follow the [Development Workflow](#-development-workflow)** to correctly set up your local environment, install dependencies, and apply database migrations.
3. **Create your feature branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
4. **Commit your changes**:
   Make sure to follow conventional commit standards.
   ```bash
   git commit -m "feat: add some AmazingFeature"
   ```
5. **Push your branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request** with a detailed description of your changes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
