from typing import Dict, Any, Optional
from app.schemas import (
    PlantAnalysisRequest,
    PlantAnalysisResponse,
    ECOLOGICAL_STATUS_NATIVE,
    ECOLOGICAL_STATUS_NON_NATIVE,
    ECOLOGICAL_STATUS_INVASIVE,
    ECOLOGICAL_STATUS_UNCERTAIN
)
from app.services.rag_service import rag_service
from app.services.recommendation_service import recommendation_service

# Modular base interface for future multimodal plug-in
class BasePlantIdentifier:
    def identify(self, request: PlantAnalysisRequest) -> PlantAnalysisResponse:
        raise NotImplementedError

class MockPlantIdentifier(BasePlantIdentifier):
    """
    Mock multimodal plant analysis implementation for prototype evaluation.
    Enforces strict Responsible AI rules:
    - Never declares invasive status when confidence is low or morphology is ambiguous.
    - Explicitly labels all outputs as 'DEMO AI RESULT — simulated for prototype'.
    - When simulated low confidence is active, strictly outputs 'Uncertain — expert verification required'.
    """

    SAMPLE_CATALOG = {
        "sample-knotweed": {
            "common_name": "Japanese Knotweed",
            "scientific_name": "Reynoutria japonica",
            "confidence": 0.94,
            "status": ECOLOGICAL_STATUS_INVASIVE,
            "explanation": "Simulated prototype diagnosis: Characteristic hollow bamboo-like zigzag stems with reddish nodes and spade-shaped leaves. Flagged as a high-threat invasive species with aggressive rhizomatous expansion.",
            "next_step": "Log observation on campus GIS map; alert campus grounds team for physical containment sheeting. Avoid mowing or synthetic chemical sprays."
        },
        "sample-ivy": {
            "common_name": "English Ivy",
            "scientific_name": "Hedera helix",
            "confidence": 0.91,
            "status": ECOLOGICAL_STATUS_INVASIVE,
            "explanation": "Simulated prototype diagnosis: Evergreen woody climbing vine with distinct 3-5 lobed waxy leaves and pale veins. Poses mechanical load risk to mature campus shade trees and blankets native ground vegetation.",
            "next_step": "Execute chest-height window pruning to sever canopy climbing vines; hand-pull ground runners while protecting tree root zones."
        },
        "sample-milkweed": {
            "common_name": "Common Milkweed",
            "scientific_name": "Asclepias syriaca",
            "confidence": 0.96,
            "status": ECOLOGICAL_STATUS_NATIVE,
            "explanation": "Simulated prototype diagnosis: Keystone native pollinator host plant. Exhibits opposite velvety oval leaves with pinkish midribs and sweet fragrant globe umbels supporting butterflies and native bees.",
            "next_step": "Demarcate with pollinator conservation stakes to halt mowing; collect mature dry seed pods for campus corridor stepping stones."
        },
        "sample-coneflower": {
            "common_name": "Purple Coneflower",
            "scientific_name": "Echinacea purpurea",
            "confidence": 0.95,
            "status": ECOLOGICAL_STATUS_NATIVE,
            "explanation": "Simulated prototype diagnosis: Robust composite perennial with prominent central spiny copper cones and drooping purple-rose petals. High nectar yield for butterflies and solitary native bees.",
            "next_step": "Preserve standing dried seed cones through winter for foraging bird species; use as an anchor in sunny campus pollinator beds."
        },
        "sample-uncertain": {
            "common_name": "Unidentified Wild Herb",
            "scientific_name": "Amaranthus cf. hybridus / sp.",
            "confidence": 0.54,
            "status": ECOLOGICAL_STATUS_UNCERTAIN,
            "explanation": "Simulated prototype diagnosis: Ambiguous morphological characteristics with overlapping vegetative traits. Insufficient optical or botanical evidence to make a definitive ecological determination.",
            "next_step": "Uncertain — expert verification required. Do NOT classify as invasive or initiate eradication. Submit specimen photos to the Campus Botany Department for on-site taxonomic review."
        }
    }

    def identify(self, request: PlantAnalysisRequest) -> PlantAnalysisResponse:
        # Check if user simulated low optical quality / indeterminate condition
        if request.simulated_low_confidence or request.sample_id == "sample-uncertain":
            selected = self.SAMPLE_CATALOG["sample-uncertain"]
            status = ECOLOGICAL_STATUS_UNCERTAIN
            confidence = 0.52 if request.simulated_low_confidence else selected["confidence"]
        elif request.sample_id and request.sample_id in self.SAMPLE_CATALOG:
            selected = self.SAMPLE_CATALOG[request.sample_id]
            confidence = selected["confidence"]
            status = selected["status"]
        else:
            notes = (request.user_notes or "").lower()
            if "knotweed" in notes or "bamboo" in notes:
                selected = self.SAMPLE_CATALOG["sample-knotweed"]
            elif "ivy" in notes or "vine" in notes:
                selected = self.SAMPLE_CATALOG["sample-ivy"]
            elif "milkweed" in notes:
                selected = self.SAMPLE_CATALOG["sample-milkweed"]
            elif "coneflower" in notes or "purple" in notes:
                selected = self.SAMPLE_CATALOG["sample-coneflower"]
            else:
                selected = self.SAMPLE_CATALOG["sample-knotweed"]

            confidence = selected["confidence"]
            status = selected["status"]

        # Enforce strict uncertainty rule: If confidence < 0.70 or simulated uncertainty active,
        # status MUST strictly be Uncertain and NEVER invasive!
        if confidence < 0.70 or request.simulated_low_confidence:
            status = ECOLOGICAL_STATUS_UNCERTAIN

        # Retrieve RAG sources for scientific name
        rag_res = rag_service.query_knowledge_base(f"{selected['common_name']} {selected['scientific_name']}")
        sources = rag_res.sources

        # Get safe management and native replacement advice
        safe_mgmt, replacements, disclaimer, warning = recommendation_service.get_recommendations_for_species(
            selected["scientific_name"],
            status,
            confidence
        )

        return PlantAnalysisResponse(
            common_name=selected["common_name"],
            scientific_name=selected["scientific_name"],
            confidence=confidence,
            ecological_status=status,
            status_explanation=selected["explanation"],
            safe_management=safe_mgmt,
            replacement_suggestions=replacements,
            replacement_disclaimer=disclaimer,
            uncertainty_warning=warning if warning else None,
            rag_sources=sources,
            is_mock=True,
            demo_ai_notice="DEMO AI RESULT — simulated for prototype",
            data_category="AI-generated",
            regional_context="India / Bengaluru Campus",
            knowledge_status="Prototype knowledge — expert verification required.",
            notice="DEMO AI RESULT — simulated for prototype. Grounded in regional botanical knowledge; always confirm with campus botanist before undertaking removal."
        )

# Instantiate modular service
plant_identifier_service = MockPlantIdentifier()
