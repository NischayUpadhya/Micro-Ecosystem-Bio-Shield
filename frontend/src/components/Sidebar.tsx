import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  MapPin,
  Route,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Leaf,
  Sparkles,
  Info
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'scanner'
  | 'map'
  | 'corridors'
  | 'knowledge'
  | 'chat'
  | 'responsible-ai';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'scanner' as NavTab, label: 'AI Plant Scanner', icon: ScanLine, badge: 'AI' },
    { id: 'map' as NavTab, label: 'Campus Biodiversity Map', icon: MapPin, badge: 'GIS' },
    { id: 'corridors' as NavTab, label: 'Pollinator Corridors', icon: Route, badge: 'Restoration' },
    { id: 'knowledge' as NavTab, label: 'Ecological RAG / Docs', icon: BookOpen, badge: null },
    { id: 'chat' as NavTab, label: 'Sustainability Assistant', icon: MessageSquare, badge: 'AI' },
    { id: 'responsible-ai' as NavTab, label: 'Responsible AI & Ethics', icon: ShieldCheck, badge: 'Governance' },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none shadow-xl z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              MICRO-ECOSYSTEM
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v1.0
              </span>
            </h1>
            <div className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              BIO-SHIELD
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2.5 leading-snug">
          Campus Invasive Flora & Pollinator Corridor Protection
        </p>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Platform
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-emerald-700/80 text-emerald-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SDG Badges & Demo Data Tag */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
        {/* Demo Data Notice */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span className="font-medium">DEMO DATA ACTIVE</span>
        </div>

        {/* SDG Alignments */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            UN Sustainable Goals
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-900/40 border border-emerald-700/40 text-[11px] text-emerald-300">
              <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                15
              </span>
              <span className="truncate">SDG 15: Life on Land</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-amber-900/30 border border-amber-700/30 text-[11px] text-amber-300">
              <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-[10px]">
                11
              </span>
              <span className="truncate">SDG 11: Sustainable Cities</span>
            </div>
          </div>
        </div>

        {/* Campus Context */}
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Greenwood Campus Stewardship</span>
        </div>
      </div>
    </aside>
  );
};
