from typing import List, Dict, Any, Tuple, Optional
from app.schemas import ReplacementPlant

class RecommendationService:
    """
    Generates safe, environmentally ethical management protocols and
    regionally verified native pollinator replacement recommendations
    calibrated for an Indian/Bengaluru campus context.

    Strict Rules:
    - Never recommends unsupported pesticides, herbicides, or chemical treatments.
    - Strictly avoids fabricating native replacements.
    - If verified regional replacement info is unavailable, outputs:
      'Region-specific replacement recommendation requires expert verification.'
    - If verified management protocol is unavailable, outputs:
      'Management protocol requires expert verification.'
    """

    SAFE_MANAGEMENT_PLAYBOOK = {
        "Reynoutria japonica": [
            "Mechanical Root Extraction: Excavate root crown and rhizome clumps carefully when soil is workable. Bag immediately in puncture-resistant bags.",
            "Heavy Geotextile Solar Smothering: Install multi-season UV-stabilized geotextile sheeting extending 2.5 meters beyond visible shoot perimeter to exhaust root energy reserves.",
            "Biosecurity Sanitation: Clean all digging implements and footwear on-site; never chip, mow, or add root fragments to campus compost piles.",
            "Zero Chemical Default: Synthetic herbicide and defoliant applications are strictly prohibited under campus environmental protection policy."
        ],
        "Hedera helix": [
            "Chest-Height Window Pruning: Sever woody climbing vines at chest level (1-meter gap) around tree trunks. Allow aerial foliage to desiccate naturally to prevent tearing bark.",
            "Manual Root Extraction: Hand-roll ground mats during moist post-monsoon soil conditions; expose roots to dry on tarps before disposal.",
            "Organic Barrier: Apply a 4-inch layer of dry organic mulch over cleared patches to suppress secondary runner resurgence.",
            "Safe Containment: Double-bag all foliage; avoid contact of severed runners with open soil."
        ],
        "Lantana camara": [
            "Manual Cut-Rootstock Method: Sever the main root 5-7 cm below the soil collar using a specialized weed wrench or pickaxe during moist soil conditions.",
            "Rootstock Drying: Invert extracted rootstocks so roots face upward to desiccate completely in sunlight before disposal.",
            "Native Interseeding: Cover cleared areas with native ground cover to prevent dormant weed seed bank activation.",
            "Zero Chemical Default: Chemical spray application is strictly blocked under campus stewardship rules."
        ],
        "Asclepias syriaca": [
            "Keystone Habitat Conservation: Demarcate stand with campus pollinator conservation boundary stakes during grounds maintenance.",
            "Timing Coordination: Delay perimeter trimming until dry season to safeguard butterfly larvae and solitary bee pupae.",
            "Seed Conservation: Harvest mature bursting seed pods for campus nursery propagation and pollinator stepping-stone plots.",
            "No Removal Required: Plant provides critical pollinator forage."
        ],
        "Echinacea purpurea": [
            "Pollinator Garden Conservation: Preserve dried flower cones through winter months to provide lipid-rich food for foraging birds.",
            "Spring Maintenance: Trim back dried stalks in early spring after overwintering solitary native bees have emerged.",
            "Clump Division: Divide mature perennial crowns every 3-4 years to expand stepping-stone beds.",
            "No Removal Required: High-value nectar anchor for managed campus gardens."
        ]
    }

    REPLACEMENT_DIRECTORY = {
        # Japanese Knotweed: For an Indian/Bengaluru context, no fabricated replacements.
        # Fallback to explicit verified string: "Region-specific replacement recommendation requires expert verification."
        "Reynoutria japonica": [],
        
        # English Ivy: Region-specific replacement requires expert verification in Bengaluru context
        "Hedera helix": [],

        # Lantana Camara: Regionally documented South India / Western Ghats pollinator plants
        "Lantana camara": [
            ReplacementPlant(
                common_name="Jungle Geranium (Rangan)",
                scientific_name="Ixora coccinea",
                pollinator_benefit="Rich nectar corymbs for butterflies (Common Mormon, Lime Butterfly) and native bees.",
                sun_exposure="Full Sun to Light Shade",
                moisture_need="Moderate",
                regional_suitability="Bengaluru / Western Ghats Native",
                verification_status="Prototype recommendation — expert verification required"
            ),
            ReplacementPlant(
                common_name="Butterfly Pea (Shankhpushpi)",
                scientific_name="Clitoria ternatea",
                pollinator_benefit="Nitrogen-fixing native climbing legume visited by native solitary and carpenter bees.",
                sun_exposure="Full Sun",
                moisture_need="Low to Moderate",
                regional_suitability="South India Native",
                verification_status="Prototype recommendation — expert verification required"
            )
        ]
    }

    GENERIC_UNCERTAIN_GUIDANCE = [
        "Take detailed macro photographs of leaf venation, stem nodes, and floral structures for expert review.",
        "Submit observation record to the Campus Biology / Botany Department for definitive taxonomic review.",
        "Do NOT initiate preemptive removal, cutting, or chemical treatment without on-site botanist verification.",
        "Geotag location on the Campus Biodiversity Map to monitor growth across consecutive seasons."
    ]

    GENERIC_NATIVE_GUIDANCE = [
        "Protect stand from mechanical lawn mowing and human trampling.",
        "Collect seeds during dry season to propagate in candidate campus pollinator corridors.",
        "Erect educational biodiversity signage for student eco-walks."
    ]

    GENERIC_NON_NATIVE_GUIDANCE = [
        "Monitor stand periodically to verify it does not aggressively invade adjacent naturalized campus micro-meadows.",
        "Tolerate in managed turf areas if benign; prioritize native alternatives during routine landscape refurbishments.",
        "No emergency intervention needed unless ecological displacement of native flora is observed."
    ]

    def get_recommendations_for_species(
        self,
        scientific_name: str,
        ecological_status: str,
        confidence: float
    ) -> Tuple[List[str], List[ReplacementPlant], Optional[str], Optional[str]]:
        """
        Returns (safe_management, replacement_suggestions, replacement_disclaimer, uncertainty_warning)
        """
        uncertainty_warning = None
        replacement_disclaimer = None

        if confidence < 0.70 or "Uncertain" in ecological_status:
            uncertainty_warning = (
                "Uncertain — expert verification required. Identification confidence is below verified threshold. "
                "Do NOT declare invasive or initiate removal without on-site confirmation from a campus botanist."
            )
            return (self.GENERIC_UNCERTAIN_GUIDANCE, [], None, uncertainty_warning)

        if ecological_status == "Potentially invasive":
            management = self.SAFE_MANAGEMENT_PLAYBOOK.get(
                scientific_name,
                ["Management protocol requires expert verification."]
            )
            replacements = self.REPLACEMENT_DIRECTORY.get(scientific_name, [])
            if not replacements:
                replacement_disclaimer = "Region-specific replacement recommendation requires expert verification."

            return (management, replacements, replacement_disclaimer, uncertainty_warning)

        elif ecological_status == "Native":
            management = self.SAFE_MANAGEMENT_PLAYBOOK.get(scientific_name, self.GENERIC_NATIVE_GUIDANCE)
            return (management, [], None, uncertainty_warning)

        else: # Non-native (benign)
            return (self.GENERIC_NON_NATIVE_GUIDANCE, [], None, uncertainty_warning)

recommendation_service = RecommendationService()
