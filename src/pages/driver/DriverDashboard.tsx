import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ShipmentMap } from '../../components/map/ShipmentMap';
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle2,
  Navigation,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Upload,
  Calendar,
  XCircle,
  Package
} from 'lucide-react';
import { ShipmentStatus } from '../../types';

export const DriverDashboard: React.FC = () => {
  const { shipments, updateShipmentStatus, cancelShipment, getShipmentTracking } = useLogistics();
  const { user, driverDetails } = useAuth();

  // Find assigned shipment (active one first)
  const activeShipment = shipments.find(s => ['CONFIRMED', 'PICKED UP', 'IN TRANSIT', 'OUT FOR DELIVERY'].includes(s.status)) || shipments[0];

  const [currentLocationInput, setCurrentLocationInput] = useState('NH 48 Toll Plaza, Near Surat Highway');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [podUrl, setPodUrl] = useState('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80');

  // Modal for POD / Complete Delivery
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!activeShipment) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-slate-900">No Active Trips Assigned</h3>
        <p className="text-xs text-slate-500 mt-1">Check with your transport manager to receive trip dispatches.</p>
      </div>
    );
  }

  const updates = getShipmentTracking(activeShipment.id);

  // Status progression helper
  const handleAdvanceStatus = async (nextStatus: ShipmentStatus) => {
    let loc = currentLocationInput;
    let desc = descriptionInput;

    if (nextStatus === 'PICKED UP') {
      loc = activeShipment.pickup_city + ' Depot';
      desc = `Goods verified and loaded on vehicle ${activeShipment.assigned_vehicle || 'DL 01 AA 4291'}.`;
    } else if (nextStatus === 'IN TRANSIT') {
      loc = 'Expressway Checkpoint (NH 48)';
      desc = `Vehicle rolling on national highway corridor towards ${activeShipment.delivery_city}.`;
    } else if (nextStatus === 'OUT FOR DELIVERY') {
      loc = activeShipment.delivery_city + ' Outer Bypass';
      desc = `Arrived at destination city. Navigating to consignee unloading dock.`;
    }

    await updateShipmentStatus(activeShipment.id, nextStatus, loc, desc);
    setDescriptionInput('');
  };

  const handleDeliverPOD = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateShipmentStatus(
      activeShipment.id,
      'DELIVERED',
      activeShipment.delivery_city + ' Consignee Gate',
      `Goods unloaded safely and handover signed. Proof of delivery uploaded.`,
      podUrl
    );
    setIsPodModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please enter reason for cancellation');
      return;
    }
    await cancelShipment(activeShipment.id, cancelReason);
    setIsCancelModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mobile-Friendly Top Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
              Commercial Driver App
            </span>
            <h2 className="text-base font-extrabold">{user?.full_name || 'Ramesh Yadav'}</h2>
            <p className="text-[11px] text-slate-400 font-mono">
              License: {driverDetails?.license_number || 'DL-0420180098412'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Truck</span>
          <p className="text-sm font-black font-mono text-orange-400">
            {activeShipment.assigned_vehicle || 'DL 01 AA 4291'}
          </p>
        </div>
      </div>

      {/* Main Assigned Shipment Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
            {activeShipment.shipment_code}
          </span>
          <StatusBadge status={activeShipment.status} size="md" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {activeShipment.pickup_city} &rarr; {activeShipment.delivery_city}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeShipment.goods_type} &bull; {activeShipment.weight} {activeShipment.weight_unit} ({activeShipment.packages_count} packages)
          </p>
        </div>

        {/* Route Details Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pickup Location</span>
              <p className="font-bold text-slate-900">{activeShipment.pickup_location}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Contact: {activeShipment.contact_person} ({activeShipment.contact_phone})</p>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-3 flex items-start gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination Delivery</span>
              <p className="font-bold text-slate-900">{activeShipment.delivery_location}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Deadline: {activeShipment.delivery_deadline}</p>
            </div>
          </div>
        </div>

        {/* Shipper Phone Action Bar */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${activeShipment.contact_phone}`}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Dispatch ({activeShipment.contact_phone})</span>
          </a>
        </div>

        {/* Interactive Map */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Trip Route Navigation
          </h4>
          <ShipmentMap
            pickupLocation={{
              name: activeShipment.pickup_location,
              city: activeShipment.pickup_city,
              lat: activeShipment.pickup_lat,
              lng: activeShipment.pickup_lng
            }}
            deliveryLocation={{
              name: activeShipment.delivery_location,
              city: activeShipment.delivery_city,
              lat: activeShipment.delivery_lat,
              lng: activeShipment.delivery_lng
            }}
            status={activeShipment.status}
            height="260px"
          />
        </div>

        {/* 1-Tap Driver Action Progression Buttons */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Update Consignment Progress
          </h4>

          {activeShipment.status === 'CONFIRMED' && (
            <button
              onClick={() => handleAdvanceStatus('PICKED UP')}
              className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl shadow-purple-600/20 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Mark Goods as Picked Up & Loaded</span>
            </button>
          )}

          {activeShipment.status === 'PICKED UP' && (
            <button
              onClick={() => handleAdvanceStatus('IN TRANSIT')}
              className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Truck className="w-5 h-5" />
              <span>Depart Pickup & Mark In Transit</span>
            </button>
          )}

          {activeShipment.status === 'IN TRANSIT' && (
            <button
              onClick={() => handleAdvanceStatus('OUT FOR DELIVERY')}
              className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Mark Out For Delivery (Arrived in City)</span>
            </button>
          )}

          {activeShipment.status === 'OUT FOR DELIVERY' && (
            <button
              onClick={() => setIsPodModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition flex items-center justify-center gap-2 animate-pulse"
            >
              <FileCheck className="w-5 h-5" />
              <span>Unload, Upload POD & Complete Delivery</span>
            </button>
          )}

          {activeShipment.status === 'DELIVERED' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
              &check; Consignment Successfully Delivered! Proof of Delivery recorded.
            </div>
          )}

          {activeShipment.status !== 'DELIVERED' && activeShipment.status !== 'CANCELLED' && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Need to cancel trip? (Requires reason)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload POD Modal */}
      <Modal
        isOpen={isPodModalOpen}
        onClose={() => setIsPodModalOpen(false)}
        title="Upload Proof of Delivery (POD)"
      >
        <form onSubmit={handleDeliverPOD} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Confirm that all packages have been unloaded and received in good condition by the consignee.
          </p>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Signed Consignment Note / Photo URL
            </label>
            <input
              type="text"
              value={podUrl}
              onChange={(e) => setPodUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsPodModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-600/20"
            >
              Confirm Delivery
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Trip Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Trip Consignment"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Cancelling this active trip will notify both the shipper and transport agency.
          </p>
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reason for Cancellation
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Engine mechanical breakdown, road closure, shipper cargo not ready."
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700"
            >
              Close
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

