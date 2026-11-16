import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import {
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Clock,
  IndianRupee,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export const ComplaintsTransactionsPage: React.FC = () => {
  const { complaints, payments, resolveComplaint } = useLogistics();

  const handleResolve = async (id: string) => {
    await resolveComplaint(id);
  };

  const totalFeeCollected = payments
    .filter(p => p.payment_status === 'completed')
    .reduce((sum, p) => sum + p.platform_fee, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Transit Disputes & Platform Financial Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Escrow settlement oversight, shipper complaints, and 10% platform revenue audit
        </p>
      </div>

      {/* Disputes Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cargo & Highway Transit Grievances</h3>
            <p className="text-xs text-slate-500">Disputes filed by shippers or transporters during transit</p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            {complaints.filter(c => c.status === 'open').length} Open Grievances
          </span>
        </div>

        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                c.status === 'open'
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {c.shipment_code}
                  </span>
                  <span className="text-xs font-bold text-slate-700">&bull; Raised by {c.raised_by_name} ({c.raised_by_role})</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      c.status === 'open'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 pt-1">{c.subject}</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{c.description}</p>
              </div>

              {c.status === 'open' ? (
                <button
                  onClick={() => handleResolve(c.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition whitespace-nowrap"
                >
                  Mark as Resolved
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Resolved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial Transactions Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Platform Escrow & Revenue Ledger</h3>
            <p className="text-xs text-slate-500">Every freight consignment transaction with 10% commission accounting</p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue Retained</span>
            <p className="text-xl font-black text-slate-900">
              ₹{totalFeeCollected.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Transaction Ref</th>
                <th className="py-3.5 px-4">Shipment</th>
                <th className="py-3.5 px-4">Gross Freight Value</th>
                <th className="py-3.5 px-4">LoadSaathi Fee (10%)</th>
                <th className="py-3.5 px-4">Transporter Payout</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {payments.map((p) => {
                const payout = p.amount - p.platform_fee;
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
                    <td className="py-4 px-4 font-bold text-orange-600">
                      ₹{p.platform_fee.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">
                      ₹{payout.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {p.payment_method}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.payment_status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.payment_status === 'completed' ? 'Settled to Fleet' : 'Held in Escrow'}
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

