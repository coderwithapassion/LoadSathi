import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Truck,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { VerificationStatus } from '../../types';

export const VehicleApprovalsPage: React.FC = () => {
  const { vehicles, updateVehicleApproval } = useLogistics();

  const handleUpdate = async (vehicleId: string, status: VerificationStatus) => {
    await updateVehicleApproval(vehicleId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Commercial Vehicle Approvals
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify RTO fitness, national carriage permits, and vehicle compliance
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className={`bg-white rounded-3xl p-6 border shadow-sm transition hover:shadow-md flex flex-col justify-between ${
              v.approval_status === 'pending'
                ? 'border-amber-300 ring-2 ring-amber-500/20'
                : 'border-slate-200'
            }`}
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
              <h3 className="text-xl font-black font-mono text-slate-900 mt-0.5">
                {v.registration_number}
              </h3>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                {v.vehicle_type}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Payload Rating:</span>
                <span className="font-bold text-slate-900">{v.capacity} {v.capacity_unit || 'Tonnes'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {new Date(v.created_at).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {v.approval_status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdate(v.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                  >
                    Reject
                  </button>
                )}
                {v.approval_status !== 'verified' && (
                  <button
                    onClick={() => handleUpdate(v.id, 'verified')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Vehicle</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

