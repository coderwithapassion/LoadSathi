import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Headphones, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Load<span className="text-orange-500">Saathi</span>
              </span>
            </Link>
            <p className="text-xs text-orange-400 font-semibold tracking-wide uppercase">
              "Your Goods, Our Responsibility."
            </p>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              India's premier smart logistics marketplace connecting verified businesses with reliable fleet owners, transporters, and verified commercial drivers. Instant quotes, guaranteed vehicle placement, and real-time corridor tracking.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>GST & E-Way Bill Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Headphones className="w-4 h-4 text-orange-400" />
                <span>24x7 Transit Support</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-orange-400 transition">
                  About LoadSaathi
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-orange-400 transition">
                  Pricing & Monetisation
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition">
                  Business Shipper Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-orange-400 transition">
                  Register as Transporter
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition">
                  Driver Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Corridors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Freight Corridors
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Delhi NCR &harr; Mumbai (NH 48)</li>
              <li>Bengaluru &harr; Chennai (NH 4)</li>
              <li>Pune &harr; Ahmedabad</li>
              <li>Kolkata &harr; Patna &harr; Delhi</li>
              <li>Hyderabad &harr; Bengaluru</li>
              <li>Ludhiana &harr; Delhi NCR</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Corporate Office
            </h4>
            <div className="space-y-3 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Level 7, Cyber City, Gurugram, Delhi NCR – 122002</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>1800-LOAD-SAATHI (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@loadsaathi.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} LoadSaathi Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Carriage of Goods Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

