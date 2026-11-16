import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { ShipmentMap } from '../../components/map/ShipmentMap';
import { TrackingTimeline } from '../../components/tracking/TrackingTimeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  MapPin,
  Truck,
  User,
  Phone,
  Calendar,
  Package,
  IndianRupee,
  Navigation,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

export const TrackShipmentPage: React.FC = () => {
  const { shipmentId } = useParams<{ shipmentId?: string }>();
  const { shipments, getShipmentTracking } = useLogistics();

  // If shipmentId is specified, find it, else default to first active or first shipment
  const selectedShipment = shipmentId
    ? shipments.find(s => s.id === shipmentId || s.shipment_code === shipmentId)
    : shipments.find(s => s.status === 'IN TRANSIT') || shipments[0];

  const [activeId, setActiveId] = useState<string>(selectedShipment?.id || '');

  const currentShipment = shipments.find(s => s.id === (shipmentId || activeId)) || selectedShipment;

  if (!currentShipment) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">No Shipment Found</h3>
        <p className="text-xs text-slate-500 mt-1">Please select an existing shipment or create a new one.</p>
        <Link
          to="/dashboard/business/manage-shipments"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipments</span>
        </Link>
      </div>
    );
  }

  const updates = getShipmentTracking(currentShipment.id);

  // Latest waypoint
  const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Top Header & Shipment Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {currentShipment.shipment_code}
            </span>
            <StatusBadge status={currentShipment.status} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {currentShipment.pickup_city} &rarr; {currentShipment.delivery_city}
          </h1>
          <p className="text-xs text-slate-500">
            {currentShipment.goods_type} &bull; {currentShipment.weight} {currentShipment.weight_unit} ({currentShipment.packages_count} packages)
          </p>
        </div>

        {/* Quick Shipment Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Track another:</label>
          <select
            value={currentShipment.id}
            onChange={(e) => setActiveId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {shipments.map(s => (
              <option key={s.id} value={s.id}>
                {s.shipment_code} ({s.pickup_city} &rarr; {s.delivery_city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demo Tracking Disclaimer Banner */}
      <div className="bg-slate-900 text-slate-300 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-orange-500 shrink-0 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <span className="font-bold text-white">Live Route Waypoint Mode (OpenStreetMap & Leaflet):</span>{' '}
            <span className="text-slate-400">
              Corridor simulation tracking enabled. Highway milestones updated as verified drivers log checkpoints.
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-800 text-orange-400 font-mono text-[11px] font-bold">
          GPS SIMULATION
        </span>
      </div>

      {/* Grid: Left Map + Right Assigned Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Leaflet Map (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Navigation className="w-4 h-4 text-orange-500" />
                <span>Highway Route Visualization</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {currentShipment.pickup_city} to {currentShipment.delivery_city}
              </span>
            </div>

            <ShipmentMap
              pickupLocation={{
                name: currentShipment.pickup_location,
                city: currentShipment.pickup_city,
                lat: currentShipment.pickup_lat,
                lng: currentShipment.pickup_lng
              }}
              deliveryLocation={{
                name: currentShipment.delivery_location,
                city: currentShipment.delivery_city,
                lat: currentShipment.delivery_lat,
                lng: currentShipment.delivery_lng
              }}
              currentLocation={
                latestUpdate?.lat && latestUpdate?.lng
                  ? {
                      name: latestUpdate.location,
                      lat: latestUpdate.lat,
                      lng: latestUpdate.lng
                    }
                  : undefined
              }
              status={currentShipment.status}
              height="400px"
            />
          </div>
        </div>

        {/* Right: Driver, Vehicle, Transit Meta (1 col) */}
        <div className="space-y-4">
          {/* Driver & Vehicle Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Fleet & Crew
            </h4>

            {currentShipment.assigned_driver || currentShipment.assigned_transporter ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      Designated Driver
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {currentShipment.assigned_driver || 'Ramesh Yadav'}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Vehicle Number</span>
                    <p className="text-sm font-black font-mono text-slate-900">
                      {currentShipment.assigned_vehicle || 'DL 01 AA 4291'}
                    </p>
                    <p className="text-[11px] text-slate-500">{currentShipment.vehicle_type}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Transporter Agency</span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {currentShipment.assigned_transporter || 'Singh Express Roadways'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <p className="font-bold">Awaiting Transporter Acceptance</p>
                <p className="text-[11px] text-amber-800 mt-1">
                  Once a quotation is accepted, vehicle registration and driver contact will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Consignment Quick Stats */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Consignment Info
            </h4>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Pickup Date</span>
              <span className="font-bold text-slate-900">{currentShipment.pickup_date}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Delivery Deadline</span>
              <span className="font-bold text-slate-900">{currentShipment.delivery_deadline}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Weight & Units</span>
              <span className="font-bold text-slate-900">
                {currentShipment.weight} {currentShipment.weight_unit} ({currentShipment.packages_count} pkgs)
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Agreed Freight</span>
              <span className="font-extrabold text-slate-900">
                ₹{currentShipment.expected_budget.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500">Shipper Contact</span>
              <span className="font-bold text-slate-900">{currentShipment.contact_person}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Timeline Stepper & Detailed Activity Log */}
      <TrackingTimeline
        currentStatus={currentShipment.status}
        updates={updates}
      />
    </div>
  );
};

