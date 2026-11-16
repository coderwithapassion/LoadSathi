import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  History,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Calendar,
  IndianRupee,
  Star,
  MapPin,
  Download
} from 'lucide-react';

export const ShipmentHistoryPage: React.FC = () => {
  const { shipments, bookings } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');

  const pastShipments = shipments.filter(s => {
    const isPast = ['DELIVERED', 'CANCELLED'].includes(s.status);
    const matchesSearch =
      s.shipment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pickup_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.delivery_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.goods_type.toLowerCase().includes(searchTerm.toLowerCase());

    return isPast && matchesSearch;
  });

  const totalDelivered = shipments.filter(s => s.status === 'DELIVERED').length;
  const totalCancelled = shipments.filter(s => s.status === 'CANCELLED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Shipment Consignment Archive
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical records of completed factory deliveries, consignment notes and proof of deliveries (POD)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            {totalDelivered} Delivered
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200">
            {totalCancelled} Cancelled
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past shipments by ID, route, goods..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          />
        </div>
      </div>

      {/* Past Shipments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Shipment ID</th>
                <th className="py-3.5 px-4">Route</th>
                <th className="py-3.5 px-4">Goods & Weight</th>
                <th className="py-3.5 px-4">Completed Date</th>
                <th className="py-3.5 px-4">Transporter</th>
                <th className="py-3.5 px-4">Final Paid</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt / Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {pastShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">No historical shipment records found</p>
                  </td>
                </tr>
              ) : (
                pastShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {s.shipment_code}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{s.pickup_city} &rarr; {s.delivery_city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{s.delivery_location}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 truncate max-w-[160px]">{s.goods_type}</div>
                      <div className="text-[11px] text-slate-500">{s.weight} {s.weight_unit} ({s.packages_count} pkgs)</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono">
                      {s.delivery_deadline}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{s.assigned_transporter || 'Direct Fleet'}</div>
                      <div className="text-[11px] text-slate-500">{s.assigned_vehicle || 'Verified Truck'}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      ₹{s.expected_budget.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dashboard/business/track/${s.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          View Log
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

