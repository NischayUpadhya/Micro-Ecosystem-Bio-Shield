import React from 'react';
import {
  ShieldCheck,
  Scale,
  Eye,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lock,
  Leaf,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';

export const ResponsibleAI: React.FC = () => {
  const pillars = [
    {
      title: 'Fairness & Regional Neutrality',
      icon: Scale,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description:
        'Botanical models are calibrated against peer-reviewed regional taxonomies. The system does not penalize non-native naturalized flora that exhibit benign ecological behavior (e.g. White Clover) and avoids biased declarations without multi-factor evidence.'
    },
    {
      title: 'High Accessibility',
      icon: Eye,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      description:
        'Engineered for WCAG AA compliance with high-contrast text ratios, clear typography, distinct color-coded semantic badges accompanied by symbolic icons (N, !, o, ?), and screen-reader accessible map layer controls.'
    },
    {
      title: 'Transparency & Explainability',
      icon: BookOpen,
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      description:
        'Every plant identification and ecological recommendation includes visible confidence meters, morphological explanations, and direct citations to the verified regional botanical and invasive species knowledge base.'
    },
    {
      title: 'Accuracy & Strict Uncertainty Thresholds',
      icon: HelpCircle,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      description:
        'Enforces a strict confidence rule: If visual or taxonomic confidence falls below 70%, or if morphology is ambiguous, the system triggers "Uncertain – expert verification required" instead of speculating on invasive status.'
    },
    {
      title: 'Human-in-the-Loop Verification',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      description:
        'AI operates strictly as a decision-support copilot. Physical interventions, eradication, or habitat modifications require on-site validation by campus groundskeepers, certified arborists, or biology department botanists.'
    },
    {
      title: 'Privacy & Geolocation Ethics',
      icon: Lock,
      color: 'text-slate-700 bg-slate-50 border-slate-200',
      description:
        'All coordinates are restricted to public campus grounds. No personal student or staff identifying data is collected, stored, or transmitted during plant scanning or observation logging.'
    },
    {
      title: 'Ethical & Non-Chemical Management',
      icon: Leaf,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      description:
        'Strict guardrails prohibit automatic recommendations of synthetic herbicides or toxic pesticides. Protocols emphasize non-chemical mechanical containment, root excavation, solarization tarps, and native replanting.'
    },
    {
      title: 'Predictive vs Empirical Boundary Clarity',
      icon: Layers,
      color: 'text-orange-700 bg-orange-50 border-orange-200',
      description:
        'Pollinator corridors are explicitly designated as "Potential Pollinator Corridors" and "Potential Restoration Zones". The system clearly acknowledges that these represent vegetation continuity models, not real-time insect telemetry.'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AI Safety, Ethics & Governance Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Responsible AI Architecture & Safeguards
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Micro-Ecosystem Bio-Shield adheres to rigorous ethical AI standards, ensuring botanical predictions are transparent, safe for biodiversity, and grounded in ecological science without automated chemical hazards.
          </p>
        </div>
      </div>

      {/* 8 Ethical Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-emerald-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${p.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Threshold & Guardrail Policy Matrix */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          AI Confidence & Ecological Classification Governance Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Confidence Level</th>
                <th className="py-3 px-4">Classification Action</th>
                <th className="py-3 px-4">Safety Constraint</th>
                <th className="py-3 px-4">Management Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">≥ 85%</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">High Certainty Identification</td>
                <td className="py-3.5 px-4">Requires RAG source verification</td>
                <td className="py-3.5 px-4">Provide verified non-chemical guidance & native replacements</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-700">70% – 84%</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Moderate Certainty Identification</td>
                <td className="py-3.5 px-4">Attach uncertainty advisory warning</td>
                <td className="py-3.5 px-4">Recommend non-destructive physical monitoring before removal</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-purple-700">&lt; 70%</td>
                <td className="py-3.5 px-4 font-bold text-purple-800">
                  Strict "Uncertain – Expert Verification Required"
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Prohibit Invasive Flag
                  </span>
                </td>
                <td className="py-3.5 px-4">Mandate botanical field inspection; zero intervention permitted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sustainable Development Goals Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              15
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">SDG 15: Life on Land</h4>
              <p className="text-[11px] text-slate-500">Protect, restore and promote sustainable terrestrial ecosystems</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Directly supports Target 15.8 (prevent the introduction and significantly reduce the impact of invasive alien species on land and water ecosystems) and Target 15.5 (halt the loss of biodiversity) by protecting vital pollinator forage species.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md">
              11
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">SDG 11: Sustainable Cities & Communities</h4>
              <p className="text-[11px] text-slate-500">Make cities and human settlements inclusive, safe, and resilient</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enhances urban and campus green infrastructure through stepping-stone micro-corridors, reducing turf heat islands and improving ecological continuity across educational institutions.
          </p>
        </div>
      </div>
    </div>
  );
};
