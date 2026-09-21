# MICRO-ECOSYSTEM BIO-SHIELD
### AI-Driven Campus Invasive Flora & Pollinator Corridor Protection

> **Primary SDG**: SDG 15 – Life on Land  
> **Secondary SDG**: SDG 11 – Sustainable Cities and Communities  
> **Target Users**: Campus estate & groundskeeping teams, Student eco-clubs, Campus sustainability committees

---

## Overview
**Micro-Ecosystem Bio-Shield** is an AI-powered campus biodiversity protection platform designed to:
1. Identify potentially invasive flora using multimodal AI with explicit confidence meters.
2. Ground ecological status in verified regional botanical knowledge using a modular RAG architecture.
3. Deliver safe, responsible management guidance (prioritizing non-chemical, physical containment and strictly blocking harmful chemical sprays).
4. Record and geo-reference biodiversity observations on an interactive campus GIS map.
5. Provide a **Pollinator Corridor Assistant** to model potential restoration stepping stones connecting fragmented campus habitats.
6. Provide a conversational **AI Sustainability Assistant** for students and staff.
7. Maintain scientific transparency through a dedicated **Responsible AI & Governance Center**.

---

## Project Structure
```
Micro-Ecosystem-Bio-Shield/
├── backend/                    # Python + FastAPI + SQLite
│   ├── app/
│   │   ├── main.py             # FastAPI entrypoint, endpoints, and CORS
│   │   ├── database.py         # SQLite connection & schema initialization
│   │   ├── schemas.py          # Pydantic data schemas & models
│   │   ├── data/seed_data.py   # Campus demo observations & botanical knowledge corpus
│   │   └── services/
│   │       ├── plant_identifier.py       # Multimodal vision interface with confidence calibration
│   │       ├── rag_service.py            # RAG retriever with citation extraction & fallback
│   │       ├── recommendation_service.py # Non-chemical stewardship & native replacements
│   │       ├── corridor_service.py       # Spatial connectivity & restoration corridor algorithm
│   │       └── chat_service.py           # Grounded sustainability conversational assistant
│   ├── campus_biodiversity.db  # SQLite database
│   └── requirements.txt
│
└── frontend/                   # React + TypeScript + Vite + Tailwind CSS + Leaflet
    ├── src/
    │   ├── components/         # Sidebar, Header, AddObservationModal
    │   ├── pages/
    │   │   ├── Dashboard.tsx            # KPIs, Recharts donut & area charts, observation feed
    │   │   ├── PlantScanner.tsx         # Image upload, test gallery, confidence meter, RAG advice
    │   │   ├── CampusMap.tsx            # Interactive Leaflet GIS map with custom markers & layers
    │   │   ├── CorridorAssistant.tsx    # Spatial corridor assistant & planting guide
    │   │   ├── KnowledgeRAG.tsx         # Searchable botanical corpus & interactive RAG tester
    │   │   ├── SustainabilityChat.tsx   # Grounded conversational assistant with citations
    │   │   └── ResponsibleAI.tsx        # Ethics, fairness, accuracy, uncertainty & safety
    │   ├── services/api.ts     # Typed fetch client connecting to FastAPI
    │   ├── types/index.ts      # TypeScript interfaces
    │   ├── App.tsx             # Root layout & tab routing
    │   └── index.css           # Tailwind v4 & Leaflet styling
    ├── vite.config.ts          # Vite configuration with backend proxy
    └── package.json
```

---

## Quickstart Guide

### 1. Start the Backend API
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base: `http://127.0.0.1:8000`
- Interactive API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Open browser at: `http://127.0.0.1:5173`

---

## Core Responsible AI Rules Enforced
1. **Uncertainty Guardrail**: Plants with confidence below 70% or ambiguous morphology trigger *"Uncertain – expert verification required"*. The system never speculates or prematurely declares invasive status.
2. **Non-Chemical Priority**: Management guidance prioritizes manual root pulling, solarization tarps, and native replanting. Indiscriminate chemical spray advice is blocked.
3. **Transparent Decision Support**: Corridor pathways are explicitly designated as *"Potential Pollinator Corridors"* or *"Potential Restoration Zones"*, clearly noting they represent vegetation continuity models, not empirical insect flight tracking.
4. **Separation of Concerns**: Empirical field observations are clearly distinguished from AI-modeled restoration zones on the map.
5. **DEMO DATA Badge**: All initial demonstration data is visibly labeled as sample campus data.
