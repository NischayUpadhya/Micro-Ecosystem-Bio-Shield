import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  ScanLine,
  ShieldAlert,
  Leaf,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  MapPin,
  RefreshCw,
  Info,
  Sun,
  Droplets,
  Sparkles,
  Tag
} from 'lucide-react';
import { PlantAnalysisResult, SamplePlant, ObservationCreateInput } from '../types';
import { analyzePlant, getSamplePlants } from '../services/api';

interface PlantScannerProps {
  onSaveToMap: (prefill: Partial<ObservationCreateInput>) => void;
}

export const PlantScanner: React.FC<PlantScannerProps> = ({ onSaveToMap }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>('sample-knotweed');
  const [userNotes, setUserNotes] = useState('');
  const [simulateLowConfidence, setSimulateLowConfidence] = useState(false);
  const [samples, setSamples] = useState<SamplePlant[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantAnalysisResult | null>(null);

  useEffect(() => {
    getSamplePlants()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) {
          setSelectedSampleId(data[0].sample_id);
          setSelectedImage(data[0].sample_image);
        }
      })
      .catch(console.error);
  }, []);

  const handleSampleClick = (sample: SamplePlant) => {
    setSelectedSampleId(sample.sample_id);
    setSelectedImage(sample.sample_image);
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedSampleId(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzePlant({
        sample_id: selectedSampleId || undefined,
        image_base64: selectedImage || undefined,
        user_notes: userNotes || undefined,
        simulated_low_confidence: simulateLowConfidence
      });
      setResult(res);
    } catch (err) {
      console.error('Plant analysis failed:', err);
      alert('Plant analysis request failed. Please check backend connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
              AI Plant Scanner & Verification Workflow
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
              <Sparkles className="w-3 h-3 text-amber-600" />
              DEMO DATA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Flora Identification & Risk Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Indian/Bengaluru Campus Context • Botanical identification, ecological classification, and non-chemical stewardship guidance.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1.5 self-start md:self-auto">
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Context: Bengaluru Campus, Karnataka, India</span>
          </div>
          <span className="text-[10px] text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Prototype knowledge — expert verification required.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Input & Sample Gallery */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Plant Specimen Input</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Observed field data input
              </span>
            </div>

            {/* Image Preview Box */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center group">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Selected plant specimen"
                    className="w-full h-full object-contain p-2 bg-slate-50"
                  />
                  <label className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-semibold gap-2">
                    <UploadCloud className="w-5 h-5" />
                    Replace Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-slate-50 transition">
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2 group-hover:text-emerald-600 transition" />
                  <span className="text-xs font-semibold text-slate-700">Click to upload photo</span>
                  <span className="text-[11px] text-slate-400 mt-1">or drag & drop specimen image here</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field Observation Notes (Optional)
              </label>
              <input
                type="text"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. Near Science swale, climbing tamarind tree..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Simulation Guardrail Toggle */}
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateLowConfidence}
                  onChange={(e) => setSimulateLowConfidence(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                    Simulate Indeterminate / Low Optical Quality
                  </div>
                  <div className="text-[11px] text-purple-700 leading-snug mt-0.5">
                    Tests Responsible AI guardrail: Strictly forces output to{' '}
                    <strong className="underline">"Uncertain — expert verification required"</strong> and{' '}
                    <strong>blocks invasive classification</strong>.
                  </div>
                </div>
              </label>
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing || !selectedImage}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Specimen with Prototype Engine...</span>
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" />
                  <span>Analyze Plant Specimen</span>
                </>
              )}
            </button>
          </div>

          {/* Test Plant Gallery */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Test Plant Specimen Gallery
              </h4>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                DEMO DATA
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Select an authentic botanical illustration to evaluate the structured diagnosis workflow:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {samples.map((s) => {
                const isSelected = selectedSampleId === s.sample_id;
                return (
                  <button
                    key={s.sample_id}
                    onClick={() => handleSampleClick(s)}
                    className={`text-left p-2 rounded-xl border transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={s.sample_image}
                      alt={s.common_name}
                      className="w-full h-20 rounded-lg object-contain bg-white border border-slate-100 shadow-inner"
                    />
                    <div>
                      <div className="font-bold text-[11px] text-slate-900 truncate">
                        {s.common_name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate italic font-serif">
                        {s.scientific_name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Structured AI Diagnosis & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Category Badges & Demo Notice */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    DEMO AI RESULT — simulated for prototype
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    <Tag className="w-3 h-3" />
                    AI-generated
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  Context: Bengaluru, India
                </span>
              </div>

              {/* Header Status Card */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {result.common_name}
                  </h2>
                  <div className="text-sm font-serif italic text-slate-600 mt-0.5">
                    {result.scientific_name}
                  </div>
                </div>

                {/* Ecological Status Pill */}
                <div className="self-start">
                  {result.ecological_status === 'Native' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      Native Keystone
                    </span>
                  )}
                  {result.ecological_status === 'Potentially invasive' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 shadow-sm">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Potentially Invasive
                    </span>
                  )}
                  {result.ecological_status === 'Non-native' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-300 shadow-sm">
                      <Info className="w-4 h-4 text-sky-600" />
                      Non-Native (Benign)
                    </span>
                  )}
                  {result.ecological_status.includes('Uncertain') && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300 shadow-sm">
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      Uncertain — expert verification required
                    </span>
                  )}
                </div>
              </div>

              {/* Confidence Meter with Prototype Disclaimer */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Simulated AI Confidence Score</span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                      Simulated
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.confidence > 0.85
                        ? 'bg-emerald-500'
                        : result.confidence >= 0.70
                        ? 'bg-amber-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Threshold: 70% required for preliminary classification</span>
                  <span className="italic">
                    Demonstrates intended future model workflow; not output of trained CV model.
                  </span>
                </div>
              </div>

              {/* Uncertainty Warning Banner if applicable */}
              {result.uncertainty_warning && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm mb-0.5">Responsible AI Guardrail Active</div>
                    <div className="leading-relaxed">{result.uncertainty_warning}</div>
                  </div>
                </div>
              )}

              {/* Botanical Status Explanation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Morphological Evaluation & Ecological Rationale
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Category: AI-generated
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {result.status_explanation}
                </p>
              </div>

              {/* Safe Management Protocol (Strict Non-Chemical Priority) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                    Safe Non-Chemical Management Guidance
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    No Chemical Spray Default
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.safe_management.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Native Pollinator-Friendly Replacements (Regionally Verified or Explicit Disclaimer) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Regionally Appropriate Native Replacements (Bengaluru Context)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Category: Recommendation/inference
                  </span>
                </div>

                {result.replacement_disclaimer ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold mb-0.5">Scientific Transparency Notice</div>
                      <div>{result.replacement_disclaimer}</div>
                    </div>
                  </div>
                ) : result.replacement_suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.replacement_suggestions.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5"
                      >
                        <div className="font-bold text-xs text-emerald-950">{p.common_name}</div>
                        <div className="text-[11px] font-serif italic text-emerald-700">
                          {p.scientific_name}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {p.pollinator_benefit}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Sun className="w-3 h-3 text-amber-500" />
                            {p.sun_exposure}
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-sky-500" />
                            {p.moisture_need}
                          </span>
                        </div>
                        <div className="text-[9.5px] text-emerald-800 font-mono pt-1">
                          {p.regional_suitability}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
                    Region-specific replacement recommendation requires expert verification.
                  </div>
                )}
              </div>

              {/* Clean Knowledge Sources Architecture */}
              {result.rag_sources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      Grounded Knowledge References & Citations
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Prototype Knowledge
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {result.rag_sources.map((src, i) => (
                      <div
                        key={i}
                        className="text-[11px] p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{src.source_title || src.title}</span>
                          <span className="text-[9.5px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {src.verification_status}
                          </span>
                        </div>
                        <div className="text-slate-500 italic">"{src.excerpt}"</div>
                        <div className="text-[10px] text-slate-500 font-mono flex flex-wrap items-center gap-x-3 pt-0.5">
                          <span>Org: {src.source_organization}</span>
                          <span>Region: {src.region}</span>
                          <span>Ref: {src.url_or_reference}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button: Pin to Map */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Observed field data logging
                </span>
                <button
                  onClick={() =>
                    onSaveToMap({
                      plant_name: result.common_name,
                      scientific_name: result.scientific_name,
                      ecological_status: result.ecological_status,
                      confidence: result.confidence,
                      notes: result.status_explanation,
                      image_url: selectedImage || undefined
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-700 text-xs font-bold transition shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Log Observation to Campus GIS Map</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[480px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <ScanLine className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="font-bold text-slate-900 text-base">
                  Ready for Plant Specimen Analysis
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a specimen from the gallery or upload your own botanical photograph. Click{' '}
                  <strong className="text-slate-700 font-semibold">"Analyze Plant Specimen"</strong> to evaluate ecological classification, confidence calibration, and non-chemical management protocols.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300">
                    DEMO AI RESULT — simulated for prototype
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
