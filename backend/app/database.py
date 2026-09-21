import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from app.data.seed_data import KNOWLEDGE_DOCS_SEED, DEMO_OBSERVATIONS, DEMO_CORRIDORS

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "campus_biodiversity.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_reseed: bool = True):
    conn = get_db_connection()
    cursor = conn.cursor()

    if force_reseed:
        cursor.execute("DROP TABLE IF EXISTS observations")
        cursor.execute("DROP TABLE IF EXISTS knowledge_docs")
        cursor.execute("DROP TABLE IF EXISTS corridors")

    # Create observations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_name TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        ecological_status TEXT NOT NULL,
        confidence REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        date_observed TEXT NOT NULL,
        notes TEXT,
        image_url TEXT,
        verified_by_expert INTEGER NOT NULL DEFAULT 0,
        is_demo INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Create knowledge_docs table with clean source architecture
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_docs (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        native_status TEXT NOT NULL,
        risk_tier TEXT NOT NULL,
        botanical_description TEXT NOT NULL,
        safe_management TEXT NOT NULL,
        replacement_species TEXT NOT NULL,
        source_organization TEXT NOT NULL,
        region TEXT NOT NULL,
        url_or_reference TEXT NOT NULL,
        verification_status TEXT NOT NULL
    );
    """)

    # Create corridors table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS corridors (
        id TEXT PRIMARY KEY,
        zone_name TEXT NOT NULL,
        coordinates_json TEXT NOT NULL,
        priority TEXT NOT NULL,
        connectivity_gap_meters REAL NOT NULL,
        rationale TEXT NOT NULL,
        recommended_species_json TEXT NOT NULL,
        estimated_biodiversity_uplift TEXT NOT NULL
    );
    """)

    conn.commit()

    # Seed knowledge docs
    cursor.execute("SELECT COUNT(*) FROM knowledge_docs")
    if cursor.fetchone()[0] == 0:
        for doc in KNOWLEDGE_DOCS_SEED:
            cursor.execute("""
            INSERT INTO knowledge_docs (id, title, scientific_name, native_status, risk_tier, botanical_description, safe_management, replacement_species, source_organization, region, url_or_reference, verification_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                doc["id"], doc["title"], doc["scientific_name"], doc["native_status"],
                doc["risk_tier"], doc["botanical_description"], doc["safe_management"],
                doc["replacement_species"], doc["source_organization"], doc["region"],
                doc["url_or_reference"], doc["verification_status"]
            ))
        conn.commit()

    # Seed observations
    cursor.execute("SELECT COUNT(*) FROM observations")
    if cursor.fetchone()[0] == 0:
        for obs in DEMO_OBSERVATIONS:
            cursor.execute("""
            INSERT INTO observations (plant_name, scientific_name, ecological_status, confidence, latitude, longitude, date_observed, notes, image_url, verified_by_expert, is_demo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                obs["plant_name"], obs["scientific_name"], obs["ecological_status"],
                obs["confidence"], obs["latitude"], obs["longitude"],
                obs["date_observed"], obs.get("notes", ""), obs.get("image_url", ""),
                1 if obs.get("verified_by_expert", False) else 0
            ))
        conn.commit()

    # Seed corridors
    cursor.execute("SELECT COUNT(*) FROM corridors")
    if cursor.fetchone()[0] == 0:
        for c in DEMO_CORRIDORS:
            cursor.execute("""
            INSERT INTO corridors (id, zone_name, coordinates_json, priority, connectivity_gap_meters, rationale, recommended_species_json, estimated_biodiversity_uplift)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c["id"], c["zone_name"], json.dumps(c["coordinates"]), c["priority"],
                c["connectivity_gap_meters"], c["rationale"], json.dumps(c["recommended_species"]),
                c["estimated_biodiversity_uplift"]
            ))
        conn.commit()

    conn.close()

# Database helpers
def fetch_all_observations() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM observations ORDER BY date_observed DESC, id DESC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    for r in rows:
        r["verified_by_expert"] = bool(r["verified_by_expert"])
        r["is_demo"] = bool(r["is_demo"])
    return rows

def insert_observation(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO observations (plant_name, scientific_name, ecological_status, confidence, latitude, longitude, date_observed, notes, image_url, verified_by_expert, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["plant_name"], data["scientific_name"], data["ecological_status"],
        data["confidence"], data["latitude"], data["longitude"],
        data["date_observed"], data.get("notes", ""), data.get("image_url", ""),
        1 if data.get("verified_by_expert", False) else 0,
        1 if data.get("is_demo", False) else 0
    ))
    new_id = cursor.lastrowid
    conn.commit()
    cursor.execute("SELECT * FROM observations WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    row["verified_by_expert"] = bool(row["verified_by_expert"])
    row["is_demo"] = bool(row["is_demo"])
    return row

def fetch_knowledge_docs() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM knowledge_docs ORDER BY id ASC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows

def fetch_all_corridors() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM corridors")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    for r in rows:
        r["coordinates"] = json.loads(r["coordinates_json"])
        r["recommended_species"] = json.loads(r["recommended_species_json"])
    return rows
