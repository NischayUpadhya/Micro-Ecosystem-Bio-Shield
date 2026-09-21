import os
import sqlite3
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.database import (
    init_db,
    fetch_all_observations,
    insert_observation,
    fetch_knowledge_docs,
    get_db_connection
)
from app.schemas import (
    ObservationCreate,
    ObservationResponse,
    PlantAnalysisRequest,
    PlantAnalysisResponse,
    KnowledgeDocResponse,
    KnowledgeQueryRequest,
    KnowledgeQueryResponse,
    CorridorAnalysisResponse,
    ChatRequest,
    ChatResponse,
    DashboardStats
)
from app.services.plant_identifier import plant_identifier_service
from app.services.rag_service import rag_service
from app.services.corridor_service import corridor_service
from app.services.chat_service import chat_service
from app.data.seed_data import SAMPLE_SCAN_PLANTS, HOTSPOT_ZONES, DESERT_ZONES

# Initialize database schema and seeds with Bengaluru data
init_db(force_reseed=True)

app = FastAPI(
    title="Micro-Ecosystem Bio-Shield API",
    description="AI-Driven Campus Invasive Flora & Pollinator Corridor Protection Backend (Bengaluru Context)",
    version="1.1.0"
)

# Enable CORS for local Vite development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "Micro-Ecosystem Bio-Shield",
        "regional_context": "India / Bengaluru Campus (Karnataka)",
        "sdg_primary": "SDG 15 - Life on Land",
        "sdg_secondary": "SDG 11 - Sustainable Cities and Communities",
        "mode": "PROTOTYPE / DEMO"
    }

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    observations = fetch_all_observations()
    
    status_counts = {
        "Native": 0,
        "Potentially invasive": 0,
        "Non-native": 0,
        "Uncertain — expert verification required": 0
    }
    
    for obs in observations:
        st = obs["ecological_status"]
        if "Uncertain" in st:
            status_counts["Uncertain — expert verification required"] += 1
        elif st in status_counts:
            status_counts[st] += 1
        else:
            status_counts["Uncertain — expert verification required"] += 1

    corridors = corridor_service.analyze_campus_connectivity()

    # Synthetic monthly survey cadence
    monthly_trend = [
        {"month": "May", "observations": 3, "native": 2, "invasive": 1},
        {"month": "Jun", "observations": 5, "native": 3, "invasive": 1},
        {"month": "Jul", "observations": 7, "native": 5, "invasive": 2},
        {"month": "Aug", "observations": 8, "native": 5, "invasive": 3},
        {"month": "Sep", "observations": len(observations), "native": status_counts["Native"], "invasive": status_counts["Potentially invasive"]}
    ]

    return DashboardStats(
        total_observations=len(observations),
        invasive_count=status_counts["Potentially invasive"],
        native_count=status_counts["Native"],
        non_native_count=status_counts["Non-native"],
        uncertain_count=status_counts["Uncertain — expert verification required"],
        hotspots_count=len(HOTSPOT_ZONES),
        ecological_deserts_count=len(DESERT_ZONES),
        corridor_opportunities_count=corridors.total_corridor_opportunities,
        status_distribution=status_counts,
        monthly_trend=monthly_trend,
        recent_observations=[ObservationResponse(**obs) for obs in observations[:6]],
        regional_context="Bengaluru Campus (Karnataka, India)",
        demo_data_notice="DEMO DATA"
    )

@app.get("/api/observations", response_model=List[ObservationResponse])
def get_observations(status: Optional[str] = Query(None), search: Optional[str] = Query(None)):
    observations = fetch_all_observations()
    
    if status and status != "all":
        s_lower = status.lower()
        observations = [
            o for o in observations 
            if s_lower in o["ecological_status"].lower()
        ]
        
    if search:
        s = search.lower()
        observations = [
            o for o in observations 
            if s in o["plant_name"].lower() or s in o["scientific_name"].lower() or s in (o.get("notes") or "").lower()
        ]

    return [ObservationResponse(**obs) for obs in observations]

@app.post("/api/observations", response_model=ObservationResponse)
def create_observation(obs_in: ObservationCreate):
    data = obs_in.model_dump()
    new_obs = insert_observation(data)
    return ObservationResponse(**new_obs)

@app.get("/api/observations/{obs_id}", response_model=ObservationResponse)
def get_observation_by_id(obs_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM observations WHERE id = ?", (obs_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Observation not found")
    data = dict(row)
    data["verified_by_expert"] = bool(data["verified_by_expert"])
    data["is_demo"] = bool(data["is_demo"])
    return ObservationResponse(**data)

@app.delete("/api/observations/{obs_id}")
def delete_observation(obs_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM observations WHERE id = ?", (obs_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Observation {obs_id} deleted"}

@app.post("/api/analyze-plant", response_model=PlantAnalysisResponse)
def analyze_plant(request: PlantAnalysisRequest):
    return plant_identifier_service.identify(request)

@app.get("/api/samples")
def get_sample_plants():
    return SAMPLE_SCAN_PLANTS

@app.get("/api/knowledge", response_model=List[KnowledgeDocResponse])
def list_knowledge_docs():
    docs = fetch_knowledge_docs()
    return [KnowledgeDocResponse(**d) for d in docs]

@app.post("/api/knowledge/query", response_model=KnowledgeQueryResponse)
def query_knowledge(req: KnowledgeQueryRequest):
    return rag_service.query_knowledge_base(req.query, threshold=req.threshold or 0.40)

@app.get("/api/corridors", response_model=CorridorAnalysisResponse)
def get_corridors():
    return corridor_service.analyze_campus_connectivity()

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    return chat_service.process_query(req)
