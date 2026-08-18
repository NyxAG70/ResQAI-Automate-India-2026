# ResQAI — AI-Powered Disaster Response & Rescue Intelligence

**Team:** STRYKEE  
**Members:**

- Ayush Gupta — Team Leader
- Ayush Kumar — Team Member

## 1. Project Overview

ResQAI is a disaster-response intelligence platform concept for helping human responders organize incoming incident reports and make calmer, better-informed decisions under pressure.

This repository is the **initial foundation build** prepared for the first public development snapshot. It is not the final MVP. Development will continue before the final hackathon evaluation.

## 2. Problem Statement

During disasters, reports arrive quickly, inconsistently, and from many locations. Responders need a reliable way to capture incident context, identify what needs attention, and hand structured information to a human decision-maker.

## 3. Proposed Solution

The planned ResQAI workflow is:

1. A person submits an incident report.
2. The platform structures the report.
3. AI extracts response-relevant signals.
4. A deterministic priority engine produces a transparent score.
5. Responders review incidents on an operations dashboard and map.
6. A human decides and updates the incident status.

The current snapshot contains the foundation for this workflow, not the complete workflow itself.

## 4. Current Development Status

### Implemented

- ResQAI branding and foundation landing page
- Responsive visual foundation and navigation
- `/report` route with a clearly marked report-flow placeholder
- Express API server with `/api/healthz`
- OpenAPI incident lifecycle contract
- Generated TypeScript API client and Zod validators
- PostgreSQL/Drizzle incident schema and migration
- Validated incident API endpoints for create, list, retrieve, and status update
- Standalone deterministic priority engine with unit tests
- API integration tests for incident lifecycle and invalid input

### In development

- Functional incident report form
- Connecting the React interface to the incident API
- End-to-end persistence from the user interface
- AI-assisted incident analysis
- Connecting analyzed signals to the priority engine
- Responder operations dashboard
- Incident details and human status workflow

### Planned / future

- Leaflet + OpenStreetMap incident map
- Image upload and evidence handling
- AI provider integration and failure states
- Demo data and presentation mode
- Authentication, authorization, rate limiting, and production security hardening
- Notifications and responder handoff workflows

## 5. Current Foundation Features

The current user-visible experience is intentionally small: a branded foundation page explains the product direction, navigation links to the report preview, and the report route explains that the functional flow is still in development.

The backend foundation can already validate and persist incident lifecycle records independently of the unfinished frontend workflow.

## 6. Planned MVP Workflow

```text
Incident report
      ↓
Structured extraction
      ↓
AI analysis
      ↓
Deterministic priority score
      ↓
Responder dashboard + map
      ↓
Human review and status decision
```

## 7. Technology Stack

- Frontend: React + Vite
- Backend: Express 5
- Database: PostgreSQL + Drizzle ORM
- Validation: Zod 4 and drizzle-zod
- API contract/code generation: OpenAPI + Orval
- Planned map: Leaflet + OpenStreetMap
- Workspace: pnpm monorepo
- Runtime: Node.js 24
- Language: TypeScript

## 8. Project Structure

```text
artifacts/
  api-server/       Express API and incident routes
  resqai/           React/Vite foundation application
  mockup-sandbox/   Optional component design preview workspace
lib/
  api-spec/         OpenAPI contract and Orval configuration
  api-client-react/ Generated React API client
  api-zod/          Generated Zod validators
  db/               Drizzle schema and migrations
scripts/            Workspace maintenance scripts
```

## 9. Setup Instructions

### Prerequisites

- Node.js 24
- pnpm
- PostgreSQL

Clone the repository, then install dependencies:

```bash
pnpm install
```

Copy the example environment file and replace only the local placeholder values:

```bash
cp .env.example .env
```

`DATABASE_URL` is required for the API, database commands, and integration tests. `PORT` is required by both application services. `BASE_PATH` is required by the Vite frontend.

## 10. Environment Variables

| Variable | Required for | Example |
| --- | --- | --- |
| `DATABASE_URL` | API, migrations, integration tests | `postgresql://user:password@localhost:5432/resqai` |
| `PORT` | API or frontend process | `8080` |
| `BASE_PATH` | Frontend process | `/` |
| `AI_API_KEY` | Future AI integration only | Placeholder until AI is implemented |

Never commit `.env` or real credentials. Use `.env.example` only for placeholders.

## 11. How to Run

Run the API and frontend in separate terminals.

### API server

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/resqai"
export PORT=8080
pnpm --filter @workspace/db run migrate
pnpm --filter @workspace/api-server run dev
```

The API is served under `/api`, including `GET /api/healthz`.

### Frontend

```bash
export PORT=5173
export BASE_PATH=/
pnpm --filter @workspace/resqai run dev
```

The API `dev` command builds before starting the server; it is not a file-watch command.

### Useful checks

```bash
pnpm run typecheck
PORT=5173 BASE_PATH=/ pnpm run build
pnpm --filter @workspace/api-server run test
pnpm --filter @workspace/api-spec run codegen
```

The API integration tests use the configured PostgreSQL database and the applied Drizzle schema.

## 12. Planned MVP Features

The remaining MVP work is intentionally not represented as completed functionality:

- Incident report form with validation
- AI analysis of incident descriptions and optional evidence
- Transparent priority scoring from structured factors
- Operations dashboard with filters and status controls
- GIS map with incident markers
- Incident detail and human review workflow

## 13. Future Scope

Potential future extensions include multilingual reporting, offline-first field capture, responder notifications, audit history, role-based access, regional deployment, and evaluation tooling for AI extraction quality.

## 14. Team

### STRYKEE

- Ayush Gupta — Team Leader
- Ayush Kumar — Team Member

This repository is an honest initial development snapshot. It should not be interpreted as a claim that the final ResQAI MVP is complete.