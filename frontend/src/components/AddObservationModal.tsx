import React, { useState, useEffect } from 'react';
import { X, MapPin, CheckCircle2, AlertTriangle, HelpCircle, Sparkles } from 'lucide-react';
import { EcologicalStatus, ObservationCreateInput } from '../types';

interface AddObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: ObservationCreateInput) => Promise<void>;
  initialData?: Partial<ObservationCreateInput>;
}

export const AddObservationModal: React.FC<AddObservationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [plantName, setPlantName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [status, setStatus] = useState<EcologicalStatus>('Native');
  const [confidence, setConfidence] = useState(0.92);
  const [latitude, setLatitude] = useState(42.3605);
  const [longitude, setLongitude] = useState(-71.0940);
  const [dateObserved, setDateObserved] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      if (initialData.plant_name) setPlantName(initialData.plant_name);
      if (initialData.scientific_name) setScientificName(initialData.scientific_name);
      if (initialData.ecological_status) setStatus(initialData.ecological_status);
      if (initialData.confidence !== undefined) setConfidence(initialData.confidence);
      if (initialData.latitude !== undefined) setLatitude(initialData.latitude);
      if (initialData.longitude !== undefined) setLongitude(initialData.longitude);
      if (initialData.notes) setNotes(initialData.notes);
      if (initialData.image_url) setImageUrl(initialData.image_url);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        plant_name: plantName,
        scientific_name: scientificName,
        ecological_status: status,
        confidence: Number(confidence),
        latitude: Number(latitude),
        longitude: Number(longitude),
        date_observed: dateObserved,
        notes: notes || undefined,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1596724806877-e685f096264d?w=600&auto=format&fit=crop&q=80',
        verified_by_expert: false
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save observation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">Record Campus Observation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition text-emerald-100 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Common Plant Name *
              </label>
              <input
                type="text"
                required
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="e.g. Common Milkweed"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scientific Name *
              </label>
              <input
                type="text"
                required
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                placeholder="e.g. Asclepias syriaca"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ecological Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EcologicalStatus)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="Native">Native (Keystone / Beneficial Flora)</option>
              <option value="Potentially invasive">Potentially invasive (Displacement Risk)</option>
              <option value="Non-native">Non-native (Naturalized / Benign)</option>
              <option value="Uncertain – expert verification required">
                Uncertain – expert verification required
              </option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                AI Confidence (0.0 - 1.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="1.0"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Observation Date
              </label>
              <input
                type="date"
                value={dateObserved}
                onChange={(e) => setDateObserved(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image Reference URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Notes / Habitat Micro-context
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Near bioswale drainage basin; observed monarch butterfly visiting..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All logged observations feed directly into the Campus Biodiversity Map and Pollinator Corridor Assistant algorithms.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Pin Observation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
