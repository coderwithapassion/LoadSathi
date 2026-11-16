import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  FileText,
  MapPin,
  History,
  Truck,
  BookmarkCheck,
  CreditCard,
  Users,
  ShieldCheck,
  AlertCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user, businessDetails, transporterDetails } = useAuth();

  const businessNav = [
    { name: 'Dashboard Overview', path: '/dashboard/business', icon: LayoutDashboard },
    { name: 'Create Shipment', path: '/dashboard/business/create-shipment', icon: PlusCircle },
    { name: 'Manage Shipments', path: '/dashboard/business/manage-shipments', icon: Package },
    { name: 'Quotations', path: '/dashboard/business/quotations', icon: FileText },
    { name: 'Live Tracking', path: '/dashboard/business/track', icon: MapPin },
    { name: 'Shipment History', path: '/dashboard/business/history', icon: History },
  ];

  const transporterNav = [
    { name: 'Transporter Overview', path: '/dashboard/transporter', icon: LayoutDashboard },
    { name: 'Available Shipments', path: '/dashboard/transporter/available-shipments', icon: Package },
    { name: 'Manage Bookings', path: '/dashboard/transporter/bookings', icon: BookmarkCheck },
    { name: 'Vehicle Fleet', path: '/dashboard/transporter/vehicles', icon: Truck },
    { name: 'Earnings & Payments', path: '/dashboard/transporter/earnings', icon: CreditCard },
  ];

  const driverNav = [
    { name: 'My Deliveries', path: '/dashboard/driver', icon: Truck },
  ];

  const adminNav = [
    { name: 'Admin Overview', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'User Management', path: '/dashboard/admin/users', icon: Users },
    { name: 'Vehicle Approvals', path: '/dashboard/admin/vehicles', icon: ShieldCheck },
    { name: 'All Shipments', path: '/dashboard/admin/shipments', icon: Package },
    { name: 'Disputes & Escrow', path: '/dashboard/admin/complaints', icon: AlertCircle },
  ];

  const navItems =
    role === 'business'
      ? businessNav
      : role === 'transporter'
      ? transporterNav
      : role === 'driver'
      ? driverNav
      : role === 'admin'
      ? adminNav
      : [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden mb-4 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Profile Summary Pill */}
          <div className="p-3 mb-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
              {role === 'business'
                ? businessDetails?.business_name || 'Business Enterprise'
                : role === 'transporter'
                ? transporterDetails?.company_name || 'Transport Fleet'
                : role === 'driver'
                ? 'Commercial Driver'
                : 'Super Administrator'}
            </p>
            <p className="text-xs font-bold text-white truncate mt-0.5">{user?.full_name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path.split('/').length <= 3}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Tagline / Help */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
          <div className="flex items-center gap-2 text-white font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>24x7 Cargo Helpline</span>
          </div>
          <p className="text-slate-400">Toll Free: 1800-LOAD-SAATHI</p>
          <p className="text-[10px] text-slate-500 mt-2">v1.2 &bull; LoadSaathi Freight Tech</p>
        </div>
      </aside>
    </>
  );
};

