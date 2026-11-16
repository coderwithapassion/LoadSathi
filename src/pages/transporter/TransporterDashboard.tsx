import React from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Star,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const TransporterDashboard: React.FC = () => {
  const { shipments, quotations, bookings, vehicles, payments } = useLogistics();
  const { transporterDetails, user } = useAuth();

  // Available requests posted by businesses (status = 'BOOKED')
  const availableRequests = shipments.filter(s => s.status === 'BOOKED');

  // Bookings where this transporter is assigned
  const myBookings = bookings;
  const activeBookings = myBookings.filter(b => ['confirmed', 'ongoing'].includes(b.booking_status));
  const completedDeliveries = myBookings.filter(b => b.booking_status === 'completed');

  // Total earnings calculated from completed payments / bookings
  const totalEarnings = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + (p.amount - p.platform_fee), 0);

  // Pending quotations submitted by this transporter
  const pendingQuotations = quotations.filter(q => q.status === 'pending');

  const earningsChartData = [
    { month: 'Jun', earnings: 52000, trips: 2 },
    { month: 'Jul', earnings: 84000, trips: 3 },
    { month: 'Aug', earnings: 120000, trips: 4 },
    { month: 'Sep', earnings: 105000, trips: 4 },
    { month: 'Oct', earnings: 148000, trips: 5 },
    { month: 'Nov', earnings: totalEarnings || 165000, trips: 6 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800/40">
              Fleet Operator Control Hub
            </span>
            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Fleet
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            {transporterDetails?.company_name || 'Singh Express Roadways'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Logged in as {user?.full_name} &bull; Rating: {transporterDetails?.rating || 4.8} / 5.0 ({transporterDetails?.total_reviews || 46} verified shipper reviews)
          </p>
        </div>

        <Link
          to="/dashboard/transporter/available-shipments"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all hover:scale-105 shrink-0"
        >
          <Package className="w-4 h-4" />
          <span>Find Available Loads ({availableRequests.length})</span>
        </Link>
      </div>

      {/* 5 Transporter Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <StatCard
          title="Available Loads"
          value={availableRequests.length}
          icon={Package}
          colorScheme="orange"
          subtitle="Open for quotations"
        />
        <StatCard
          title="Active Bookings"
          value={activeBookings.length}
          icon={Truck}
          colorScheme="blue"
          subtitle="Vehicles en route"
        />
        <StatCard
          title="Completed Deliveries"
          value={completedDeliveries.length}
          icon={CheckCircle2}
          colorScheme="emerald"
          subtitle="100% On-time"
        />
        <StatCard
          title="Pending Bids"
          value={pendingQuotations.length}
          icon={Clock}
          colorScheme="amber"
          subtitle="Awaiting shipper accept"
        />
        <StatCard
          title="Net Earnings"
          value={`₹${(totalEarnings / 1000).toFixed(1)}k`}
          icon={IndianRupee}
          colorScheme="navy"
          trend={{ value: '+18% MoM', isPositive: true }}
        />
      </div>

      {/* Monthly Net Earnings Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Transporter Revenue & Earnings</h3>
            <p className="text-xs text-slate-500">Gross payout after 10% platform commission deduction</p>
          </div>
          <Link
            to="/dashboard/transporter/earnings"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Financial Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Net Earnings']}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="earnings" fill="#FF6B00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Cargo Demands Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Immediate Load Opportunities</h3>
            <p className="text-xs text-slate-500">Post quotations and secure placement for your fleet</p>
          </div>
          <Link
            to="/dashboard/transporter/available-shipments"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All ({availableRequests.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {availableRequests.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">No open shipment requests right now.</p>
          ) : (
            availableRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-orange-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded">
                      {req.shipment_code}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">&bull; {req.business_name}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{req.pickup_city}</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span>{req.delivery_city}</span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span><strong>Cargo:</strong> {req.goods_type}</span>
                    <span><strong>Weight:</strong> {req.weight} {req.weight_unit}</span>
                    <span><strong>Vehicle:</strong> {req.vehicle_type}</span>
                    <span><strong>Pickup:</strong> {req.pickup_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Shipper Budget</span>
                    <p className="text-base font-black text-slate-900">
                      ₹{req.expected_budget.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link
                    to="/dashboard/transporter/available-shipments"
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition whitespace-nowrap"
                  >
                    Bid Quotation &rarr;
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

