# 🚨 ResQAI — AI-Powered Disaster Response & Incident Prioritization

**ResQAI** is a disaster-response platform designed to help emergency responders process incoming incident reports, understand critical information, prioritize victims and incidents, and make faster, better-informed decisions during high-pressure situations.

The platform combines **incident reporting, deterministic priority scoring, AI-assisted analysis, GIS visualization, disaster-image analysis, rescue-zone assignment, and responder decision support** into a unified operational workflow.

> **Built for Automate India 2026**

### 🌐 Live Demo

**https://ResQAI.replit.app**

### 💻 Source Code

**https://github.com/NyxAG70/ResQAI-Automate-India-2026**

---

## 1. 🚨 The Problem

During a disaster, information arrives rapidly from multiple sources and is often incomplete, inconsistent, or difficult to prioritize.

Emergency responders may have to simultaneously determine:

* Where incidents are occurring
* Which victims require immediate assistance
* How severe each incident is
* What hazards are present
* Which areas require rescue resources
* What action should be taken first

Traditional workflows can make this difficult because information is fragmented across reports, maps, images, and communication channels.

### The core problem

> **How can we transform scattered disaster information into structured, prioritized, and actionable intelligence for human responders?**

---

# 2. 💡 Our Solution

ResQAI provides a centralized disaster-response workflow:

```text
Citizen / Incident Report
          ↓
Incident Structuring
          ↓
Signal & Hazard Analysis
          ↓
Deterministic Priority Engine
          ↓
Severity / Victim Prioritization
          ↓
GIS Operations Dashboard
          ↓
AI-Assisted Summary & Recommendation
          ↓
Human Responder Decision
```

The system does **not replace emergency responders**.

Instead, ResQAI acts as a **decision-support layer**, organizing information and surfacing what deserves attention first.

---

# 3. ⚡ Key Features

## 🆘 Incident Reporting

Responders or citizens can submit incident information including:

* Incident description
* Location
* Latitude / longitude
* Disaster context
* Victim information
* Severity-related information

Submitted incidents can then flow into the operational dashboard.

---

## 🧠 Deterministic Priority Engine

ResQAI uses a transparent priority-scoring system to determine which incidents require greater attention.

The scoring process considers structured response factors rather than producing an unexplained black-box number.

This allows responders to understand **why an incident received a particular priority**.

### Why deterministic scoring?

For emergency response, reproducibility matters.

A responder should be able to understand:

> **What factors caused this incident to become high priority?**

The priority engine therefore remains deterministic and auditable.

---

# 4. 🗺️ GIS Operations Dashboard

The ResQAI dashboard provides geographic context for incoming incidents.

The GIS interface provides:

* Incident markers
* Geographic positioning
* Incident distribution
* Delhi geographic context
* Interactive marker information
* Operational visibility of incoming reports

Instead of viewing incidents as isolated text records, responders can understand **where incidents are concentrated geographically**.

---

# 5. 🖼️ Disaster Image Analysis

ResQAI includes a disaster-image analysis workflow.

An uploaded disaster image can be analyzed to surface structured operational information such as:

* Detected hazards
* Confidence scores
* Rescue-zone assignment
* Response recommendations
* Incident context

The result is presented as **decision-support information** rather than an autonomous emergency decision.

> **Important technical disclosure:** the current demonstration uses deterministic/simulated image-analysis behavior for the prototype workflow. It should not be interpreted as a production computer-vision model.

This keeps the demonstration transparent while establishing the architecture for integration with a production CV model in the future.

---

# 6. 🤖 AI-Assisted Decision Support

ResQAI is designed around a separation between:

### Deterministic priority

Used for:

* Incident scoring
* Priority calculation
* Reproducible response ranking

### AI-assisted interpretation

Used for:

* Incident summaries
* Operational context
* Response recommendations
* Converting structured information into responder-friendly intelligence

This separation is intentional.

The system does not allow an opaque generative model to arbitrarily determine emergency priority.

---

# 7. 📊 Responder Dashboard

The dashboard provides an operational overview of the current incident environment.

It includes information such as:

* Incoming incidents
* Priority levels
* Incident status
* Geographic distribution
* Key response metrics
* Incident summaries
* Recommendations
* Filtering and incident exploration

The goal is to reduce the cognitive load on responders by bringing relevant information into a single interface.

---

# 8. 🔄 End-to-End Workflow

A typical ResQAI workflow looks like this:

### Step 1 — Incident submission

A user reports a disaster incident with relevant information and location.

### Step 2 — Data structuring

The platform converts the incoming information into a structured incident record.

### Step 3 — Signal analysis

Relevant response signals and hazard information are extracted.

### Step 4 — Priority calculation

The deterministic priority engine calculates the incident's response priority.

### Step 5 — Geographic visualization

The incident is displayed within the GIS operations interface.

### Step 6 — AI-assisted interpretation

Structured incident information can be transformed into a concise operational summary and recommendation.

### Step 7 — Human decision

A responder reviews the available information and makes the final operational decision.

```text
REPORT
  │
  ▼
STRUCTURE
  │
  ▼
ANALYZE
  │
  ▼
PRIORITIZE
  │
  ▼
VISUALIZE
  │
  ▼
SUMMARIZE
  │
  ▼
HUMAN DECISION
```

---

# 9. 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │ Citizen / Responder │
                    │      Interface      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Incident API      │
                    │   & Validation      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Incident Persistence│
                    │    PostgreSQL       │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
     ┌─────────────────────┐       ┌─────────────────────┐
     │ Deterministic       │       │ Signal / Image      │
     │ Priority Engine     │       │ Analysis Workflow   │
     └──────────┬──────────┘       └──────────┬──────────┘
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Responder Dashboard │
                    │    + GIS Map        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Human Responder     │
                    │ Decision            │
                    └─────────────────────┘
```

---

# 10. 🛠️ Technology Stack

| Layer           | Technology                        |
| --------------- | --------------------------------- |
| Frontend        | React + Vite                      |
| Backend         | Express 5                         |
| Language        | TypeScript                        |
| Database        | PostgreSQL                        |
| ORM             | Drizzle ORM                       |
| Validation      | Zod                               |
| API Contract    | OpenAPI                           |
| API Client      | Orval-generated TypeScript client |
| GIS             | Leaflet + OpenStreetMap           |
| Runtime         | Node.js                           |
| Package Manager | pnpm                              |
| Deployment      | Replit                            |

---

# 11. 📁 Project Structure

```text
artifacts/
├── api-server/
│   └── Express API and incident routes
│
├── resqai/
│   └── React/Vite frontend application
│
└── mockup-sandbox/
    └── Component/design preview workspace

lib/
├── api-spec/
│   └── OpenAPI contract and code generation
│
├── api-client-react/
│   └── Generated React API client
│
├── api-zod/
│   └── Generated Zod validators
│
└── db/
    └── Drizzle schema and migrations

scripts/
└── Workspace maintenance utilities
```

---

# 12. 🔐 Data & API Layer

ResQAI uses a structured backend architecture for incident lifecycle management.

The API supports operations including:

* Incident creation
* Incident retrieval
* Incident listing
* Incident status updates
* Health checks
* Input validation

The API contract is defined using **OpenAPI**, with generated clients and validation schemas used to maintain consistency between the frontend and backend.

---

# 13. 🧪 Testing & Validation

The project includes validation across multiple layers.

### Backend

* Type checking
* API validation
* Incident lifecycle testing
* Invalid-input testing
* Database integration testing

### Priority Engine

The deterministic priority engine is independently testable to ensure consistent scoring behavior.

### End-to-End Demo Validation

The demonstration workflow validates:

* Incident submission
* API persistence
* Priority recalculation
* Dashboard updates
* Feed updates
* GIS marker updates
* KPI/summary updates
* Filtering
* Marker interaction
* Image-analysis workflow
* Mobile responsiveness

---

# 14. 🎯 Impact

ResQAI is designed around one principle:

> **Emergency response should be information-driven, not information-overloaded.**

By bringing reports, prioritization, geographic context, hazard analysis, and responder recommendations into one platform, ResQAI aims to help emergency teams:

* Identify critical incidents faster
* Reduce information overload
* Understand geographic incident distribution
* Prioritize limited response resources
* Maintain human oversight
* Make more informed operational decisions

---

# 15. 🚀 Innovation

ResQAI combines several response capabilities into a single workflow:

### 1. Transparent prioritization

Priority is generated through deterministic factors rather than an unexplained black-box score.

### 2. Human-in-the-loop AI

AI assists responders rather than autonomously making emergency decisions.

### 3. Geographic intelligence

Incidents are connected to their physical locations through GIS visualization.

### 4. Multi-modal incident context

The platform can incorporate both structured incident reports and disaster imagery into the response workflow.

### 5. Operational focus

Instead of simply detecting disasters, ResQAI focuses on the question:

> **“What should the responder pay attention to first?”**

---

# 16. 🔮 Future Scope

The current system establishes a foundation for further development.

Potential future capabilities include:

* Production-grade computer vision models
* Multilingual incident reporting
* Offline-first field reporting
* Responder notifications
* Role-based access control
* Authentication and authorization
* Audit history
* Resource allocation
* Volunteer coordination
* Citizen SOS integration
* Advanced GIS analytics
* Regional deployment
* Real-time responder handoff
* Model evaluation and monitoring

---

# 17. ⚠️ Prototype & Safety Disclaimer

ResQAI is a **hackathon prototype and decision-support system**.

It is not intended to autonomously control emergency services or replace trained emergency personnel.

Priority scores, summaries, recommendations, and image-analysis outputs should be reviewed by qualified human responders before operational action.

The image-analysis workflow currently demonstrates the intended product behavior using deterministic/simulated analysis rather than claiming production-grade computer vision.

---

# 18. 👥 Team — STRYKEE

### Ayush Gupta

**Team Leader**

### Ayush Kumar

**Team Member**

---

# 19. 🌐 Links

### 🚀 Live Application

**https://ResQAI.replit.app**

### 💻 GitHub Repository

**https://github.com/NyxAG70/ResQAI-Automate-India-2026**

---

# 20. 🏆 Built for Automate India 2026

ResQAI was developed as a disaster-response technology concept focused on combining structured incident intelligence, transparent prioritization, geographic awareness, and human-centered AI assistance.

**The objective is simple:**

> ### Turn chaotic disaster information into actionable response intelligence.

**ResQAI — Observe. Prioritize. Respond. 🚨**
