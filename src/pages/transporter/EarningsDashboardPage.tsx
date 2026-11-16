import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatCard } from '../../components/common/StatCard';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  Download,
  CreditCard,
  FileCheck,
  TrendingUp
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

export const EarningsDashboardPage: React.FC = () => {
  const { payments, bookings } = useLogistics();

  const totalEarnings = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + (p.amount - p.platform_fee), 0);

  const completedBookings = bookings.filter(b => b.booking_status === 'completed').length;

  const pendingPayments = payments
    .filter(p => p.payment_status === 'pending')
    .reduce((sum, p) => sum + (p.amount - p.platform_fee), 0);

  const earningsChartData = [
    { month: 'Jun', netPayout: 52000, commission: 5200 },
    { month: 'Jul', netPayout: 84000, commission: 8400 },
    { month: 'Aug', netPayout: 120000, commission: 12000 },
    { month: 'Sep', netPayout: 105000, commission: 10500 },
    { month: 'Oct', netPayout: 148000, commission: 14800 },
    { month: 'Nov', netPayout: totalEarnings || 165000, commission: 16500 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Transporter Earnings & Payout Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Settlement statements, escrow payouts, and completed freight billing
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Net Earnings (Paid)"
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          colorScheme="emerald"
          trend={{ value: '+14% MoM', isPositive: true }}
        />
        <StatCard
          title="Completed Bookings"
          value={completedBookings}
          icon={CheckCircle2}
          colorScheme="blue"
          subtitle="All consignments delivered"
        />
        <StatCard
          title="Pending Settlement (In Escrow)"
          value={`₹${pendingPayments.toLocaleString('en-IN')}`}
          icon={Clock}
          colorScheme="amber"
          subtitle="Released upon POD approval"
        />
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Monthly Payout Trends</h3>
        <p className="text-xs text-slate-500 mb-6">Net amount credited to your registered bank account</p>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsChartData}>
              <defs>
                <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
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
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Net Payout']}
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
                dataKey="netPayout"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#payoutGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Transaction & Settlement History</h3>
          <p className="text-xs text-slate-500">Every freight consignment with fee breakdown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Shipment</th>
                <th className="py-3.5 px-4">Gross Freight</th>
                <th className="py-3.5 px-4">Platform Fee (10%)</th>
                <th className="py-3.5 px-4">Net Payout</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payments.map((p) => {
                const net = p.amount - p.platform_fee;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {p.transaction_reference}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-orange-600">
                      {p.shipment_code}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-rose-600">
                      - ₹{p.platform_fee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-600 text-sm">
                      ₹{net.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {p.payment_method}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.payment_status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.payment_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

