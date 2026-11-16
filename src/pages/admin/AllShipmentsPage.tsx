import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Package,
  Search,
  Filter,
  MapPin,
  Calendar,
  IndianRupee,
  Truck
} from 'lucide-react';

export const AllShipmentsPage: React.FC = () => {
  const { shipments } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.shipment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pickup_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.delivery_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.business_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          All Platform Shipments
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Global consignment repository across all registered shippers and corridors
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code, shipper, city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'BOOKED', 'CONFIRMED', 'IN TRANSIT', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Shipper Enterprise</th>
                <th className="py-3.5 px-4">Corridor Route</th>
                <th className="py-3.5 px-4">Goods & Weight</th>
                <th className="py-3.5 px-4">Assigned Fleet</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredShipments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    {s.shipment_code}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {s.business_name}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{s.pickup_city} &rarr; {s.delivery_city}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.delivery_location}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{s.goods_type}</div>
                    <div className="text-[10px] text-slate-500">{s.weight} {s.weight_unit} ({s.packages_count} pkgs)</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800">{s.assigned_transporter || 'Open for Bids'}</div>
                    <div className="text-[10px] text-slate-500">{s.assigned_vehicle || 'No vehicle'}</div>
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
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                    >
                      Inspect Route
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

