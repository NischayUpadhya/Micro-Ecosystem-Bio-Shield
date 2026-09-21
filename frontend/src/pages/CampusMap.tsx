import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Filter,
  Search,
  Plus,
  MapPin,
  Sparkles,
  Info,
  X,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Observation, CorridorAnalysisResponse } from '../types';
import { getObservations, getCorridors, deleteObservation } from '../services/api';

interface CampusMapProps {
  onOpenAddModal: () => void;
  selectedObsFromDashboard?: Observation | null;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  onOpenAddModal,
  selectedObsFromDashboard
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);
  const desertsLayerRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerRef = useRef<L.LayerGroup | null>(null);

  const [observations, setObservations] = useState<Observation[]>([]);
  const [corridorData, setCorridorData] = useState<CorridorAnalysisResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeObservation, setActiveObservation] = useState<Observation | null>(null);

  // Layer Visibility Toggles
  const [showObservations, setShowObservations] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showDeserts, setShowDeserts] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);

  // Load Data
  const loadData = async () => {
    try {
      const [obs, corr] = await Promise.all([
        getObservations({ status: statusFilter !== 'all' ? statusFilter : undefined, search: searchQuery || undefined }),
        getCorridors()
      ]);
      setObservations(obs);
      setCorridorData(corr);
    } catch (err) {
      console.error('Failed to load map data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    if (selectedObsFromDashboard) {
      setActiveObservation(selectedObsFromDashboard);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(
          [selectedObsFromDashboard.latitude, selectedObsFromDashboard.longitude],
          17,
          { animate: true, duration: 1.2 }
        );
      }
    }
  }, [selectedObsFromDashboard]);

  // Initialize Map with Bengaluru coordinates
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.0219, 77.5671],
        zoom: 16,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      hotspotsLayerRef.current = L.layerGroup().addTo(map);
      desertsLayerRef.current = L.layerGroup().addTo(map);
      corridorsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers when observations or toggles change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 1. Observations Layer
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
      if (showObservations) {
        observations.forEach((obs) => {
          let markerColor = '#10b981'; // Native
          let iconLetter = 'N';
          if (obs.ecological_status === 'Potentially invasive') {
            markerColor = '#f43f5e';
            iconLetter = '!';
          } else if (obs.ecological_status === 'Non-native') {
            markerColor = '#0ea5e9';
            iconLetter = 'o';
          } else if (obs.ecological_status.includes('Uncertain')) {
            markerColor = '#a855f7';
            iconLetter = '?';
          }

          const customIcon = L.divIcon({
            className: 'custom-biodiversity-pin',
            html: `
              <div style="
                background-color: ${markerColor};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 800;
                font-size: 12px;
                border: 2px solid white;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
                cursor: pointer;
                transition: transform 0.15s ease;
              " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1.0)'">
                ${iconLetter}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const marker = L.marker([obs.latitude, obs.longitude], { icon: customIcon });
          marker.on('click', () => {
            setActiveObservation(obs);
          });
          markersLayerRef.current?.addLayer(marker);
        });
      }
    }

    // 2. Hotspots Layer
    if (hotspotsLayerRef.current && corridorData) {
      hotspotsLayerRef.current.clearLayers();
      if (showHotspots) {
        corridorData.hotspot_zones.forEach((h) => {
          const circle = L.circle(h.center, {
            radius: h.radius,
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.18,
            weight: 2,
            dashArray: '4, 4',
          });
          circle.bindTooltip(`<strong>${h.name}</strong><br/>Category: Observed field data`, {
            direction: 'top',
          });
          hotspotsLayerRef.current?.addLayer(circle);
        });
      }
    }

    // 3. Ecological Deserts Layer
    if (desertsLayerRef.current && corridorData) {
      desertsLayerRef.current.clearLayers();
      if (showDeserts) {
        corridorData.desert_zones.forEach((d) => {
          const circle = L.circle(d.center, {
            radius: d.radius,
            color: '#f97316',
            fillColor: '#fb923c',
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '6, 6',
          });
          circle.bindTooltip(`<strong>${d.name}</strong><br/>Category: AI-generated inference`, {
            direction: 'top',
          });
          desertsLayerRef.current?.addLayer(circle);
        });
      }
    }

    // 4. Corridors Layer
    if (corridorsLayerRef.current && corridorData) {
      corridorsLayerRef.current.clearLayers();
      if (showCorridors) {
        corridorData.potential_corridors.forEach((c) => {
          const polyline = L.polyline(c.coordinates, {
            color: '#047857',
            weight: 5,
            dashArray: '8, 8',
            opacity: 0.85,
          });
          polyline.bindTooltip(
            `<strong>${c.zone_name}</strong><br/>Category: Recommendation/inference (${c.priority})`,
            { direction: 'top' }
          );
          corridorsLayerRef.current?.addLayer(polyline);
        });
      }
    }
  }, [observations, corridorData, showObservations, showHotspots, showDeserts, showCorridors]);

  const handleDeleteObservation = async (id: number) => {
    if (confirm('Delete this observation from the campus database?')) {
      await deleteObservation(id);
      setActiveObservation(null);
      loadData();
    }
  };

  return (
    <div className="h-[calc(100vh-4.5rem)] flex flex-col relative overflow-hidden">
      {/* Top Filter Bar */}
      <div className="bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">All Ecological Statuses</option>
              <option value="Native">Native Keystone (N)</option>
              <option value="Potentially invasive">Potentially Invasive (!)</option>
              <option value="Non-native">Non-Native (o)</option>
              <option value="Uncertain">Uncertain Review (?)</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search species or location..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
            />
          </div>

          <span className="text-xs text-slate-500 font-mono">
            {observations.length} pin{observations.length === 1 ? '' : 's'} (Bengaluru Campus)
          </span>
        </div>

        {/* Layer Toggles & Action */}
        <div className="flex items-center gap-2">
          {/* Layer Checkboxes */}
          <div className="hidden lg:flex items-center gap-2.5 text-[11px] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showObservations}
                onChange={(e) => setShowObservations(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Field Pins</span>
            </label>

            <span className="text-slate-300">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-emerald-700">
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={(e) => setShowHotspots(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Hotspots</span>
            </label>

            <span className="text-slate-300">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-orange-700">
              <input
                type="checkbox"
                checked={showDeserts}
                onChange={(e) => setShowDeserts(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Eco Deserts</span>
            </label>

            <span className="text-slate-300">|</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-teal-800">
              <input
                type="checkbox"
                checked={showCorridors}
                onChange={(e) => setShowCorridors(e.target.checked)}
                className="rounded text-teal-700 focus:ring-teal-500"
              />
              <span>Potential Corridors</span>
            </label>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Pin New Flora
          </button>
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Scientific Disclaimer & Data Category Overlay */}
        <div className="absolute bottom-6 left-6 z-20 max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg text-[11px] text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Category Separation</span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
              DEMO DATA
            </span>
          </div>
          <p className="leading-snug">
            • <strong>Observed field data</strong>: Circular pins representing verified ground sightings.<br/>
            • <strong>AI-generated</strong>: Green hotspots and orange desert areas.<br/>
            • <strong>Recommendation/inference</strong>: Dashed lines indicate Potential Pollinator Corridors (decision support based on vegetation gaps; does not measure real-time insect movement).
          </p>
        </div>

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2">
          <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
            Ecological Legend
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm" />
              <span>Native Keystone (N)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shadow-sm" />
              <span>Potentially Invasive (!)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-white shadow-sm" />
              <span>Non-Native Benign (o)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 border border-white shadow-sm" />
              <span>Uncertain Review (?)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-teal-800">
              <span className="w-4 h-1 bg-emerald-600 border-dashed" />
              <span>Potential Corridor Link</span>
            </div>
          </div>
        </div>

        {/* Observation Detail Drawer */}
        {activeObservation && (
          <div className="absolute top-4 left-4 z-30 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-left-4 duration-200">
            <div className="relative aspect-video bg-slate-50 flex items-center justify-center p-2">
              <img
                src={activeObservation.image_url || 'https://images.unsplash.com/photo-1596724806877-e685f096264d?w=600'}
                alt={activeObservation.plant_name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActiveObservation(null)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                    activeObservation.ecological_status === 'Native'
                      ? 'bg-emerald-600'
                      : activeObservation.ecological_status === 'Potentially invasive'
                      ? 'bg-rose-600'
                      : activeObservation.ecological_status.includes('Uncertain')
                      ? 'bg-purple-600'
                      : 'bg-sky-600'
                  }`}
                >
                  {activeObservation.ecological_status}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-white">
                  Observed field data
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {activeObservation.plant_name}
                </h3>
                <div className="text-xs font-serif italic text-slate-600">
                  {activeObservation.scientific_name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Confidence</div>
                  <div className="font-mono font-bold text-slate-900">
                    {(activeObservation.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-medium">Date Observed</div>
                  <div className="font-mono font-semibold text-slate-900">
                    {activeObservation.date_observed}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Campus Coordinates (Bengaluru)
                </div>
                <div className="font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
                  <span>{activeObservation.latitude.toFixed(4)}° N, {activeObservation.longitude.toFixed(4)}° E</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>

              {activeObservation.notes && (
                <div className="space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Field Notes
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    {activeObservation.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  {activeObservation.verified_by_expert ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Expert-verified information
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-medium">
                      Awaiting Expert Sign-off
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteObservation(activeObservation.id)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Delete Pin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
