import React from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Package,
  TrendingUp,
  Truck,
  CheckCircle2,
  Clock,
  IndianRupee,
  PlusCircle,
  ArrowRight,
  MapPin,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const BusinessDashboard: React.FC = () => {
  const { shipments, quotations, payments } = useLogistics();
  const { businessDetails, user } = useAuth();

  // Filter shipments for this business
  const myShipments = shipments.filter(
    s => !s.business_id || s.business_id === businessDetails?.id || s.business_name?.includes('Delhi Tech')
  );

  const totalShipments = myShipments.length;
  const activeShipments = myShipments.filter(
    s => !['DELIVERED', 'CANCELLED'].includes(s.status)
  ).length;
  const deliveredShipments = myShipments.filter(s => s.status === 'DELIVERED').length;
  const pendingBookings = myShipments.filter(s => s.status === 'BOOKED').length;

  const totalExpenditure = myShipments.reduce((sum, s) => {
    return sum + (s.expected_budget || 0);
  }, 0);

  // Pending quotations awaiting business review
  const pendingQuotes = quotations.filter(q => q.status === 'pending');

  // Realistic monthly expenditure chart data
  const chartData = [
    { month: 'Jun', expenditure: 45000, shipments: 2 },
    { month: 'Jul', expenditure: 78000, shipments: 3 },
    { month: 'Aug', expenditure: 110000, shipments: 4 },
    { month: 'Sep', expenditure: 95000, shipments: 3 },
    { month: 'Oct', expenditure: 142000, shipments: 5 },
    { month: 'Nov', expenditure: totalExpenditure || 165000, shipments: totalShipments },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800/40">
            Shipper Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Welcome back, {user?.full_name || 'Shipper'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {businessDetails?.business_name || 'Delhi Tech Exports Pvt Ltd'} &bull; Monitoring all factory dispatches, live highway shipments and quotations.
          </p>
        </div>

        <Link
          to="/dashboard/business/create-shipment"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Shipment</span>
        </Link>
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <StatCard
          title="Total Shipments"
          value={totalShipments}
          icon={Package}
          colorScheme="blue"
          trend={{ value: '+12% this month', isPositive: true }}
        />
        <StatCard
          title="Active Shipments"
          value={activeShipments}
          icon={Truck}
          colorScheme="orange"
          subtitle="Currently on road"
        />
        <StatCard
          title="Delivered"
          value={deliveredShipments}
          icon={CheckCircle2}
          colorScheme="emerald"
          subtitle="100% POD verified"
        />
        <StatCard
          title="Pending Bookings"
          value={pendingBookings}
          icon={Clock}
          colorScheme="amber"
          subtitle="Waiting for quotes"
        />
        <StatCard
          title="Total Freight Spend"
          value={`₹${(totalExpenditure / 1000).toFixed(1)}k`}
          icon={IndianRupee}
          colorScheme="navy"
          trend={{ value: 'Saved ₹18.5k', isPositive: true }}
        />
      </div>

      {/* Pending Quotations Alert Banner */}
      {pendingQuotes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                You have {pendingQuotes.length} Transport Quotations Awaiting Review
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Transporters have placed competitive bids for your posted loads. Review and confirm vehicle allocation.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/business/quotations"
            className="px-4 py-2 rounded-xl bg-amber-900 text-white font-bold text-xs hover:bg-amber-800 transition whitespace-nowrap"
          >
            Review Quotations &rarr;
          </Link>
        </div>
      )}

      {/* Monthly Expenditure Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Freight Expenditure Trends</h3>
            <p className="text-xs text-slate-500">Monthly logistics spending (INR) across dispatch corridors</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start">
            Fiscal Year 2026
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="expenditureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Expenditure']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="expenditure"
                stroke="#FF6B00"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#expenditureGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Dispatches Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Active Shipments Overview</h3>
            <p className="text-xs text-slate-500">Live consignments currently booked or moving on corridors</p>
          </div>
          <Link
            to="/dashboard/business/manage-shipments"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-4">Origin &rarr; Destination</th>
                <th className="py-3 px-4">Goods & Weight</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {myShipments.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    {s.shipment_code}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">
                      {s.pickup_city} &rarr; {s.delivery_city}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                      {s.delivery_location}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="truncate max-w-[150px] font-semibold">{s.goods_type}</div>
                    <div className="text-[11px] text-slate-500">{s.weight} {s.weight_unit} ({s.packages_count} pkgs)</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {s.assigned_vehicle || s.vehicle_type}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    ₹{s.expected_budget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/dashboard/business/track/${s.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs transition"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </Link>
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

