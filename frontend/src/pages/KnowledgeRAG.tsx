import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Tag
} from 'lucide-react';
import { KnowledgeDoc, RAGSource } from '../types';
import { getKnowledgeDocs, queryKnowledge } from '../services/api';

export const KnowledgeRAG: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState<{
    query: string;
    status: string;
    answer: string;
    sources: RAGSource[];
    expert_verification_required: boolean;
  } | null>(null);
  const [querying, setQuerying] = useState(false);

  useEffect(() => {
    getKnowledgeDocs().then(setDocs).catch(console.error);
  }, []);

  const handleTestRAG = async (queryText: string) => {
    setRagQuery(queryText);
    setQuerying(true);
    try {
      const res = await queryKnowledge(queryText);
      setRagResult(res);
    } catch (err) {
      console.error('RAG query failed:', err);
    } finally {
      setQuerying(false);
    }
  };

  const filteredDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.scientific_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.botanical_description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Clean Knowledge Architecture & Regional RAG Repository
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            DEMO DATA
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Ecological Knowledge Base & Verification Corpus
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          India / Bengaluru Campus Context • Verified regional taxonomies, risk assessments, and non-chemical stewardship protocols grounding the AI system.
        </p>
      </div>

      {/* Interactive RAG Tester Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white shadow-xl space-y-5 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Interactive RAG Retrieval & Verification Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe how the system retrieves clean structured sources and triggers safety fallbacks when evidence is insufficient.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start">
            Zero-Hallucination Threshold: 40%
          </span>
        </div>

        {/* Input bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={ragQuery}
              onChange={(e) => setRagQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestRAG(ragQuery)}
              placeholder="Query regional botanical knowledge (e.g., 'Japanese knotweed non-chemical containment')..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => handleTestRAG(ragQuery)}
            disabled={querying || !ragQuery.trim()}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
          >
            {querying ? 'Searching...' : 'Run RAG Query'}
          </button>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Sample Test Queries:</span>
          {[
            'Japanese knotweed non-chemical containment',
            'Lantana weed manual rootstock removal',
            'Jungle Geranium Ixora pollinator value',
            'Completely unknown unverified weed cultivar'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleTestRAG(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* RAG Query Output */}
        {ragResult && (
          <div className="mt-4 p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {ragResult.status === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Clean Source Grounding Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Insufficient Verified Information — Expert Verification Required
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {ragResult.sources.length} Structured Citation(s)
              </span>
            </div>

            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              {ragResult.answer}
            </div>

            {/* Clean Sources Architecture List */}
            {ragResult.sources.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Extracted Regional Citations & Verification Status
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {ragResult.sources.map((s, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300">{s.source_title || s.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          {s.verification_status}
                        </span>
                      </div>
                      <div className="text-slate-400 italic">"{s.excerpt}"</div>
                      <div className="text-[10px] text-slate-500 font-mono flex flex-col gap-0.5 pt-1">
                        <span>Organization: {s.source_organization}</span>
                        <span>Region: {s.region}</span>
                        <span>Reference: {s.url_or_reference}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verified Regional Knowledge Documents Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Regional Botanical Corpus ({filteredDocs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Structured botanical and invasive species documentation (Bengaluru Context).
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name or description..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{doc.title}</h3>
                    <div className="text-xs font-serif italic text-slate-600 mt-0.5">
                      {doc.scientific_name}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                      doc.native_status === 'Native'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : doc.native_status === 'Potentially invasive'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-sky-50 text-sky-700 border-sky-300'
                    }`}
                  >
                    {doc.native_status}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-500">
                  Risk / Value Tier: <span className="font-bold text-slate-800">{doc.risk_tier}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Botanical Characteristics
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {doc.botanical_description}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Safe Non-Chemical Management Protocol
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/80">
                    {doc.safe_management}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Native Pollinator Replacements
                  </div>
                  <div className="text-xs font-semibold text-emerald-800">
                    {doc.replacement_species}
                  </div>
                </div>
              </div>

              {/* Clean Source Architecture Box */}
              <div className="pt-3 border-t border-slate-100 space-y-1 text-[10px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg">
                <div className="font-bold text-slate-700">Source: {doc.source_organization}</div>
                <div>Region: {doc.region}</div>
                <div>Ref: {doc.url_or_reference}</div>
                <div className="text-amber-800 font-medium">Status: {doc.verification_status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
