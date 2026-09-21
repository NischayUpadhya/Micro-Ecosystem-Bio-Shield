import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Leaf,
  Layers,
  Flame,
  Route,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ScanLine,
  Tag
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { DashboardStats, Observation } from '../types';
import { getDashboardStats } from '../services/api';
import { NavTab } from '../components/Sidebar';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
  onSelectObservation?: (obs: Observation) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectObservation }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-600">Loading Bengaluru campus ecological telemetry...</span>
        </div>
      </div>
    );
  }

  // Chart data setup
  const pieData = [
    { name: 'Native Keystone', value: stats.native_count, color: '#10b981' },
    { name: 'Potentially Invasive', value: stats.invasive_count, color: '#f43f5e' },
    { name: 'Non-Native (Benign)', value: stats.non_native_count, color: '#0ea5e9' },
    { name: 'Uncertain Verification', value: stats.uncertain_count, color: '#a855f7' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Bengaluru Campus Context • SDG 15 (Life on Land) & SDG 11 (Sustainable Cities)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
              DEMO DATA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Micro-Ecosystem Bio-Shield Dashboard
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time biodiversity telemetry for Bengaluru campus grounds. Identification of invasive weed hotspots, preservation of native pollinator keystone flora, and algorithmic corridor connectivity.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/40"
            >
              <ScanLine className="w-4 h-4" />
              Analyze Plant Specimen
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Open Interactive GIS Map
            </button>
          </div>
        </div>
      </div>

      {/* Explicit Data Categorization Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Tag className="w-4 h-4 text-emerald-600" />
          <span>Active Data Categories:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            DEMO DATA
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            AI-generated
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Observed field data
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Expert-verified information
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Recommendation/inference
          </span>
        </div>
      </div>

      {/* 6 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Observations */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-emerald-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Records</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total_observations}</div>
          <div className="text-[10.5px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">Observed field data</span>
          </div>
        </div>

        {/* Metric 2: Potential Invasive */}
        <div className="bg-white rounded-xl p-4 border border-rose-200 shadow-sm hover:border-rose-400 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Invasive Flagged</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-100 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{stats.invasive_count}</div>
          <div className="text-[10.5px] text-rose-600 mt-1 font-medium">
            Requires containment tarping
          </div>
        </div>

        {/* Metric 3: Native Species */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm hover:border-emerald-400 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Native Keystone</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{stats.native_count}</div>
          <div className="text-[10.5px] text-emerald-600 mt-1 font-medium">
            Pollinator forage anchors
          </div>
        </div>

        {/* Metric 4: Biodiversity Hotspots */}
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm hover:border-amber-400 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Hotspot Zones</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{stats.hotspots_count}</div>
          <div className="text-[10.5px] text-amber-700 mt-1 font-medium">
            High floral diversity
          </div>
        </div>

        {/* Metric 5: Ecological Deserts */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-orange-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eco Deserts</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-600 mt-2">{stats.ecological_deserts_count}</div>
          <div className="text-[10.5px] text-slate-500 mt-1 font-medium">
            Category: AI-generated
          </div>
        </div>

        {/* Metric 6: Potential Corridors */}
        <div className="bg-white rounded-xl p-4 border border-teal-200 shadow-sm hover:border-teal-400 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Corridors</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition">
              <Route className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700 mt-2">{stats.corridor_opportunities_count}</div>
          <div className="text-[10.5px] text-teal-600 mt-1 font-medium">
            Recommendation/inference
          </div>
        </div>
      </div>

      {/* Charts Section: Status Distribution & Observation Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Ecological Status Distribution */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Campus Ecological Status Breakdown
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Observed field data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bengaluru Campus grounds survey distribution.
            </p>
          </div>

          <div className="h-60 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 font-mono ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart: Monthly Survey Cadence */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Bengaluru Campus Survey Cadence
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Season 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field observations recorded across pre-monsoon and monsoon surveys.
            </p>
          </div>

          <div className="h-64 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorObs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorInvasive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="native"
                  name="Native Flora"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorObs)"
                />
                <Area
                  type="monotone"
                  dataKey="invasive"
                  name="Invasive Detections"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInvasive)"
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>High flowering window: Post-Monsoon (August - November)</span>
            <span className="font-semibold text-emerald-700">Active Pollinator Flight</span>
          </div>
        </div>
      </div>

      {/* Recent Observations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Recent Field Observations</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Observed field data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified ground observations logged across Greenwood University campus, Bengaluru.
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            <span>View All on Campus Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Plant Specimen</th>
                <th className="py-3 px-6">Ecological Status</th>
                <th className="py-3 px-6">Confidence</th>
                <th className="py-3 px-6">Date Logged</th>
                <th className="py-3 px-6">Verification</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent_observations.map((obs) => {
                let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                if (obs.ecological_status === 'Native') {
                  badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                } else if (obs.ecological_status === 'Potentially invasive') {
                  badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                } else if (obs.ecological_status.includes('Uncertain')) {
                  badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
                }

                return (
                  <tr key={obs.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={obs.image_url || 'https://images.unsplash.com/photo-1596724806877-e685f096264d?w=200'}
                          alt={obs.plant_name}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 shadow-sm shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{obs.plant_name}</div>
                          <div className="text-[11px] text-slate-500 italic font-serif">
                            {obs.scientific_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeStyle}`}>
                        {obs.ecological_status === 'Native' && <Leaf className="w-3 h-3 text-emerald-600" />}
                        {obs.ecological_status === 'Potentially invasive' && <ShieldAlert className="w-3 h-3 text-rose-600" />}
                        {obs.ecological_status.includes('Uncertain') && <HelpCircle className="w-3 h-3 text-purple-600" />}
                        {obs.ecological_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono font-semibold text-slate-700">
                      {(obs.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-mono">
                      {obs.date_observed}
                    </td>
                    <td className="py-3.5 px-6">
                      {obs.verified_by_expert ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Expert-verified information
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => {
                          if (onSelectObservation) onSelectObservation(obs);
                          onNavigate('map');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition border border-slate-200"
                      >
                        <MapPin className="w-3 h-3" />
                        Locate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
