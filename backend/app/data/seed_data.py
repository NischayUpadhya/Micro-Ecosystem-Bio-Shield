"""
Seed Data for Micro-Ecosystem Bio-Shield (Bengaluru Campus Context, Karnataka, India).
Centered on Greenwood University Campus, North Bengaluru (13.0219° N, 77.5671° E).
Strictly labeled with data categories: DEMO DATA, AI-generated, Observed field data,
and Expert-verified information.
"""
import urllib.parse

CAMPUS_CENTER = {"lat": 13.0219, "lng": 77.5671}

def make_botanical_svg(name: str, sc_name: str, bg_color: str, accent_color: str, icon_path: str, status_label: str) -> str:
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
      <defs>
        <linearGradient id="g_{name.replace(' ', '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="{bg_color}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="{bg_color}" stop-opacity="0.75"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g_{name.replace(' ', '_')})"/>
      <rect x="12" y="12" width="376" height="276" rx="14" fill="none" stroke="{accent_color}" stroke-width="1.5" stroke-opacity="0.4"/>
      
      <!-- Botanical Drawing Art Area -->
      <g transform="translate(200, 125)">
        {icon_path}
      </g>
      
      <!-- Botanical Plaque -->
      <rect x="24" y="215" width="352" height="62" rx="10" fill="#ffffff" fill-opacity="0.92" stroke="#e2e8f0" stroke-width="1"/>
      <text x="36" y="238" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">{name}</text>
      <text x="36" y="255" font-family="Georgia, serif" font-size="11" font-style="italic" fill="#475569">{sc_name}</text>
      <rect x="250" y="228" width="114" height="20" rx="6" fill="{accent_color}" fill-opacity="0.15"/>
      <text x="307" y="242" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="700" fill="{accent_color}" text-anchor="middle">{status_label}</text>
      <text x="36" y="268" font-family="monospace" font-size="8.5" fill="#94a3b8">AUTHENTIC BOTANICAL SPECIMEN • DEMO DATA</text>
    </svg>"""
    return f"data:image/svg+xml;utf8,{urllib.parse.quote(svg)}"

# 1. Japanese Knotweed: hollow bamboo-like zigzag stems, ovate spade leaves, creamy white panicle florets
KNOTWEED_SVG = make_botanical_svg(
    "Japanese Knotweed", "Reynoutria japonica",
    "#fef2f2", "#e11d48",
    """
    <!-- Bamboo-like hollow zigzag stalk with reddish nodes -->
    <path d="M-15,65 L-8,25 L5,-15 L12,-55 L16,-75" stroke="#991b1b" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="-8" cy="25" r="5" fill="#be123c"/>
    <circle cx="5" cy="-15" r="5" fill="#be123c"/>
    <circle cx="12" cy="-55" r="4" fill="#be123c"/>
    <!-- Spade-shaped alternate leaves with flat/truncate base -->
    <path d="M-8,25 Q-55,20 -48,-15 Q-40,-45 -8,-10 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
    <path d="M5,-15 Q55,-20 48,-55 Q40,-75 5,-40 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
    <path d="M12,-55 Q-25,-65 -20,-90 Q-10,-100 12,-75 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
    <!-- Creamy white branched florets at leaf axils -->
    <path d="M-8,25 Q-20,5 -30,10 M-8,25 Q-15,-5 -22,-2" stroke="#fde047" stroke-width="2" stroke-linecap="round"/>
    <circle cx="-30" cy="10" r="2.5" fill="#fef08a"/>
    <circle cx="-22" cy="-2" r="2.5" fill="#fef08a"/>
    <path d="M5,-15 Q25,-25 35,-20 M5,-15 Q18,-35 25,-32" stroke="#fde047" stroke-width="2" stroke-linecap="round"/>
    <circle cx="35" cy="-20" r="2.5" fill="#fef08a"/>
    <circle cx="25" cy="-32" r="2.5" fill="#fef08a"/>
    """,
    "POTENTIALLY INVASIVE"
)

# 2. English Ivy: deep green 3-5 lobed waxy palmate leaves with pale veins, climbing vine
ENGLISH_IVY_SVG = make_botanical_svg(
    "English Ivy", "Hedera helix",
    "#f0fdf4", "#059669",
    """
    <!-- Curving woody climbing vine with aerial rootlets -->
    <path d="M-40,65 Q-10,30 5,0 Q15,-30 -10,-75" stroke="#78350f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M-5,40 L-12,45 M-2,30 L-10,32 M8,-10 L15,-8 M6,-25 L14,-22" stroke="#92400e" stroke-width="1.5"/>
    <!-- Distinct 3-to-5 lobed evergreen leaves -->
    <g transform="translate(-15, 20)">
      <path d="M0,0 L-25,-12 L-30,-30 L-8,-38 L0,-52 L8,-38 L30,-30 L25,-12 Z" fill="#14532d" stroke="#052e16" stroke-width="1.5"/>
      <!-- Pale whitish veins -->
      <path d="M0,0 L0,-50 M0,-15 L-26,-28 M0,-15 L26,-28" stroke="#86efac" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(10, -25) scale(0.8)">
      <path d="M0,0 L-25,-12 L-30,-30 L-8,-38 L0,-52 L8,-38 L30,-30 L25,-12 Z" fill="#166534" stroke="#052e16" stroke-width="1.5"/>
      <path d="M0,0 L0,-50 M0,-15 L-26,-28 M0,-15 L26,-28" stroke="#86efac" stroke-width="1.2" stroke-linecap="round"/>
    </g>
    <g transform="translate(-10, -65) scale(0.65)">
      <path d="M0,0 L-25,-12 L-30,-30 L-8,-38 L0,-52 L8,-38 L30,-30 L25,-12 Z" fill="#15803d" stroke="#052e16" stroke-width="1.5"/>
      <path d="M0,0 L0,-50 M0,-15 L-26,-28 M0,-15 L26,-28" stroke="#86efac" stroke-width="1" stroke-linecap="round"/>
    </g>
    """,
    "POTENTIALLY INVASIVE"
)

# 3. Common Milkweed: thick opposite velvety leaves, mauve pink spherical umbel with reflexed hoods
MILKWEED_SVG = make_botanical_svg(
    "Common Milkweed", "Asclepias syriaca",
    "#fdf2f8", "#db2777",
    """
    <!-- Upright thick central stem -->
    <line x1="0" y1="65" x2="0" y2="-35" stroke="#15803d" stroke-width="6" stroke-linecap="round"/>
    <!-- Opposite large oval leaves with prominent pinkish-green midrib -->
    <path d="M0,35 Q-65,30 -60,0 Q-40,-5 0,15 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
    <path d="M0,25 L-55,5" stroke="#f472b6" stroke-width="1.5"/>
    <path d="M0,15 Q65,10 60,-20 Q40,-25 0,-5 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
    <path d="M0,5 L55,-15" stroke="#f472b6" stroke-width="1.5"/>
    <!-- Spherical umbel with fragrant star-shaped reflexed pink blossoms -->
    <g transform="translate(0, -50)">
      <circle cx="0" cy="0" r="24" fill="#fbcfe8" fill-opacity="0.6"/>
      <!-- Radiating florets -->
      <circle cx="0" cy="0" r="5" fill="#db2777"/>
      <circle cx="-12" cy="-8" r="4.5" fill="#f43f5e"/>
      <circle cx="12" cy="-8" r="4.5" fill="#ec4899"/>
      <circle cx="-14" cy="9" r="4" fill="#f472b6"/>
      <circle cx="14" cy="9" r="4" fill="#f43f5e"/>
      <circle cx="0" cy="-17" r="4" fill="#db2777"/>
      <circle cx="0" cy="16" r="4" fill="#ec4899"/>
      <circle cx="-7" cy="3" r="3.5" fill="#be185d"/>
      <circle cx="7" cy="3" r="3.5" fill="#be185d"/>
    </g>
    """,
    "KEYSTONE FLORA"
)

# 4. Purple Coneflower: spiny bronze central cone, drooping purple-pink petals, lanceolate leaves
CONEFLOWER_SVG = make_botanical_svg(
    "Purple Coneflower", "Echinacea purpurea",
    "#faf5ff", "#9333ea",
    """
    <!-- Stem & lanceolate leaves -->
    <line x1="0" y1="65" x2="0" y2="-10" stroke="#15803d" stroke-width="5" stroke-linecap="round"/>
    <path d="M0,35 Q-40,40 -45,15 Q-30,5 0,20 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.2"/>
    <path d="M0,15 Q40,20 45,-5 Q30,-15 0,0 Z" fill="#15803d" stroke="#14532d" stroke-width="1.2"/>
    <!-- Drooping purple ray florets (petals) -->
    <g transform="translate(0, -15)">
      <path d="M0,0 Q-45,15 -52,38 Q-40,30 -8,5 Z" fill="#c084fc"/>
      <path d="M0,0 Q-30,25 -32,50 Q-20,38 -4,8 Z" fill="#d8b4fe"/>
      <path d="M0,0 Q-15,30 -12,56 Q-4,42 0,10 Z" fill="#a855f7"/>
      <path d="M0,0 Q15,30 12,56 Q4,42 0,10 Z" fill="#9333ea"/>
      <path d="M0,0 Q30,25 32,50 Q20,38 4,8 Z" fill="#c084fc"/>
      <path d="M0,0 Q45,15 52,38 Q40,30 8,5 Z" fill="#d8b4fe"/>
      <!-- Spiny cone dome (disc florets) -->
      <path d="M-22,0 C-22,-24 22,-24 22,0 Z" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <circle cx="-8" cy="-8" r="2" fill="#78350f"/>
      <circle cx="0" cy="-14" r="2" fill="#78350f"/>
      <circle cx="8" cy="-8" r="2" fill="#78350f"/>
      <circle cx="-14" cy="-3" r="1.5" fill="#f59e0b"/>
      <circle cx="14" cy="-3" r="1.5" fill="#f59e0b"/>
      <circle cx="0" cy="-4" r="2" fill="#f59e0b"/>
    </g>
    """,
    "NATIVE / ADAPTED"
)

# 5. Unidentified Wild Herb: diagnostic ambiguous foliage, terminal bristly panicle, magnifying lens
UNCERTAIN_HERB_SVG = make_botanical_svg(
    "Unidentified Wild Herb", "Amaranthus cf. hybridus / sp.",
    "#f8fafc", "#64748b",
    """
    <!-- Stem and ambiguous alternate ovate weed leaves -->
    <path d="M-5,65 Q0,20 2,-25" stroke="#65a30d" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M0,35 Q-38,30 -35,5 Q-20,0 0,20 Z" fill="#84cc16" stroke="#4d7c0f" stroke-width="1.2"/>
    <path d="M0,15 Q38,10 35,-15 Q20,-20 0,0 Z" fill="#65a30d" stroke="#4d7c0f" stroke-width="1.2"/>
    <!-- Terminal indeterminate spiky weed cluster -->
    <path d="M2,-25 L-6,-55 L0,-68 L8,-52 L3,-25 Z" fill="#a1a1aa" stroke="#71717a" stroke-width="1.5"/>
    <circle cx="0" cy="-45" r="3" fill="#a855f7"/>
    <!-- Diagnostic inspection / uncertainty lens -->
    <g transform="translate(25, -20)">
      <circle cx="0" cy="0" r="20" fill="#ffffff" fill-opacity="0.85" stroke="#a855f7" stroke-width="3"/>
      <line x1="14" y1="14" x2="28" y2="28" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/>
      <text x="0" y="6" font-family="-apple-system, sans-serif" font-size="18" font-weight="900" fill="#7e22ce" text-anchor="middle">?</text>
    </g>
    """,
    "UNCERTAIN REVIEW"
)

SAMPLE_SCAN_PLANTS = [
    {
        "sample_id": "sample-knotweed",
        "common_name": "Japanese Knotweed",
        "scientific_name": "Reynoutria japonica",
        "confidence": 0.94,
        "ecological_status": "Potentially invasive",
        "sample_image": KNOTWEED_SVG,
        "notes": "Hollow bamboo-like stems with reddish nodes; spade-shaped leaves. Potential invasive risk in wet campus drainage swales."
    },
    {
        "sample_id": "sample-ivy",
        "common_name": "English Ivy",
        "scientific_name": "Hedera helix",
        "confidence": 0.91,
        "ecological_status": "Potentially invasive",
        "sample_image": ENGLISH_IVY_SVG,
        "notes": "Woody evergreen vine climbing campus heritage tree trunks and masonry walls. Dense shade suppresses ground flora."
    },
    {
        "sample_id": "sample-milkweed",
        "common_name": "Common Milkweed",
        "scientific_name": "Asclepias syriaca",
        "confidence": 0.96,
        "ecological_status": "Native",
        "sample_image": MILKWEED_SVG,
        "notes": "Keystone pollinator host plant with spherical mauve umbels. Primary forage for butterflies and native bees."
    },
    {
        "sample_id": "sample-coneflower",
        "common_name": "Purple Coneflower",
        "scientific_name": "Echinacea purpurea",
        "confidence": 0.95,
        "ecological_status": "Native",
        "sample_image": CONEFLOWER_SVG,
        "notes": "Pollinator attractor with central spiny cone; hardy perennial suitable for eco-garden pollinator stepping stones."
    },
    {
        "sample_id": "sample-uncertain",
        "common_name": "Unidentified Wild Herb",
        "scientific_name": "Amaranthus cf. hybridus / sp.",
        "confidence": 0.54,
        "ecological_status": "Uncertain — expert verification required",
        "sample_image": UNCERTAIN_HERB_SVG,
        "notes": "Indeterminate vegetative weed with overlapping traits. Requires expert botanical verification; no eradication permitted."
    }
]

# Knowledge base grounded with clean source architecture for India/Bengaluru campus context
KNOWLEDGE_DOCS_SEED = [
    {
        "id": 1,
        "title": "Japanese Knotweed Identification & Containment",
        "scientific_name": "Reynoutria japonica",
        "native_status": "Potentially invasive",
        "risk_tier": "High Risk (Exotic Invasive)",
        "botanical_description": "Perennial with hollow bamboolike stems, reddish joints, and spade-shaped leaves. Forms dense rhizomatous colonies displacing native riparian flora.",
        "safe_management": "Mechanical hand-cutting and multi-year UV-barrier geotextile containment. Bag all rhizomes in heavy plastic for disposal; never dump in campus green waste or compost. Zero synthetic pesticide or herbicide sprays permitted.",
        "replacement_species": "Region-specific replacement recommendation requires expert verification.",
        "source_organization": "University Campus Ecological Stewardship Working Group",
        "region": "India / Karnataka / Bengaluru Urban",
        "url_or_reference": "UCESWG Technical Guidance Doc #04",
        "verification_status": "Prototype reference — not yet connected to live verified knowledge."
    },
    {
        "id": 2,
        "title": "English Ivy Canopy and Tree Health Assessment",
        "scientific_name": "Hedera helix",
        "native_status": "Potentially invasive",
        "risk_tier": "Moderate to High",
        "botanical_description": "Evergreen climbing vine with distinct 3-5 lobed waxy leaves. Girdles mature campus shade trees and harbors fungal pathogens.",
        "safe_management": "Window-pruning protocol: Sever vines around tree trunk base at chest height (1-meter gap). Allow upper vines to desiccate naturally without tearing tree bark. Hand-roll ground runners when soil is moist.",
        "replacement_species": "Region-specific replacement recommendation requires expert verification.",
        "source_organization": "Campus Tree & Arboriculture Stewardship Team",
        "region": "India / Karnataka / Bengaluru Urban",
        "url_or_reference": "CTAST Campus Vegetation Guidelines 2026",
        "verification_status": "Prototype reference — not yet connected to live verified knowledge."
    },
    {
        "id": 3,
        "title": "Milkweed / Calotropis Keystone Pollinator Support",
        "scientific_name": "Asclepias syriaca / Calotropis procera",
        "native_status": "Native",
        "risk_tier": "Beneficial (Keystone Flora)",
        "botanical_description": "Robust perennial with thick opposite leaves, latex sap, and nectar-rich star blossoms. Vital host for Danaus butterflies and indigenous solitary bees.",
        "safe_management": "Preserve existing stands; restrict lawnmower encroachment; collect mature seeds in dry season for campus pollinator corridor stepping stones.",
        "replacement_species": "Keystone native — prioritize conservation and corridor propagation.",
        "source_organization": "Indian Pollinator Conservation Network",
        "region": "India / Karnataka / Bengaluru Urban",
        "url_or_reference": "IPCN Campus Habitat Bulletin Vol 8",
        "verification_status": "Prototype reference — not yet connected to live verified knowledge."
    },
    {
        "id": 4,
        "title": "Purple Coneflower Pollinator Micro-Habitat Value",
        "scientific_name": "Echinacea purpurea",
        "native_status": "Native",
        "risk_tier": "Beneficial (High Nectar Value)",
        "botanical_description": "Hardy composite perennial with prominent central spiny cones and purple-rose petals. High drought tolerance in managed campus pocket gardens.",
        "safe_management": "Maintain in sunny pollinator beds; allow dried seed cones to remain during winter/dry months for foraging birds.",
        "replacement_species": "Restoration anchor plant for sunny campus stepping-stone beds.",
        "source_organization": "Campus Eco-Club Biodiversity Archive",
        "region": "India / Karnataka / Bengaluru Urban",
        "url_or_reference": "CEC Habitat Handbook 2025",
        "verification_status": "Prototype reference — not yet connected to live verified knowledge."
    },
    {
        "id": 5,
        "title": "Lantana Weed Ecological Impact & Manual Suppression",
        "scientific_name": "Lantana camara",
        "native_status": "Potentially invasive",
        "risk_tier": "Severe (High Ecological Threat in South India)",
        "botanical_description": "Scrambling thorny woody shrub with multicoloured flower heads (orange, yellow, pink) and pungent aromatic leaves. Forms impenetrable thickets suppressing indigenous regenerations.",
        "safe_management": "Manual cut-rootstock method (extracting root ball below root-stem junction) when soil is damp. No chemical defoliants permitted.",
        "replacement_species": "Region-specific replacement recommendation requires expert verification.",
        "source_organization": "Karnataka State Biodiversity Conservation Advisory",
        "region": "India / Karnataka / Bengaluru Urban",
        "url_or_reference": "KSBCA Technical Report 2024",
        "verification_status": "Prototype reference — not yet connected to live verified knowledge."
    },
    {
        "id": 6,
        "title": "Jungle Geranium / Rangan Native Pollinator Value",
        "scientific_name": "Ixora coccinea",
        "native_status": "Native",
        "risk_tier": "Beneficial (Western Ghats / South India Native)",
        "botanical_description": "Dense evergreen shrub with glossy opposite leaves and vibrant scarlet tubular flower corymbs. Heavy nectar producer for butterflies and sunbirds.",
        "safe_management": "Encourage planting along campus pathway borders and restoration corridors; prune after flowering.",
        "replacement_species": "Prime native pollinator shrub for Bengaluru urban microclimates.",
        "source_organization": "Botanical Survey & Campus Herbarium",
        "region": "India / Karnataka / Bengaluru Urban",
        "url_or_reference": "BSCH Regional Flora Register #12",
        "verification_status": "Prototype reference — not yet connected to live verified knowledge."
    }
]

# Realistic observations for Greenwood Campus in Bengaluru, Karnataka, India
DEMO_OBSERVATIONS = [
    {
        "plant_name": "Common Milkweed",
        "scientific_name": "Asclepias syriaca",
        "ecological_status": "Native",
        "confidence": 0.96,
        "latitude": 13.0235,
        "longitude": 77.5658,
        "date_observed": "2026-09-04",
        "notes": "Dense cluster near the Science Quad Bio-Swale. High visitation by native bees.",
        "image_url": MILKWEED_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "Purple Coneflower",
        "scientific_name": "Echinacea purpurea",
        "ecological_status": "Native",
        "confidence": 0.95,
        "latitude": 13.0225,
        "longitude": 77.5672,
        "date_observed": "2026-09-06",
        "notes": "Planted in Campus Eco-Club pocket garden. Excellent bloom vigor.",
        "image_url": CONEFLOWER_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "Japanese Knotweed",
        "scientific_name": "Reynoutria japonica",
        "ecological_status": "Potentially invasive",
        "confidence": 0.94,
        "latitude": 13.0205,
        "longitude": 77.5685,
        "date_observed": "2026-09-08",
        "notes": "Specimen along stormwater drain berm. Flagged for containment tarping by estate crew.",
        "image_url": KNOTWEED_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "English Ivy",
        "scientific_name": "Hedera helix",
        "ecological_status": "Potentially invasive",
        "confidence": 0.91,
        "latitude": 13.0242,
        "longitude": 77.5665,
        "date_observed": "2026-09-10",
        "notes": "Climbing heritage tamarind tree on Old Quad wall. Scheduled for chest-height window cut.",
        "image_url": ENGLISH_IVY_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "Lantana Weed",
        "scientific_name": "Lantana camara",
        "ecological_status": "Potentially invasive",
        "confidence": 0.95,
        "latitude": 13.0195,
        "longitude": 77.5645,
        "date_observed": "2026-09-11",
        "notes": "Spreading patch along western boundary wall. Manual rootstock extraction scheduled.",
        "image_url": KNOTWEED_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "Jungle Geranium (Rangan)",
        "scientific_name": "Ixora coccinea",
        "ecological_status": "Native",
        "confidence": 0.97,
        "latitude": 13.0228,
        "longitude": 77.5660,
        "date_observed": "2026-09-12",
        "notes": "Western Ghats native shrub. Visited by common Mormon and swallowtail butterflies.",
        "image_url": MILKWEED_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "Unidentified Wild Herb",
        "scientific_name": "Amaranthus cf. hybridus / sp.",
        "ecological_status": "Uncertain — expert verification required",
        "confidence": 0.54,
        "latitude": 13.0210,
        "longitude": 77.5678,
        "date_observed": "2026-09-14",
        "notes": "Weed cluster near campus nursery. Inconclusive morphology. Do not remove without expert review.",
        "image_url": UNCERTAIN_HERB_SVG,
        "verified_by_expert": False
    },
    {
        "plant_name": "Butterfly Pea (Shankhpushpi)",
        "scientific_name": "Clitoria ternatea",
        "ecological_status": "Native",
        "confidence": 0.96,
        "latitude": 13.0238,
        "longitude": 77.5682,
        "date_observed": "2026-09-15",
        "notes": "Native climbing legume. Attracts leafcutter and carpenter bees along fence trellis.",
        "image_url": CONEFLOWER_SVG,
        "verified_by_expert": True
    },
    {
        "plant_name": "Holy Basil (Krishna Tulsi)",
        "scientific_name": "Ocimum tenuiflorum",
        "ecological_status": "Native",
        "confidence": 0.98,
        "latitude": 13.0215,
        "longitude": 77.5652,
        "date_observed": "2026-09-16",
        "notes": "Campus herbal garden stand. Heavy activity of Apis cerana indica honeybees.",
        "image_url": MILKWEED_SVG,
        "verified_by_expert": True
    }
]

DEMO_CORRIDORS = [
    {
        "id": "corridor-zone-bengaluru-alpha",
        "zone_name": "North Meadow to Bio-Swale Ecological Corridor",
        "coordinates": [
            [13.0235, 77.5658],
            [13.0228, 77.5660],
            [13.0225, 77.5672]
        ],
        "priority": "High Priority",
        "connectivity_gap_meters": 175.0,
        "rationale": "Connects native pollinator refuge in North Meadow with the Central Bio-Swale across the mowed lawn buffer.",
        "recommended_species": [
            {
                "common_name": "Jungle Geranium (Rangan)",
                "scientific_name": "Ixora coccinea",
                "pollinator_benefit": "Continuous nectar for butterflies and bees",
                "sun_exposure": "Full Sun to Partial Shade",
                "moisture_need": "Moderate",
                "regional_suitability": "Bengaluru Native",
                "verification_status": "Prototype recommendation — expert verification required"
            },
            {
                "common_name": "Butterfly Pea",
                "scientific_name": "Clitoria ternatea",
                "pollinator_benefit": "Nitrogen-fixing climber; carpenter bee attractant",
                "sun_exposure": "Full Sun",
                "moisture_need": "Low to Moderate",
                "regional_suitability": "South India Native",
                "verification_status": "Prototype recommendation — expert verification required"
            }
        ],
        "estimated_biodiversity_uplift": "+34% native floral connectivity",
        "disclaimer": "POTENTIAL POLLINATOR CORRIDOR: Model estimate based on vegetation continuity; does not measure real-time insect movement."
    },
    {
        "id": "corridor-zone-bengaluru-beta",
        "zone_name": "Central Promenade Stepping-Stone Link",
        "coordinates": [
            [13.0225, 77.5672],
            [13.0215, 77.5675],
            [13.0205, 77.5685]
        ],
        "priority": "Moderate Priority",
        "connectivity_gap_meters": 220.0,
        "rationale": "Mitigates high-mow turfgrass desert across the central promenade by installing low-water native pollinator stepping stones.",
        "recommended_species": [
            {
                "common_name": "Holy Basil (Tulsi)",
                "scientific_name": "Ocimum tenuiflorum",
                "pollinator_benefit": "High nectar frequency for native honeybees",
                "sun_exposure": "Full Sun",
                "moisture_need": "Moderate",
                "regional_suitability": "India Native",
                "verification_status": "Prototype recommendation — expert verification required"
            }
        ],
        "estimated_biodiversity_uplift": "+22% bridge across campus lawn",
        "disclaimer": "POTENTIAL POLLINATOR CORRIDOR: Model estimate based on vegetation continuity; does not measure real-time insect movement."
    }
]

HOTSPOT_ZONES = [
    {
        "id": "hotspot-1",
        "name": "North Meadow Biodiversity Sanctuary",
        "center": [13.0232, 77.5660],
        "radius": 80,
        "native_species_count": 5,
        "pollinator_activity_tier": "Very High",
        "description": "Dense colonies of native nectar-producing shrubs and perennial herbs.",
        "data_category": "Observed field data"
    },
    {
        "id": "hotspot-2",
        "name": "Campus Eco-Swale Retention Basin",
        "center": [13.0224, 77.5670],
        "radius": 65,
        "native_species_count": 4,
        "pollinator_activity_tier": "High",
        "description": "Hydrated bioswale with native flora and seasonal standing water.",
        "data_category": "Observed field data"
    }
]

DESERT_ZONES = [
    {
        "id": "desert-1",
        "name": "Central Athletic Field Monoculture Turf",
        "center": [13.0210, 77.5670],
        "radius": 95,
        "vegetation_type": "Mowed Monoculture Turf",
        "native_flora_percent": 2.8,
        "rationale": "Heavy mowing schedule with minimal pollinator forage; prime candidate for stepping-stone micro-corridors.",
        "data_category": "AI-generated"
    },
    {
        "id": "desert-2",
        "name": "East Facilities Parking & Paved Berm",
        "center": [13.0200, 77.5690],
        "radius": 70,
        "vegetation_type": "Impervious Surface & Compacted Gravel",
        "native_flora_percent": 0.8,
        "rationale": "Disturbed soil susceptible to weed colonization; zero pollinator forage.",
        "data_category": "AI-generated"
    }
]
