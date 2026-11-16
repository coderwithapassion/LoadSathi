import React from 'react';
import { ShipmentStatus, TrackingUpdate } from '../../types';
import { CheckCircle2, Clock, CircleDot, Truck, Package, MapPin, CheckCheck, XCircle } from 'lucide-react';

interface TrackingTimelineProps {
  currentStatus: ShipmentStatus;
  updates: TrackingUpdate[];
  cancellationReason?: string;
}

const STAGES: { key: ShipmentStatus; label: string; icon: any }[] = [
  { key: 'BOOKED', label: 'Booking Placed', icon: Package },
  { key: 'CONFIRMED', label: 'Transporter Assigned', icon: CheckCircle2 },
  { key: 'PICKED UP', label: 'Cargo Picked Up', icon: CircleDot },
  { key: 'IN TRANSIT', label: 'In Transit', icon: Truck },
  { key: 'OUT FOR DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCheck },
];

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  currentStatus,
  updates,
  cancellationReason,
}) => {
  const isCancelled = currentStatus === 'CANCELLED';

  const getStageIndex = (status: ShipmentStatus) => {
    return STAGES.findIndex(s => s.key === status);
  };

  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="space-y-8">
      {/* Visual Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
          Shipment Progress Stage
        </h4>

        {isCancelled ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Shipment Cancelled</p>
              <p className="text-sm mt-0.5">{cancellationReason || 'Cancelled by authorized user.'}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Desktop Stepper */}
            <div className="hidden md:grid md:grid-cols-6 gap-2 relative">
              {/* Progress track line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, (currentIndex / (STAGES.length - 1)) * 100))}%`
                  }}
                />
              </div>

              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isUpcoming = idx > currentIndex;

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : isCurrent
                          ? 'bg-orange-500 border-orange-500 text-white ring-4 ring-orange-100 shadow-lg shadow-orange-500/30 animate-pulse'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs mt-3 font-semibold ${
                        isCurrent
                          ? 'text-orange-600'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Horizontal Scroll Stepper */}
            <div className="flex md:hidden overflow-x-auto pb-4 gap-4 scrollbar-none">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={stage.key} className="flex flex-col items-center shrink-0 w-24 text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                        isPassed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-orange-500 border-orange-500 text-white ring-2 ring-orange-100'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] mt-2 font-medium text-slate-700">
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Checkpoint Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
          Realtime Activity Log
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {updates.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No tracking updates recorded yet.</p>
          ) : (
            updates.map((update, idx) => (
              <div key={update.id || idx} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-orange-500 shadow-sm ring-2 ring-orange-200" />

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      {update.location}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(update.updated_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                    {update.description}
                  </p>

                  {update.proof_image_url && (
                    <div className="mt-3">
                      <span className="text-xs font-semibold text-slate-500">Proof of Delivery / E-Way Bill:</span>
                      <a
                        href={update.proof_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-1 text-xs text-orange-600 underline font-medium"
                      >
                        View Verification Document / Photo &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

