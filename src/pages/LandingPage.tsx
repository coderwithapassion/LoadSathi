import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  PhoneCall,
  Boxes,
  Users,
  Compass,
  FileCheck2,
  Star
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-orange-400 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>Smart Indian Logistics Marketplace</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-300 font-normal">Your Goods, Our Responsibility</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Smarter Logistics. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                Faster Deliveries.
              </span>{' '}
              Better Business.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Connect with trusted transporters, book vehicles and track every shipment through one simple logistics platform.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/25 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base border border-slate-700 transition"
              >
                <span>Sign In to Dashboard</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% GST & KYC Verified Transporters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Advance Placement Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Highway Route Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corridor & Highlights Bar */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-100">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">12,500+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Verified Trucks</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-orange-600">450+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Pan-India Cities</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">₹42 Cr+</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Cargo Safely Moved</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">99.2%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">On-Time Placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              How LoadSaathi Works
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Transforming fragmented trucking operations into an efficient digital freight marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Post Cargo Needs',
                desc: 'Enter pickup, destination, weight, and preferred vehicle type in 60 seconds.',
                icon: Boxes
              },
              {
                step: '02',
                title: 'Receive Quotes',
                desc: 'Top verified fleet owners submit transparent, competitive bids with no hidden fees.',
                icon: DollarSign
              },
              {
                step: '03',
                title: 'Confirm & Assign',
                desc: 'Accept the best quotation. Vehicle registration and driver contact are instantly linked.',
                icon: FileCheck2
              },
              {
                step: '04',
                title: 'Live Tracking & POD',
                desc: 'Monitor movement across checkpoints with Leaflet OpenStreetMap and digital proof of delivery.',
                icon: Compass
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative group hover:shadow-md transition">
                  <span className="text-4xl font-black text-slate-100 group-hover:text-orange-100 transition absolute top-4 right-4">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stakeholder Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Business Owners */}
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">For Shippers & Manufacturers</span>
                  <h3 className="text-2xl font-bold text-slate-900">Why Businesses Choose Us</h3>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Save Up to 18% Freight Cost', desc: 'Transparent bidding eliminates unnecessary middleman broker commissions.' },
                  { title: 'Guaranteed Vehicle Placement', desc: 'Pre-verified fleet owners ensure your cargo never sits delayed on the dispatch dock.' },
                  { title: 'Real-Time Highway Tracking', desc: 'Accurate milestone timelines and Leaflet interactive map keep your clients updated.' },
                  { title: 'Instant GST & E-Way Bill Compliance', desc: 'Digital paperwork, automated consignment notes, and prompt receipt generation.' },
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{b.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Post your first shipment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* For Transporters & Drivers */}
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">For Fleet Owners & Transporters</span>
                  <h3 className="text-2xl font-bold text-slate-900">Maximize Fleet Revenue</h3>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Eliminate Return Empty Trips', desc: 'Find high-paying loads on your return corridor before your vehicle even arrives.' },
                  { title: 'Fast & Secure Escrow Settlements', desc: 'No more waiting 45 days for transport bills. Instant milestone-based payments.' },
                  { title: 'Direct Enterprise Shippers', desc: 'Connect with verified manufacturing companies directly without local brokerage cut.' },
                  { title: 'Driver Mobile Dashboard', desc: 'Drivers can view routes, update statuses, and submit proof of delivery in one click.' },
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{b.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
                >
                  <span>Register your commercial fleet</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Trust */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold">Trusted Across Key Indian Corridors</h2>
            <p className="text-slate-400 text-sm mt-2">
              Hear from businesses and fleet operators who rely on LoadSaathi daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "LoadSaathi cut our dispatch coordination time by 60%. Getting 3 verified quotes within an hour for our Delhi to Mumbai machinery runs is a game changer.",
                name: "Rajesh Sharma",
                role: "Director, Delhi Tech Exports Pvt Ltd",
                rating: 5
              },
              {
                quote: "With LoadSaathi, our 14-vehicle fleet has zero idle days. We regularly get return loads from Pune to Ahmedabad with verified advance payments.",
                name: "Vikramjit Singh",
                role: "Founder, Singh Express Roadways",
                rating: 5
              },
              {
                quote: "The driver status updates are extremely simple. As a commercial driver, updating status from my mobile when passing tolls takes only 5 seconds.",
                name: "Ramesh Yadav",
                role: "Senior Heavy Vehicle Driver (8 Yrs Exp)",
                rating: 5
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-orange-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Streamline Your Freight Operations?
          </h2>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto">
            Join thousands of businesses and transporters already powering India's supply chain on LoadSaathi.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-2xl transition hover:-translate-y-0.5"
            >
              Create Free Account
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/30 backdrop-blur-md transition"
            >
              Explore Business Model
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

