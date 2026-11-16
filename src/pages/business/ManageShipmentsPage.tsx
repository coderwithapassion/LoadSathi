import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Package,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  XCircle,
  Eye,
  FileText,
  Calendar
} from 'lucide-react';
import { ShipmentStatus } from '../../types';

export const ManageShipmentsPage: React.FC = () => {
  const { shipments, cancelShipment } = useLogistics();
  const { businessDetails } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Cancel modal
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Filter
  const myShipments = shipments.filter(s => {
    const matchesSearch =
      s.shipment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pickup_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.delivery_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.goods_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCancel = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedShipmentId) return;
    if (!cancelReason.trim()) {
      alert('Please state a reason for cancelling this shipment.');
      return;
    }
    await cancelShipment(selectedShipmentId, cancelReason);
    setIsCancelModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Dispatches & Shipments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime directory of all active, booked, and transit cargo movements
          </p>
        </div>

        <Link
          to="/dashboard/business/create-shipment"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Shipment</span>
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID (e.g. LS-2026-1042), city, cargo..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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

      {/* Shipments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Shipment ID</th>
                <th className="py-3.5 px-4">Pickup Origin</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Vehicle Type</th>
                <th className="py-3.5 px-4">Date / Deadline</th>
                <th className="py-3.5 px-4">Budget</th>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {myShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">No shipments matching your filter criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the search terms or create a new shipment.</p>
                  </td>
                </tr>
              ) : (
                myShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {s.shipment_code}
                      {s.quotations_count !== undefined && s.quotations_count > 0 && s.status === 'BOOKED' && (
                        <span className="block text-[10px] text-orange-600 font-bold font-sans">
                          {s.quotations_count} bids received
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{s.pickup_city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {s.pickup_location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{s.delivery_city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {s.delivery_location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{s.vehicle_type}</div>
                      <div className="text-[11px] text-slate-500">{s.weight} {s.weight_unit}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-800">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{s.pickup_date}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Deadline: {s.delivery_deadline}</div>
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
                          className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition"
                          title="View Live Tracking & Map"
                        >
                          <MapPin className="w-4 h-4" />
                        </Link>

                        {s.status === 'BOOKED' && (
                          <Link
                            to="/dashboard/business/quotations"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Review Quotations"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                        )}

                        {!['DELIVERED', 'CANCELLED'].includes(s.status) && (
                          <button
                            onClick={() => handleOpenCancel(s.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Cancel Shipment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Reason Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Shipment Consignment"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to cancel this shipment? Please provide an authorized operational reason for platform record.
          </p>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cancellation Reason
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Factory dispatch schedule postponed, alternate vehicle arranged locally, order modified."
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

