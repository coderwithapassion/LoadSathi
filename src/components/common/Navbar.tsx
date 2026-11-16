import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogistics } from '../../context/LogisticsContext';
import {
  Truck,
  Bell,
  LogOut,
  User,
  Shield,
  Briefcase,
  Users,
  Menu,
  X,
  ChevronDown,
  Check
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, logout, switchDemoUser, isAuthenticated } = useAuth();
  const { notifications, markNotificationAsRead } = useLogistics();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchDemoUser(newRole);
    setIsRoleSwitcherOpen(false);
    navigate(`/dashboard/${newRole}`);
  };

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string }> = {
    business: { label: 'Business Owner', icon: Briefcase, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    transporter: { label: 'Transporter', icon: Truck, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    driver: { label: 'Driver', icon: Users, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    admin: { label: 'Platform Admin', icon: Shield, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {isAuthenticated && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-orange-500 shadow-md group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Load<span className="text-orange-600">Saathi</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                  Logistics
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
                Your Goods, Our Responsibility
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Right Nav Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/pricing"
                className="hidden sm:inline-block text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="hidden sm:inline-block text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                Overview
              </Link>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-800 hover:text-orange-600 px-3 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 transition hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <>
              {/* Demo Role Switcher Quick Pill (Crucial for Reviewers & Smooth Testing) */}
              <div className="relative">
                <button
                  onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                  title="Switch between roles for testing"
                >
                  <span className="text-slate-400">Demo Role:</span>
                  <span className="text-orange-600 font-bold capitalize">{role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isRoleSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role (Demo Mode)
                    </p>
                    {(['business', 'transporter', 'driver', 'admin'] as UserRole[]).map((r) => {
                      const item = roleLabels[r];
                      const Icon = item.icon;
                      const isActive = role === r;
                      return (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                            isActive
                              ? 'bg-orange-50 text-orange-700'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-500" />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-orange-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Role Badge */}
              {role && (
                <div
                  className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${roleLabels[role].color}`}
                >
                  {roleLabels[role].label}
                </div>
              )}

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-orange-400" />
                        <span className="font-bold text-sm">Notifications</span>
                      </div>
                      <span className="text-xs bg-slate-800 text-orange-300 px-2 py-0.5 rounded-full font-mono">
                        {unreadCount} unread
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-slate-500 text-center">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 text-xs hover:bg-slate-50 transition cursor-pointer ${
                              !notif.is_read ? 'bg-orange-50/50' : ''
                            }`}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.link) {
                                navigate(notif.link);
                                setIsNotifOpen(false);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{notif.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="mt-1 text-slate-600 line-clamp-2">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-200">
                    {user?.full_name ? user.full_name[0] : 'U'}
                  </div>
                  <span className="hidden lg:block text-xs font-bold text-slate-800 max-w-[120px] truncate">
                    {user?.full_name || 'My Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to={`/dashboard/${role}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        Dashboard
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

