import re
from typing import List, Dict, Any, Optional
from app.database import fetch_knowledge_docs
from app.schemas import RAGSource, KnowledgeQueryResponse

class RAGService:
    """
    Modular RAG (Retrieval-Augmented Generation) Service.
    Retrieves verified botanical and invasive species documentation,
    computes relevance, cites clean structured sources, and gracefully
    refuses to speculate when verified knowledge is insufficient.
    """

    def __init__(self):
        pass

    def retrieve_relevant_documents(self, query: str, min_score: float = 0.25) -> List[Dict[str, Any]]:
        docs = fetch_knowledge_docs()
        words = set(re.findall(r'\w+', query.lower()))
        if not words:
            return []

        scored_docs = []
        for doc in docs:
            doc_corpus = f"{doc['title']} {doc['scientific_name']} {doc['native_status']} {doc['botanical_description']} {doc['safe_management']} {doc['replacement_species']}".lower()
            doc_words = set(re.findall(r'\w+', doc_corpus))
            
            # Direct keyword hits
            matches = words.intersection(doc_words)
            # Extra weight if scientific name or title matches directly
            title_words = set(re.findall(r'\w+', f"{doc['title']} {doc['scientific_name']}".lower()))
            title_matches = words.intersection(title_words)
            
                        # NEW RULE: require the query to contain either the first word of the title (common name token) or the full scientific name
            common_name_token = doc['title'].split()[0].strip().lower()
            if common_name_token not in query.lower() and doc['scientific_name'].lower() not in query.lower():
                continue
            
            score = (len(matches) / max(len(words), 1)) * 0.7 + (len(title_matches) / max(len(words), 1)) * 0.3
            
            # Substring boost for species names
            for word in words:
                if len(word) > 3 and word in doc_corpus:
                    score += 0.2

            score = min(1.0, score)
            if score >= min_score:
                scored_docs.append({"doc": doc, "score": round(score, 2)})

        scored_docs.sort(key=lambda x: x["score"], reverse=True)
        return scored_docs

    def query_knowledge_base(self, query: str, threshold: float = 0.40) -> KnowledgeQueryResponse:
        results = self.retrieve_relevant_documents(query, min_score=threshold)

        if not results:
            return KnowledgeQueryResponse(
                query=query,
                status="insufficient_evidence",
                answer="Insufficient verified botanical information in the regional database. To prevent ecological misidentification, expert verification by a campus botanist or grounds lead is required before taking action.",
                sources=[],
                expert_verification_required=True
            )

        top_match = results[0]["doc"]

        # Build grounded RAG answer
        status_text = f"Status: {top_match['native_status']} ({top_match['risk_tier']})."
        botanical_summary = top_match['botanical_description']
        management = f"Recommended Safe Management: {top_match['safe_management']}"
        replacements = f"Native Replacement Options: {top_match['replacement_species']}"

        answer = f"**{top_match['title']} ({top_match['scientific_name']})**\n\n{status_text}\n\n{botanical_summary}\n\n{management}\n\n{replacements}"

        sources: List[RAGSource] = []
        for r in results[:3]:
            d = r["doc"]
            sources.append(RAGSource(
                source_title=d["title"],
                source_organization=d.get("source_organization", "Campus Ecological Stewardship Group"),
                region=d.get("region", "India / Karnataka / Bengaluru Urban"),
                url_or_reference=d.get("url_or_reference", d.get("citations", "UCESWG Technical Guidance #04")),
                verification_status="Prototype reference — not yet connected to live verified knowledge.",
                excerpt=d["safe_management"][:220] + ("..." if len(d["safe_management"]) > 220 else ""),
                confidence_alignment=r["score"]
            ))

        return KnowledgeQueryResponse(
            query=query,
            status="verified",
            answer=answer,
            sources=sources,
            expert_verification_required=False
        )

# Singleton instance for modular reuse
rag_service = RAGService()
