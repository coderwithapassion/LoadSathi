import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Target,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const BusinessOverviewPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-orange-400 text-xs font-bold uppercase tracking-wider">
            Startup Overview & Strategy
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            LoadSaathi: Modernising India's Freight Infrastructure
          </h1>
          <p className="text-orange-600 font-bold text-lg">
            "Your Goods, Our Responsibility."
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            India's logistics sector represents over $250 Billion, yet more than 85% of road transport operates through fragmented, unorganized brokers with severe empty-haul miles and zero real-time visibility. LoadSaathi is designed to bridge this gap.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">The Market Problem</h3>
            <p className="text-xs text-slate-600 leading-relaxed space-y-2">
              Shippers face high, non-transparent broker rates and unpredictability. Transporters face high empty-running costs (nearly 35% of truck trips in India run empty on returns) and 45+ day payment delays.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">The LoadSaathi Solution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              An intelligent, transparent logistics exchange connecting verified shippers directly with fleet owners and commercial drivers, backed by real-time tracking, transparent bidding, and secure milestone escrow.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Market Traction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Focusing on high-density manufacturing corridors including Delhi NCR–Mumbai, Pune–Ahmedabad, Bengaluru–Chennai, and Ludhiana–Delhi with rapid truck placement and 99.2% on-time delivery rates.
            </p>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Enterprise-Grade Stack</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">Full-Stack Architecture</h3>
            <p className="text-xs text-slate-600 mt-1">
              Built with industry-standard resilience, reactive state handling, and strict relational security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Cpu className="w-6 h-6 text-orange-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">React & TypeScript</h4>
              <p className="text-xs text-slate-600 mt-1">
                Fast, type-safe frontend bundled with Vite, styled with Tailwind CSS, and iconified with Lucide React.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Layers className="w-6 h-6 text-blue-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Supabase & PostgreSQL</h4>
              <p className="text-xs text-slate-600 mt-1">
                Relational schema with 12 structured tables, Row Level Security (RLS) policies, and foreign key integrity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Leaflet & OpenStreetMap</h4>
              <p className="text-xs text-slate-600 mt-1">
                Interactive mapping showing pickup, delivery destination, and current highway transit checkpoints.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Building2 className="w-6 h-6 text-purple-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Recharts Analytics</h4>
              <p className="text-xs text-slate-600 mt-1">
                Interactive expenditure and earnings trend lines for business owners, transporters, and platform admins.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/25 transition"
          >
            <span>Join LoadSaathi Platform</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

