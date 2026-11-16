import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Truck,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sliders
} from 'lucide-react';

export const VehicleManagementPage: React.FC = () => {
  const { vehicles, addVehicle } = useLogistics();
  const { transporterDetails } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Eicher Pro 14ft Open (4T)');
  const [capacity, setCapacity] = useState<number>(4.0);
  const [capacityUnit, setCapacityUnit] = useState('Tonnes');
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      alert('Please enter a valid vehicle registration plate number.');
      return;
    }

    setLoading(true);
    try {
      await addVehicle({
        registration_number: regNumber.toUpperCase().trim(),
        vehicle_type: vehicleType,
        capacity: Number(capacity),
        capacity_unit: capacityUnit,
        availability: availability,
      });
      setIsAddModalOpen(false);
      setRegNumber('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Commercial Fleet Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered commercial goods vehicles, permit verification status, and availability
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-orange-500 flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <StatusBadge status={v.approval_status} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Registration Plate
              </span>
              <h3 className="text-xl font-black font-mono text-slate-900 tracking-tight mt-0.5">
                {v.registration_number}
              </h3>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                {v.vehicle_type}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Payload Capacity</span>
                <span className="font-bold text-slate-900">{v.capacity} {v.capacity_unit || 'Tonnes'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  v.availability
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {v.availability ? 'Available for Bidding' : 'Currently On Route'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Commercial Goods Vehicle"
      >
        <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Vehicle Registration Number (RTO)
            </label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g. DL 01 AB 1234, MH 12 RN 8890"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Vehicle Type & Model
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            >
              <option value="Tata Ace Gold (1.5T)">Tata Ace Gold (1.5 Ton mini truck)</option>
              <option value="Tata 407 LPT (2.5T)">Tata 407 LPT (2.5 Ton light truck)</option>
              <option value="Eicher Pro 14ft Open (4T)">Eicher Pro 14ft Open (4 Ton)</option>
              <option value="19ft Heavy Truck (7T)">19ft Heavy Truck (7 Ton)</option>
              <option value="32ft Multi-Axle Container (16T)">32ft Multi-Axle Container (16 Ton)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Payload Capacity
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Unit
              </label>
              <select
                value={capacityUnit}
                onChange={(e) => setCapacityUnit(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="Tonnes">Tonnes</option>
                <option value="KG">KG</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span className="font-semibold text-slate-700">Ready & Available for immediate trip allocation</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-70 shadow-md shadow-orange-500/20"
            >
              {loading ? 'Adding Vehicle...' : 'Register to Fleet'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

