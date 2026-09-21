import React, { useEffect, useState } from 'react';
import {
  Route,
  Sparkles,
  MapPin,
  ArrowRight,
  Info,
  Leaf,
  Sun,
  Droplets,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { CorridorAnalysisResponse } from '../types';
import { getCorridors } from '../services/api';
import { NavTab } from '../components/Sidebar';

interface CorridorAssistantProps {
  onNavigate: (tab: NavTab) => void;
}

export const CorridorAssistant: React.FC<CorridorAssistantProps> = ({ onNavigate }) => {
  const [data, setData] = useState<CorridorAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCorridors()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load corridor analysis:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-600">
            Calculating campus spatial connectivity matrices (Bengaluru Context)...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Route className="w-3.5 h-3.5 text-emerald-400" />
              Decision-Support Spatial Restoration Engine (Bengaluru Campus)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
              DEMO DATA
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
              Recommendation/inference
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pollinator Corridor & Restoration Assistant
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Algorithmic evaluation of campus habitat fragmentation. Connects disconnected native botanical refuges across lawn monocultures through strategic stepping-stone micro-meadows.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Responsible Ecological Terminology: </span>
              Corridors are designated as <strong>"Potential Pollinator Corridors"</strong> and{' '}
              <strong>"Potential Restoration Zones"</strong> based on vegetation distance metrics. The model does not claim to measure real-time insect or pollinator flight telemetry.
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Habitat Fragmentation Index
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
            {data.habitat_fragmentation_index}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Category: AI-generated
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Candidate Restoration Zones
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">
            {data.total_corridor_opportunities}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            Recommendation/inference
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Keystone Hotspots
          </div>
          <div className="text-3xl font-black text-teal-700 mt-2 font-mono">
            {data.active_hotspots_count}
          </div>
          <div className="text-[11px] text-teal-600 mt-1 font-medium">
            Category: Observed field data
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Target Ecological Deserts
          </div>
          <div className="text-3xl font-black text-orange-600 mt-2 font-mono">
            {data.ecological_deserts_count}
          </div>
          <div className="text-[11px] text-orange-600 mt-1 font-medium">
            Category: AI-generated
          </div>
        </div>
      </div>

      {/* Candidate Corridors List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Prioritized Potential Restoration Zones (Bengaluru Campus)
            </h2>
            <p className="text-xs text-slate-500">
              Algorithmically proposed corridor links that reconnect fragmented native floral colonies.
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            <span>View Paths on Campus Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.potential_corridors.map((corridor) => (
            <div
              key={corridor.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        corridor.priority.includes('High')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                    >
                      {corridor.priority}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      Recommendation/inference
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Gap: {corridor.connectivity_gap_meters}m
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {corridor.zone_name}
                  </h3>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                    {corridor.estimated_biodiversity_uplift}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {corridor.rationale}
                </p>

                {/* Recommended Plant Palette */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    Target Restoration Species (Bengaluru Context)
                  </div>
                  <div className="space-y-2">
                    {corridor.recommended_species.map((sp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1"
                      >
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{sp.common_name}</span>
                          <span className="text-[10px] font-serif italic text-emerald-700">
                            {sp.scientific_name}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">{sp.pollinator_benefit}</div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                          <span className="flex items-center gap-1">
                            <Sun className="w-3 h-3 text-amber-500" />
                            {sp.sun_exposure}
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-sky-500" />
                            {sp.moisture_need}
                          </span>
                          <span className="font-mono text-[9.5px] text-emerald-800 ml-auto">
                            {sp.regional_suitability}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 italic">
                  Decision support model (vegetation continuity estimate)
                </span>
                <button
                  onClick={() => onNavigate('map')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                >
                  <span>Locate Corridor</span>
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Microclimate Planting Guide */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600" />
          Bengaluru Campus Stepping-Stone Microclimate Framework
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          To maximize ecological continuity when converting mowed campus turf into pollinator stepping stones, prioritize indigenous Western Ghats and Deccan Plateau species:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-600" />
              Sunny Pathway Strips
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Ideal for central lawn perimeters. Feature drought-hardy native perennials like <em>Ixora coccinea</em> and <em>Ocimum tenuiflorum</em> (Tulsi), providing high nectar frequency for <em>Apis cerana indica</em> honeybees.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2 text-xs">
            <div className="font-bold text-sky-900 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-600" />
              Bio-Swale Drainage Swales
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Deploy along monsoon runoff swales and retention basins. Feature moisture-adapted keystone flora and native sedges to filter stormwater.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Tree Canopy Buffer Zones
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Buffer zones replacing English Ivy on heritage shade trees. Plant native nitrogen-fixing climbers like <em>Clitoria ternatea</em> on designated trellises away from tree bark.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
