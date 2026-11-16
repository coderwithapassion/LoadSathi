import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileText,
  Truck,
  Star,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const QuotationsPage: React.FC = () => {
  const { quotations, shipments, acceptQuotation, rejectQuotation } = useLogistics();
  const [filterShipment, setFilterShipment] = useState<string>('ALL');

  const filteredQuotes = quotations.filter(q => {
    if (filterShipment === 'ALL') return true;
    return q.shipment_id === filterShipment;
  });

  const handleAccept = async (id: string) => {
    if (window.confirm('Accept this quotation? This will confirm the transporter and assign vehicle & driver.')) {
      await acceptQuotation(id);
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm('Reject this quotation?')) {
      await rejectQuotation(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Transporter Quotations & Bids
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare competitive freight proposals, inspect transporter ratings, and confirm bookings
          </p>
        </div>

        {/* Filter by shipment dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Filter Shipment:</span>
          <select
            value={filterShipment}
            onChange={(e) => setFilterShipment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Active Shipments</option>
            {shipments.map(s => (
              <option key={s.id} value={s.id}>
                {s.shipment_code} ({s.pickup_city} &rarr; {s.delivery_city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quotation Cards Grid */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30 text-orange-500" />
          <p className="text-sm font-bold text-slate-700">No Quotations Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Quotations submitted by transporters will show up here. You can also post a new shipment to invite bids.
          </p>
          <Link
            to="/dashboard/business/create-shipment"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
          >
            Post Shipment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotes.map((q) => {
            const shipment = shipments.find(s => s.id === q.shipment_id);

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm transition hover:shadow-md ${
                  q.status === 'accepted'
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20'
                    : q.status === 'rejected'
                    ? 'border-slate-200 opacity-60'
                    : 'border-slate-200'
                }`}
              >
                {/* Header: Transporter Name & Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center font-bold text-lg">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {q.transporter_name || 'Fleet Operator'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[11px]">
                          <Star className="w-3 h-3 fill-current" />
                          {q.transporter_rating || 4.8}
                        </span>
                        <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified Transporter
                        </span>
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={q.status} />
                </div>

                {/* Target Shipment Details */}
                {shipment && (
                  <div className="bg-slate-50 rounded-2xl p-3 mb-4 text-xs flex items-center justify-between border border-slate-200/80">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Shipment</span>
                      <p className="font-bold text-slate-900 font-mono mt-0.5">
                        {shipment.shipment_code} &bull; {shipment.pickup_city} &rarr; {shipment.delivery_city}
                      </p>
                      <p className="text-[11px] text-slate-500">{shipment.goods_type} ({shipment.weight} {shipment.weight_unit})</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Target Budget</span>
                      <p className="font-bold text-slate-700">₹{shipment.expected_budget.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                )}

                {/* Quote Pricing & Delivery Time */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Proposed Price
                    </span>
                    <p className="text-2xl font-black text-slate-900 mt-0.5 flex items-center">
                      ₹{q.proposed_price.toLocaleString('en-IN')}
                    </p>
                    {q.additional_charges ? (
                      <p className="text-[10px] text-slate-500">+ ₹{q.additional_charges} toll/entry charge</p>
                    ) : (
                      <p className="text-[10px] text-emerald-600 font-semibold">All tolls & taxes included</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Estimated Transit Time
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {q.estimated_delivery}
                    </p>
                    {q.vehicle_info && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {q.vehicle_info}
                      </p>
                    )}
                  </div>
                </div>

                {/* Transporter Note */}
                {q.message && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-4">
                    "{q.message}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Received: {new Date(q.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>

                  {q.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReject(q.id)}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(q.id)}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept & Book</span>
                      </button>
                    </div>
                  ) : q.status === 'accepted' ? (
                    <Link
                      to={`/dashboard/business/track/${q.shipment_id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Track Shipment &rarr;</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

