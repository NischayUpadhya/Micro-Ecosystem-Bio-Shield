import React from 'react';
import { Sparkles, ScanLine, PlusCircle, ShieldCheck } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenAddModal }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            MICRO-ECOSYSTEM BIO-SHIELD
          </h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ecological Protection Engine
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Sparkles className="w-3 h-3 text-amber-600" />
            DEMO DATA
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          AI-Driven Campus Invasive Flora & Pollinator Corridor Protection • Greenwood University
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onNavigate('scanner')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
        >
          <ScanLine className="w-4 h-4" />
          AI Plant Scanner
        </button>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition"
        >
          <PlusCircle className="w-4 h-4 text-slate-600" />
          Log Observation
        </button>
      </div>
    </header>
  );
};
