import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck, Lock, Mail, ArrowRight, AlertCircle, Shield, Briefcase, Users, Check } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);

    if (result.success) {
      // Determine destination based on email or user in context
      if (email.includes('transporter') || email.includes('singhlogistics')) {
        navigate('/dashboard/transporter');
      } else if (email.includes('driver')) {
        navigate('/dashboard/driver');
      } else if (email.includes('admin')) {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/business');
      }
    } else {
      setError(result.error || 'Login failed. Please verify your credentials.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchDemoUser(role);
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Truck className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to <span className="text-orange-600">LoadSaathi</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          "Your Goods, Our Responsibility."
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Role Login for instant testing */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              1-Click Demo Evaluation Sign-In
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('business')}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-800 font-semibold text-left flex items-center gap-2 transition"
              >
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold">Business Owner</div>
                  <div className="text-[10px] text-blue-600">Rajesh Sharma</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('transporter')}
                className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-50 text-orange-800 font-semibold text-left flex items-center gap-2 transition"
              >
                <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold">Transporter</div>
                  <div className="text-[10px] text-orange-600">Vikramjit Singh</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('driver')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 font-semibold text-left flex items-center gap-2 transition"
              >
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold">Driver</div>
                  <div className="text-[10px] text-emerald-600">Ramesh Yadav</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-800 font-semibold text-left flex items-center gap-2 transition"
              >
                <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold">Admin Panel</div>
                  <div className="text-[10px] text-purple-600">Amitabh Sen</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

