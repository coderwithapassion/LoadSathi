import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import {
  Package,
  Search,
  Filter,
  DollarSign,
  Truck,
  Clock,
  Calendar,
  IndianRupee,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Shipment } from '../../types';

export const AvailableShipmentsPage: React.FC = () => {
  const { shipments, vehicles, submitQuotation, quotations } = useLogistics();
  const { transporterDetails } = useAuth();

  // Filters state
  const [pickupCityFilter, setPickupCityFilter] = useState('');
  const [deliveryCityFilter, setDeliveryCityFilter] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
  const [goodsCategoryFilter, setGoodsCategoryFilter] = useState('');
  const [maxWeight, setMaxWeight] = useState<number | ''>('');
  const [minBudget, setMinBudget] = useState<number | ''>('');

  // Quotation Submission Modal State
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [proposedPrice, setProposedPrice] = useState<number>(30000);
  const [estimatedDelivery, setEstimatedDelivery] = useState('24-36 Hours');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter open shipments
  const availableShipments = shipments.filter(s => {
    if (s.status !== 'BOOKED') return false;

    if (pickupCityFilter && !s.pickup_city.toLowerCase().includes(pickupCityFilter.toLowerCase())) return false;
    if (deliveryCityFilter && !s.delivery_city.toLowerCase().includes(deliveryCityFilter.toLowerCase())) return false;
    if (vehicleTypeFilter && s.vehicle_type !== vehicleTypeFilter) return false;
    if (goodsCategoryFilter && !s.goods_type.toLowerCase().includes(goodsCategoryFilter.toLowerCase())) return false;
    if (maxWeight && s.weight > Number(maxWeight)) return false;
    if (minBudget && s.expected_budget < Number(minBudget)) return false;

    return true;
  });

  const handleOpenQuotation = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setProposedPrice(shipment.expected_budget);
    setEstimatedDelivery('24-36 Hours (Corridor Express)');
    setSelectedVehicleId(vehicles[0]?.id || '');
    setAdditionalCharges(0);
    setMessage(`Ready to place ${shipment.vehicle_type} on ${shipment.pickup_date} with complete insurance and GPS tracking.`);
  };

  const handleSendQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    const matchedVeh = vehicles.find(v => v.id === selectedVehicleId);
    const vehicleInfo = matchedVeh
      ? `${matchedVeh.vehicle_type} / ${matchedVeh.registration_number}`
      : 'Eicher Pro 14ft Open (4T) / HR 26 DQ 8831';

    setIsSubmitting(true);
    try {
      await submitQuotation({
        shipment_id: selectedShipment.id,
        proposed_price: Number(proposedPrice),
        estimated_delivery: estimatedDelivery,
        available_vehicle_id: selectedVehicleId || undefined,
        vehicle_info: vehicleInfo,
        additional_charges: Number(additionalCharges),
        message: message,
      });
      setSelectedShipment(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Available Cargo Requests
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Active freight demand posted by verified shippers across all major logistics lanes
        </p>
      </div>

      {/* 6 Comprehensive Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>Filter Shipments by Corridor & Specifications</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Pickup City</label>
            <input
              type="text"
              value={pickupCityFilter}
              onChange={(e) => setPickupCityFilter(e.target.value)}
              placeholder="e.g. Delhi, Pune"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination City</label>
            <input
              type="text"
              value={deliveryCityFilter}
              onChange={(e) => setDeliveryCityFilter(e.target.value)}
              placeholder="e.g. Mumbai, Chennai"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Type</label>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
            >
              <option value="">Any Vehicle</option>
              <option value="Tata Ace Gold (1.5T)">Tata Ace Gold (1.5T)</option>
              <option value="Tata 407 LPT (2.5T)">Tata 407 LPT (2.5T)</option>
              <option value="Eicher Pro 14ft Open (4T)">Eicher Pro 14ft Open (4T)</option>
              <option value="19ft Heavy Truck (7T)">19ft Heavy Truck (7T)</option>
              <option value="32ft Multi-Axle Container (16T)">32ft Multi-Axle Container (16T)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Goods Category</label>
            <input
              type="text"
              value={goodsCategoryFilter}
              onChange={(e) => setGoodsCategoryFilter(e.target.value)}
              placeholder="e.g. Electronics, Steel"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Weight (Tonnes)</label>
            <input
              type="number"
              value={maxWeight}
              onChange={(e) => setMaxWeight(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 10"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Budget (₹)</label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 20000"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {(pickupCityFilter || deliveryCityFilter || vehicleTypeFilter || goodsCategoryFilter || maxWeight || minBudget) && (
          <div className="text-right">
            <button
              onClick={() => {
                setPickupCityFilter('');
                setDeliveryCityFilter('');
                setVehicleTypeFilter('');
                setGoodsCategoryFilter('');
                setMaxWeight('');
                setMinBudget('');
              }}
              className="text-xs text-orange-600 hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Available Shipments List */}
      <div className="space-y-4">
        {availableShipments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No shipments match these filter criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try relaxing filters or check back shortly for new loads.</p>
          </div>
        ) : (
          availableShipments.map((s) => {
            const hasAlreadyQuoted = quotations.some(q => q.shipment_id === s.id);

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {s.shipment_code}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{s.business_name}</span>
                    {hasAlreadyQuoted && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Quotation Submitted
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">
                      {s.pickup_city} &rarr; {s.delivery_city}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500">
                    <strong>Pickup:</strong> {s.pickup_location} &bull; <strong>Delivery:</strong> {s.delivery_location}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-700">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Cargo</span>
                      <span className="font-bold truncate block">{s.goods_type}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Weight & Pkgs</span>
                      <span className="font-bold">{s.weight} {s.weight_unit} ({s.packages_count})</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Required Truck</span>
                      <span className="font-bold truncate block">{s.vehicle_type}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Pickup Date</span>
                      <span className="font-bold">{s.pickup_date}</span>
                    </div>
                  </div>

                  {s.special_instructions && (
                    <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      Note: {s.special_instructions}
                    </p>
                  )}
                </div>

                {/* Right: Budget & Action */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0 gap-3">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Shipper Target Budget</span>
                    <p className="text-2xl font-black text-slate-900">
                      ₹{s.expected_budget.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenQuotation(s)}
                    className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition whitespace-nowrap"
                  >
                    Submit Quotation
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Quotation Modal */}
      {selectedShipment && (
        <Modal
          isOpen={!!selectedShipment}
          onClose={() => setSelectedShipment(null)}
          title={`Submit Freight Quotation – ${selectedShipment.shipment_code}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendQuotation} className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <p className="font-bold text-slate-900 text-sm">
                {selectedShipment.pickup_city} &rarr; {selectedShipment.delivery_city}
              </p>
              <p className="text-slate-500 mt-0.5">
                {selectedShipment.goods_type} &bull; {selectedShipment.weight} {selectedShipment.weight_unit} &bull; Expected Budget: ₹{selectedShipment.expected_budget.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Price (₹ INR)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Estimated Transit Time
                </label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. 24-36 Hours, 3 Days"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Allocate Vehicle From Fleet
                </label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-xs"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} – {v.vehicle_type} ({v.capacity} {v.capacity_unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Additional Surcharges (₹ Optional)
                </label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(Number(e.target.value))}
                  placeholder="0 (if tolls included)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Message to Shipper
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention vehicle readiness, GPS availability, driver experience, or transit guarantees."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-70 shadow-md shadow-orange-500/20"
              >
                {isSubmitting ? 'Transmitting Bid...' : 'Submit Quotation to Business'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

