import math
from typing import List, Dict, Any
from app.database import fetch_all_observations, fetch_all_corridors
from app.data.seed_data import HOTSPOT_ZONES, DESERT_ZONES
from app.schemas import CorridorAnalysisResponse, CorridorZone, ReplacementPlant

class CorridorService:
    """
    Spatial biodiversity analysis service that detects habitat fragmentation,
    evaluates native pollinator anchor clusters, and calculates candidate
    restoration pathways.
    
    IMPORTANT: All outputs are framed as 'Potential Pollinator Corridors' or
    'Potential Restoration Zones' to reflect predictive decision support
    rather than empirical insect flight telemetry.
    """

    def analyze_campus_connectivity(self) -> CorridorAnalysisResponse:
        observations = fetch_all_observations()
        corridors_data = fetch_all_corridors()

        native_count = sum(1 for o in observations if o["ecological_status"] == "Native")
        invasive_count = sum(1 for o in observations if o["ecological_status"] == "Potentially invasive")
        total_count = max(len(observations), 1)

        # Fragmentation index: higher when native plants are outnumbered or clustered tightly with gaps
        native_ratio = native_count / total_count
        fragmentation_index = round(max(0.15, min(0.85, 1.0 - (native_ratio * 0.8) + (invasive_count * 0.03))), 2)

        potential_corridors: List[CorridorZone] = []
        for c in corridors_data:
            recs = [ReplacementPlant(**item) for item in c["recommended_species"]]
            potential_corridors.append(CorridorZone(
                id=c["id"],
                zone_name=c["zone_name"],
                coordinates=c["coordinates"],
                priority=c["priority"],
                connectivity_gap_meters=c["connectivity_gap_meters"],
                rationale=c["rationale"],
                recommended_species=recs,
                estimated_biodiversity_uplift=c["estimated_biodiversity_uplift"],
                disclaimer="POTENTIAL POLLINATOR CORRIDOR: Model estimate based on vegetation continuity; does not measure real-time insect movement."
            ))

        return CorridorAnalysisResponse(
            total_corridor_opportunities=len(potential_corridors),
            habitat_fragmentation_index=fragmentation_index,
            active_hotspots_count=len(HOTSPOT_ZONES),
            ecological_deserts_count=len(DESERT_ZONES),
            potential_corridors=potential_corridors,
            hotspot_zones=HOTSPOT_ZONES,
            desert_zones=DESERT_ZONES
        )

corridor_service = CorridorService()
