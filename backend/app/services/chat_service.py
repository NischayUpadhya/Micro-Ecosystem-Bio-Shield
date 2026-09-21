import re
from typing import List, Dict, Any
from app.schemas import ChatRequest, ChatResponse, RAGSource
from app.database import fetch_all_observations
from app.services.rag_service import rag_service
from app.data.seed_data import HOTSPOT_ZONES, DESERT_ZONES

class SustainabilityChatService:
    """
    Conversational assistant for campus biodiversity, ecological stewardship,
    and pollinator corridors in an India/Bengaluru campus context.
    """

    def process_query(self, request: ChatRequest) -> ChatResponse:
        query = request.query.strip().lower()
        observations = fetch_all_observations()

        # 1. Check for questions about observed invasive species

        # Responsible AI Guard: Authorization / Removal requests
        lower = query.lower()
        if (any(word in lower for word in ["authorize","approval","permit","allow","permission","who must approve","who can approve"]) and
            any(word in lower for word in ["remove","eradicate","cut","contain","removal"])):
            disclaimer = ("**Responsible AI Notice:** I am a decision‑support tool and **cannot independently authorize** "
                         "the removal of invasive species. Any removal action must be reviewed and approved by the Campus "
                         "Groundskeeping Lead or a qualified botany expert.")
            rag_res = rag_service.query_knowledge_base(query)
            info = rag_res.answer if rag_res.status == "verified" else ""
            reply = f"{disclaimer}\n\n{info}" if info else disclaimer
            return ChatResponse(
                reply=reply,
                sources=rag_res.sources if rag_res.status == "verified" else [],
                expert_verification_suggested=False,
                safe_management_flags=["Responsible AI Guard"],
                data_category="AI-generated"
            )
        if "invasive" in query or "flagged" in query:
            invasives = [o for o in observations if o["ecological_status"] == "Potentially invasive"]
            names = list({f"{o['plant_name']} (*{o['scientific_name']}*)" for o in invasives})
            
            rag_res = rag_service.query_knowledge_base("invasive species management knotweed ivy lantana")
            
            reply = (
                f"We currently have **{len(invasives)} observations** of potentially invasive flora recorded across the Bengaluru campus:\n\n"
                + "\n".join([f"- **{n}**" for n in names]) +
                "\n\n**Groundskeeping Policy Notice:** Under campus sustainability guidelines, priority is given to manual mechanical containment, solarization tarps, and native replacement buffers rather than chemical sprays. For any unverified stands, please flag them for grounds team review."
            )
            return ChatResponse(
                reply=reply,
                sources=rag_res.sources,
                expert_verification_suggested=False,
                safe_management_flags=["Manual Extraction Priority", "No Chemical Spray Default", "Biosecurity Containment"],
                data_category="AI-generated"
            )

        # 2. Questions about restoration or corridor zones or ecological deserts
        elif "restoration" in query or "corridor" in query or "desert" in query or "areas" in query:
            deserts_text = "\n".join([f"- **{d['name']}**: {d['rationale']}" for d in DESERT_ZONES])
            hotspots_text = "\n".join([f"- **{h['name']}**: {h['description']}" for h in HOTSPOT_ZONES])

            reply = (
                "### Bengaluru Campus Ecological Landscape Assessment\n\n"
                "**Potential Ecological Deserts (High Restoration Need):**\n"
                f"{deserts_text}\n\n"
                "**Active Biodiversity Hotspots (Conservation Anchors):**\n"
                f"{hotspots_text}\n\n"
                "**Recommended Action:** Deploy stepping-stone pollinator patches connecting North Meadow Sanctuary across the Central Promenade toward the Bio-Swale."
            )
            return ChatResponse(
                reply=reply,
                sources=[
                    RAGSource(
                        source_title="Campus Pollinator Corridor Framework",
                        source_organization="Bengaluru Campus Ecological Stewardship Working Group",
                        region="India / Karnataka / Bengaluru Urban",
                        url_or_reference="BCESWG Technical Report 2026",
                        verification_status="Prototype reference — not yet connected to live verified knowledge.",
                        excerpt="Stepping-stone habitat connectivity increases pollinator foraging range by up to 35% across urbanized academic campuses.",
                        confidence_alignment=0.92
                    )
                ],
                expert_verification_suggested=False,
                safe_management_flags=["Stepping-Stone Connectivity", "Native Meadow Conversion"],
                data_category="AI-generated"
            )

        # 3. Questions about improving pollinator habitat or native plants
        elif "pollinator" in query or "native" in query or "habitat" in query or "improve" in query:
            rag_res = rag_service.query_knowledge_base("milkweed ixora tulsi native pollinator")
            reply = (
                "### Recommendations for Campus Pollinator Corridors (Bengaluru Context)\n\n"
                "To optimize habitat for native bees (*Apis cerana indica*, *Apis florea*, *Xylocopa*), butterflies, and pollinators:\n\n"
                "1. **Continuous Bloom Succession:** Pair perennial nectar shrubs (*Ixora coccinea*, *Justicia adhatoda*) with climbing legumes (*Clitoria ternatea*) and aromatic herbs (*Ocimum tenuiflorum* / Tulsi).\n"
                "2. **Implement 'Low Mow' Buffer Strips:** Transition high-maintenance turf edges into continuous naturalized pollinator corridors.\n"
                "3. **Preserve Overwintering Stalks:** Retain dried perennial stems until the dry season ends so solitary native bees can safely emerge.\n"
                "4. **Zero Synthetic Chemical Default:** Strictly avoid broad-spectrum pesticides and herbicides to preserve soil microbiomes and larval hosts."
            )
            return ChatResponse(
                reply=reply,
                sources=rag_res.sources,
                expert_verification_suggested=False,
                safe_management_flags=["Continuous Bloom Succession", "No-Mow Zones", "Organic Soil Protection"],
                data_category="AI-generated"
            )

        # 4. Fallback to general RAG search on the query
        else:
            rag_res = rag_service.query_knowledge_base(query)
            if rag_res.status == "verified":
                reply = (
                    f"{rag_res.answer}\n\n"
                    "*(Grounded response from campus botanical & ecological knowledge base)*"
                )
                return ChatResponse(
                    reply=reply,
                    sources=rag_res.sources,
                    expert_verification_suggested=rag_res.expert_verification_required,
                    safe_management_flags=["Safe Stewardship Guidelines", "RAG Grounded"],
                    data_category="AI-generated"
                )
            else:
                reply = (
                    "I searched our verified campus botanical repository for your question, but could not find high-confidence evidence.\n\n"
                    "**Responsible AI Notice:** Under our ecological governance policy, the system will not speculate or provide ungrounded management guidance. Please consult with the Campus Groundskeeping Lead or Biology Department Botanist."
                )
                return ChatResponse(
                    reply=reply,
                    sources=[],
                    expert_verification_suggested=True,
                    safe_management_flags=["Expert Verification Required"],
                    data_category="AI-generated"
                )

chat_service = SustainabilityChatService()
