from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Ecological Status constants
ECOLOGICAL_STATUS_NATIVE = "Native"
ECOLOGICAL_STATUS_NON_NATIVE = "Non-native"
ECOLOGICAL_STATUS_INVASIVE = "Potentially invasive"
ECOLOGICAL_STATUS_UNCERTAIN = "Uncertain — expert verification required"

class RAGSource(BaseModel):
    source_title: str
    source_organization: str
    region: str = "India / Karnataka / Bengaluru Urban"
    url_or_reference: str
    verification_status: str = "Prototype reference — not yet connected to live verified knowledge."
    excerpt: str
    confidence_alignment: float = 0.90
    
    # Backwards compatibility properties
    @property
    def title(self) -> str:
        return self.source_title

    @property
    def citation_ref(self) -> str:
        return f"{self.source_organization} ({self.region})"

class ReplacementPlant(BaseModel):
    common_name: str
    scientific_name: str
    pollinator_benefit: str
    sun_exposure: str
    moisture_need: str
    regional_suitability: str = "Bengaluru / South India Native or Adapted"
    verification_status: str = "Prototype recommendation — expert verification required"

class PlantAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    sample_id: Optional[str] = None
    user_notes: Optional[str] = None
    simulated_low_confidence: Optional[bool] = False

class PlantAnalysisResponse(BaseModel):
    common_name: str
    scientific_name: str
    confidence: float
    ecological_status: str
    status_explanation: str
    safe_management: List[str]
    replacement_suggestions: List[ReplacementPlant]
    replacement_disclaimer: Optional[str] = None
    uncertainty_warning: Optional[str] = None
    rag_sources: List[RAGSource]
    is_mock: bool = True
    demo_ai_notice: str = "DEMO AI RESULT — simulated for prototype"
    data_category: str = "AI-generated"
    regional_context: str = "India / Bengaluru Campus"
    knowledge_status: str = "Prototype knowledge — expert verification required."
    notice: str = "PROTOTYPE AI RESULT: Grounded in prototype botanical data; confirmation with campus botanist or estate officer is required before any physical stewardship action."

class ObservationBase(BaseModel):
    plant_name: str
    scientific_name: str
    ecological_status: str
    confidence: float
    latitude: float
    longitude: float
    date_observed: str
    notes: Optional[str] = None
    image_url: Optional[str] = None
    verified_by_expert: bool = False
    is_demo: bool = True
    data_category: str = "Observed field data"

class ObservationCreate(ObservationBase):
    pass

class ObservationResponse(ObservationBase):
    id: int
    created_at: str

class KnowledgeQueryRequest(BaseModel):
    query: str
    threshold: Optional[float] = 0.40

class KnowledgeDocResponse(BaseModel):
    id: int
    title: str
    scientific_name: str
    native_status: str
    risk_tier: str
    botanical_description: str
    safe_management: str
    replacement_species: str
    source_organization: str
    region: str
    url_or_reference: str
    verification_status: str

class KnowledgeQueryResponse(BaseModel):
    query: str
    status: str # "verified" or "insufficient_evidence"
    answer: str
    sources: List[RAGSource]
    expert_verification_required: bool
    data_category: str = "Expert-verified information"

class CorridorZone(BaseModel):
    id: str
    zone_name: str
    coordinates: List[List[float]]
    priority: str
    connectivity_gap_meters: float
    rationale: str
    recommended_species: List[ReplacementPlant]
    estimated_biodiversity_uplift: str
    data_category: str = "Recommendation/inference"
    disclaimer: str = "POTENTIAL POLLINATOR CORRIDOR: Model estimate based on vegetation continuity; does not measure real-time insect movement."

class CorridorAnalysisResponse(BaseModel):
    total_corridor_opportunities: int
    habitat_fragmentation_index: float
    active_hotspots_count: int
    ecological_deserts_count: int
    potential_corridors: List[CorridorZone]
    hotspot_zones: List[Dict[str, Any]]
    desert_zones: List[Dict[str, Any]]
    data_category: str = "Recommendation/inference"

class ChatMessage(BaseModel):
    role: str
    content: str
    sources: Optional[List[RAGSource]] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    query: str

class ChatResponse(BaseModel):
    reply: str
    sources: List[RAGSource]
    expert_verification_suggested: bool = False
    safe_management_flags: List[str] = []
    data_category: str = "AI-generated"

class DashboardStats(BaseModel):
    total_observations: int
    invasive_count: int
    native_count: int
    non_native_count: int
    uncertain_count: int
    hotspots_count: int
    ecological_deserts_count: int
    corridor_opportunities_count: int
    status_distribution: Dict[str, int]
    monthly_trend: List[Dict[str, Any]]
    recent_observations: List[ObservationResponse]
    regional_context: str = "Bengaluru Campus (Karnataka, India)"
    demo_data_notice: str = "DEMO DATA"
