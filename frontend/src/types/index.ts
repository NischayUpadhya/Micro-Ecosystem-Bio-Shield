export type EcologicalStatus = 
  | "Native"
  | "Non-native"
  | "Potentially invasive"
  | "Uncertain — expert verification required";

export type DataCategory =
  | "DEMO DATA"
  | "AI-generated"
  | "Observed field data"
  | "Expert-verified information"
  | "Recommendation/inference";

export interface RAGSource {
  source_title: string;
  source_organization: string;
  region: string;
  url_or_reference: string;
  verification_status: string;
  excerpt: string;
  confidence_alignment: number;
  title?: string;
  citation_ref?: string;
}

export interface ReplacementPlant {
  common_name: string;
  scientific_name: string;
  pollinator_benefit: string;
  sun_exposure: string;
  moisture_need: string;
  regional_suitability?: string;
  verification_status?: string;
}

export interface PlantAnalysisResult {
  common_name: string;
  scientific_name: string;
  confidence: number;
  ecological_status: EcologicalStatus;
  status_explanation: string;
  safe_management: string[];
  replacement_suggestions: ReplacementPlant[];
  replacement_disclaimer?: string;
  uncertainty_warning?: string;
  rag_sources: RAGSource[];
  is_mock: boolean;
  demo_ai_notice: string;
  data_category: DataCategory;
  regional_context: string;
  knowledge_status: string;
  notice: string;
}

export interface Observation {
  id: number;
  plant_name: string;
  scientific_name: string;
  ecological_status: EcologicalStatus;
  confidence: number;
  latitude: number;
  longitude: number;
  date_observed: string;
  notes?: string;
  image_url?: string;
  verified_by_expert: boolean;
  is_demo: boolean;
  data_category?: DataCategory;
  created_at?: string;
}

export interface ObservationCreateInput {
  plant_name: string;
  scientific_name: string;
  ecological_status: EcologicalStatus;
  confidence: number;
  latitude: number;
  longitude: number;
  date_observed: string;
  notes?: string;
  image_url?: string;
  verified_by_expert?: boolean;
}

export interface KnowledgeDoc {
  id: number;
  title: string;
  scientific_name: string;
  native_status: string;
  risk_tier: string;
  botanical_description: string;
  safe_management: string;
  replacement_species: string;
  source_organization: string;
  region: string;
  url_or_reference: string;
  verification_status: string;
}

export interface CorridorZone {
  id: string;
  zone_name: string;
  coordinates: [number, number][];
  priority: string;
  connectivity_gap_meters: number;
  rationale: string;
  recommended_species: ReplacementPlant[];
  estimated_biodiversity_uplift: string;
  data_category?: DataCategory;
  disclaimer: string;
}

export interface HotspotZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  native_species_count: number;
  pollinator_activity_tier: string;
  description: string;
  data_category?: DataCategory;
}

export interface DesertZone {
  id: string;
  name: string;
  center: [number, number];
  radius: number;
  vegetation_type: string;
  native_flora_percent: number;
  rationale: string;
  data_category?: DataCategory;
}

export interface CorridorAnalysisResponse {
  total_corridor_opportunities: number;
  habitat_fragmentation_index: number;
  active_hotspots_count: number;
  ecological_deserts_count: number;
  potential_corridors: CorridorZone[];
  hotspot_zones: HotspotZone[];
  desert_zones: DesertZone[];
  data_category?: DataCategory;
}

export interface DashboardStats {
  total_observations: number;
  invasive_count: number;
  native_count: number;
  non_native_count: number;
  uncertain_count: number;
  hotspots_count: number;
  ecological_deserts_count: number;
  corridor_opportunities_count: number;
  status_distribution: Record<string, number>;
  monthly_trend: {
    month: string;
    observations: number;
    native: number;
    invasive: number;
  }[];
  recent_observations: Observation[];
  regional_context?: string;
  demo_data_notice?: string;
}

export interface SamplePlant {
  sample_id: string;
  common_name: string;
  scientific_name: string;
  confidence: number;
  ecological_status: EcologicalStatus;
  sample_image: string;
  notes: string;
}
