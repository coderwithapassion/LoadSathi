import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Logistics Monetisation
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Fair Plans for Every Scale of Cargo
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Choose the right logistics tier for your dispatch requirements.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 max-w-xl mx-auto font-medium">
            <strong>Note on Proposed Pricing:</strong> All subscription tiers and commission structures presented below represent LoadSaathi's proposed commercial framework.
          </div>
        </div>

        {/* 3 Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter Plan
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Pay-as-you-go
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                <span className="text-slate-500 text-xs ml-2 font-medium">/ Free Forever</span>
              </div>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Ideal for small traders, occasional shippers, and individual transporters starting out.
              </p>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Limited shipment bookings (up to 5 per month)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Basic highway checkpoint tracking</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Standard email & ticket support</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Proposed 10% commission on completed freight</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Standard consignment receipts</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Business Plan (Recommended) */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 border-2 border-orange-500 shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
              Most Popular for SMEs
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Business Plan
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-orange-300 font-semibold border border-slate-700">
                  Proposed
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">₹999</span>
                <span className="text-slate-400 text-xs ml-2 font-medium">/ month + GST</span>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                For manufacturing hubs, distributor networks, and growing transport fleets with frequent trips.
              </p>

              <div className="space-y-3.5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Higher shipment bookings</strong> (up to 50 active loads/mo)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Advanced analytics</strong> & corridor expenditure reports</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span><strong>Priority 24x7 phone & WhatsApp support</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Reduced proposed commission tier (8%)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>Priority transporter quotation broadcast</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition"
              >
                Choose Business Plan
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enterprise Plan
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Custom
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                <span className="text-slate-500 text-xs ml-2 font-medium">Bespoke SLA</span>
              </div>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                For major industrial conglomerates, FMCG supply chains, and nationwide 3PL operations.
              </p>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dedicated key account logistics manager</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Bulk CSV shipment import & ERP / SAP API integration</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Advanced carbon & multi-modal corridor reporting</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Promoted fleet placement & guaranteed backhaul loads</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Custom negotiated commission structure</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/about"
                className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Commission & Monetisation Explained */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            How LoadSaathi Monetises Freight Services
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-3xl">
            Our multi-pronged business model ensures platform sustainability while protecting transporter margins and reducing shipper logistics expenditure.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl font-black text-orange-600">8–12%</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Transaction Fee</h4>
              <p className="text-xs text-slate-600 mt-1">
                Charged solely on completed delivery bookings, covering escrow security and verified driver assignment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl font-black text-orange-600">₹999</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">SaaS Subscriptions</h4>
              <p className="text-xs text-slate-600 mt-1">
                Value-added analytics, priority dispatch broadcasting, and route optimization tools for business shippers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl font-black text-orange-600">Top Rank</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Promoted Fleet Listings</h4>
              <p className="text-xs text-slate-600 mt-1">
                Transporters can promote their verified vehicles to businesses searching for immediate truck placement on high-density lanes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl font-black text-orange-600">Enterprise</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Custom Freight Solutions</h4>
              <p className="text-xs text-slate-600 mt-1">
                Dedicated fleet management, contracted volume guarantees, and ERP integration for large industrial shippers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

