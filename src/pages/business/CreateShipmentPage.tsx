import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  IndianRupee,
  User,
  Phone,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const INDIAN_CITIES_COORDS: Record<string, { lat: number; lng: number }> = {
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'ludhiana': { lat: 30.9010, lng: 75.8573 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },
};

function getCityCoords(city: string, fallbackLat = 28.6139, fallbackLng = 77.2090) {
  const clean = city.toLowerCase().trim();
  for (const [k, v] of Object.entries(INDIAN_CITIES_COORDS)) {
    if (clean.includes(k)) return v;
  }
  return { lat: fallbackLat, lng: fallbackLng };
}

export const CreateShipmentPage: React.FC = () => {
  const { createShipment } = useLogistics();
  const { businessDetails, user } = useAuth();
  const navigate = useNavigate();

  const [pickupCity, setPickupCity] = useState('Delhi');
  const [pickupLocation, setPickupLocation] = useState('Okhla Industrial Area Phase-II, New Delhi');
  const [deliveryCity, setDeliveryCity] = useState('Mumbai');
  const [deliveryLocation, setDeliveryLocation] = useState('Bhiwandi Logistics Park, Thane / Mumbai');
  const [pickupDate, setPickupDate] = useState('2026-11-20');
  const [deliveryDeadline, setDeliveryDeadline] = useState('2026-11-24');
  const [goodsType, setGoodsType] = useState('Electrical Switches & Industrial Panels');
  const [weight, setWeight] = useState<number>(7.5);
  const [weightUnit, setWeightUnit] = useState('Tonnes');
  const [packagesCount, setPackagesCount] = useState<number>(35);
  const [vehicleType, setVehicleType] = useState('19ft Heavy Truck (7T)');
  const [expectedBudget, setExpectedBudget] = useState<number>(36000);
  const [specialInstructions, setSpecialInstructions] = useState('Handle with care. Keep rain tarpaulin tied.');
  const [contactPerson, setContactPerson] = useState(user?.full_name || 'Rajesh Sharma');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98101 23456');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pickupCity || !pickupLocation || !deliveryCity || !deliveryLocation) {
      setError('Please specify full pickup and delivery destination details.');
      return;
    }

    if (!weight || weight <= 0) {
      setError('Cargo weight must be greater than zero.');
      return;
    }

    if (!expectedBudget || expectedBudget <= 0) {
      setError('Please provide an expected budget (INR) for transporter quotation benchmark.');
      return;
    }

    const pickupCoords = getCityCoords(pickupCity, 28.6139, 77.2090);
    const deliveryCoords = getCityCoords(deliveryCity, 19.0760, 72.8777);

    setLoading(true);
    try {
      const newShipment = await createShipment({
        business_id: businessDetails?.id || 'biz-01',
        business_name: businessDetails?.business_name || user?.full_name || 'Shipper Enterprise',
        pickup_location: pickupLocation,
        pickup_city: pickupCity,
        pickup_lat: pickupCoords.lat,
        pickup_lng: pickupCoords.lng,
        delivery_location: deliveryLocation,
        delivery_city: deliveryCity,
        delivery_lat: deliveryCoords.lat,
        delivery_lng: deliveryCoords.lng,
        goods_type: goodsType,
        weight: Number(weight),
        weight_unit: weightUnit,
        packages_count: Number(packagesCount),
        vehicle_type: vehicleType,
        special_instructions: specialInstructions,
        expected_budget: Number(expectedBudget),
        contact_person: contactPerson,
        contact_phone: contactPhone,
        pickup_date: pickupDate,
        delivery_deadline: deliveryDeadline,
      });

      navigate(`/dashboard/business/track/${newShipment.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create shipment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          Freight Booking Engine
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Create New Shipment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Post your freight specifications. Transporters will immediately review and submit bids.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        {/* Section 1: Route & Schedule */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-orange-500" />
            1. Origin, Destination & Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup City
              </label>
              <input
                type="text"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                placeholder="e.g. Delhi NCR, Pune, Bengaluru"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Destination City
              </label>
              <input
                type="text"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                placeholder="e.g. Mumbai, Ahmedabad, Chennai"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Pickup Address / Warehouse
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Plot 42, Sector 8, Industrial Estate"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Delivery Address / Consignee Hub
              </label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Gala 12, Transhipment Godown, Bhiwandi"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Delivery Deadline
              </label>
              <input
                type="date"
                value={deliveryDeadline}
                onChange={(e) => setDeliveryDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Cargo Specifications */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Package className="w-4 h-4 text-orange-500" />
            2. Cargo Specifications & Vehicle Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Type of Goods / Cargo Description
              </label>
              <input
                type="text"
                value={goodsType}
                onChange={(e) => setGoodsType(e.target.value)}
                placeholder="e.g. Auto Spare Parts, Cotton Yarn, Solar Equipment"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Number of Packages / Crates
              </label>
              <input
                type="number"
                min="1"
                value={packagesCount}
                onChange={(e) => setPackagesCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 font-semibold"
                >
                  <option value="Tonnes">Tonnes</option>
                  <option value="KG">KG</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Required Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
              >
                <option value="Tata Ace Gold (1.5T)">Tata Ace Gold (1.5 Ton mini truck)</option>
                <option value="Tata 407 LPT (2.5T)">Tata 407 LPT (2.5 Ton light truck)</option>
                <option value="Eicher Pro 14ft Open (4T)">Eicher Pro 14ft Open Body (4 Ton)</option>
                <option value="19ft Heavy Truck (7T)">19ft Heavy Truck (7 Ton)</option>
                <option value="32ft Multi-Axle Container (16T)">32ft Multi-Axle Container (16 Ton)</option>
                <option value="40ft High Cube Container (25T)">40ft High Cube Heavy Trailer (25 Ton)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Budget & Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <IndianRupee className="w-4 h-4 text-orange-500" />
            3. Target Budget, Contact & Handling
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Expected Budget (₹ INR)
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={expectedBudget}
                onChange={(e) => setExpectedBudget(Number(e.target.value))}
                placeholder="e.g. 35000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Dispatch Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Handling Instructions
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Forklift required for loading, no double stacking, water-proof tarpaulin compulsory."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Broadcasted instantly to verified corridor transporters</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span>Broadcasting Shipment...</span>
            ) : (
              <>
                <span>Publish Freight Request</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

