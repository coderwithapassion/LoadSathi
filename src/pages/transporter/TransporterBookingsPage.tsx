import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  BookmarkCheck,
  Truck,
  User,
  Phone,
  Calendar,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const TransporterBookingsPage: React.FC = () => {
  const { bookings, shipments } = useLogistics();
  const [filterTab, setFilterTab] = useState<'all' | 'confirmed' | 'ongoing' | 'completed'>('all');

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'all') return true;
    return b.booking_status === filterTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Fleet Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed consignment dispatches, allocated drivers, and trip progression
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'confirmed', label: 'Accepted / Ready' },
            { id: 'ongoing', label: 'Ongoing Trips' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition ${
                filterTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No bookings in this category</p>
          <p className="text-xs text-slate-400 mt-1">Quotations accepted by businesses turn into active bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((b) => {
            const shipment = shipments.find(s => s.id === b.shipment_id);

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                    Booking #{b.id.toUpperCase()}
                  </span>
                  <StatusBadge status={b.booking_status} />
                </div>

                {shipment && (
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {shipment.pickup_city} &rarr; {shipment.delivery_city}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {shipment.goods_type} &bull; {shipment.weight} {shipment.weight_unit}
                    </p>
                  </div>
                )}

                {/* Assigned Vehicle & Driver details */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs border border-slate-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Truck</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">
                      {b.vehicle_registration || 'HR 26 DQ 8831'}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Driver in Charge</span>
                    <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-orange-500" />
                      {b.driver_name || 'Ramesh Yadav'}
                    </p>
                    <p className="text-[10px] text-slate-500">{b.driver_phone || '+91 98765 43210'}</p>
                  </div>
                </div>

                {/* Financials & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Contract Price</span>
                    <p className="text-xl font-black text-slate-900">
                      ₹{b.final_price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <Link
                    to={`/dashboard/business/track/${b.shipment_id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow-md shadow-orange-500/20"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Track Route Map</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

