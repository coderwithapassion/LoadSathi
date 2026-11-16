import React from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Briefcase,
  Truck,
  Package,
  CheckCircle2,
  IndianRupee,
  Shield,
  ArrowRight,
  AlertCircle,
  Activity,
  FileCheck2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { getAdminStats, shipments, complaints, vehicles, payments } = useLogistics();
  const stats = getAdminStats();

  const platformRevenue = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + p.platform_fee, 0);

  const pendingVehicles = vehicles.filter(v => v.approval_status === 'pending');
  const openComplaints = complaints.filter(c => c.status === 'open');

  const roleDistribution = [
    { name: 'Businesses', value: stats.businesses, color: '#3B82F6' },
    { name: 'Transporters', value: stats.transporters, color: '#FF6B00' },
    { name: 'Drivers', value: stats.drivers, color: '#10B981' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800/40">
              Platform Administration
            </span>
            <span className="text-xs bg-purple-950/60 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-800/40">
              Superadmin Mode
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            LoadSaathi Central Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live operations monitoring: fleet compliance, corridor escrow, user KYC, and freight settlement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/admin/vehicles"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            Vehicle Approvals ({pendingVehicles.length})
          </Link>
          <Link
            to="/dashboard/admin/users"
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition"
          >
            Manage Accounts
          </Link>
        </div>
      </div>

      {/* 7 Admin Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          icon={Users}
          colorScheme="blue"
          subtitle={`${stats.businesses} Biz, ${stats.transporters} Fleets`}
        />
        <StatCard
          title="Total Shipments"
          value={stats.totalShipments}
          icon={Package}
          colorScheme="orange"
          subtitle={`${stats.activeShipments} currently active`}
        />
        <StatCard
          title="Delivered Consignments"
          value={stats.deliveredShipments}
          icon={CheckCircle2}
          colorScheme="emerald"
          trend={{ value: '99.2% success', isPositive: true }}
        />
        <StatCard
          title="Platform Fee Revenue"
          value={`₹${platformRevenue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          colorScheme="navy"
          trend={{ value: '10% Commission', isPositive: true }}
        />
      </div>

      {/* Attention / Alerts Row */}
      {(pendingVehicles.length > 0 || openComplaints.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingVehicles.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>{pendingVehicles.length} Vehicles</strong> pending RTO verification & permit check.</span>
              </div>
              <Link to="/dashboard/admin/vehicles" className="font-bold underline text-amber-950">
                Review &rarr;
              </Link>
            </div>
          )}

          {openComplaints.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span><strong>{openComplaints.length} Open Dispute</strong> on corridor transit.</span>
              </div>
              <Link to="/dashboard/admin/complaints" className="font-bold underline text-rose-950">
                Investigate &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">User Network Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Active profiles by verified ecosystem role</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-4 border-t border-slate-100">
            {roleDistribution.map(r => (
              <div key={r.name}>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{r.name}</span>
                <p className="font-extrabold text-slate-900 text-base">{r.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Corridor Freight Volume */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Freight Gross Volume</h3>
              <p className="text-xs text-slate-500 mt-0.5">Consignment values across top trading corridors</p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { corridor: 'DEL - BOM', value: 48000 },
                  { corridor: 'PUN - AMD', value: 26000 },
                  { corridor: 'BLR - MAA', value: 34000 },
                  { corridor: 'JAI - DEL', value: 38000 },
                  { corridor: 'LUH - DEL', value: 22000 },
                ]}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="corridor" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Shipment Value']} />
                <Bar dataKey="value" fill="#0B1A2F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Dispatches Full Audit */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Platform-Wide Shipments Audit</h3>
            <p className="text-xs text-slate-500">Live monitoring of all consignments</p>
          </div>
          <Link
            to="/dashboard/admin/shipments"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Shipments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Shipment Code</th>
                <th className="py-3 px-4">Shipper Enterprise</th>
                <th className="py-3 px-4">Origin &rarr; Destination</th>
                <th className="py-3 px-4">Assigned Fleet</th>
                <th className="py-3 px-4">Consignment Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    {s.shipment_code}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {s.business_name}
                  </td>
                  <td className="py-4 px-4">
                    {s.pickup_city} &rarr; {s.delivery_city}
                  </td>
                  <td className="py-4 px-4">
                    {s.assigned_transporter || 'Unassigned (Bidding Open)'}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    ₹{s.expected_budget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

