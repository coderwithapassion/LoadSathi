import React from 'react';
import { ShipmentStatus, VerificationStatus, QuotationStatus, BookingStatus } from '../../types';

interface StatusBadgeProps {
  status: ShipmentStatus | VerificationStatus | QuotationStatus | BookingStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (val: string) => {
    switch (val.toUpperCase()) {
      // Shipment Statuses
      case 'BOOKED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PICKED UP':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'IN TRANSIT':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'OUT FOR DELIVERY':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      // Verification Statuses
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      // Quotation Statuses
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WITHDRAWN':
        return 'bg-slate-100 text-slate-700 border-slate-300';

      // Booking Statuses
      case 'ONGOING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium border',
    md: 'text-sm px-3 py-1 rounded-full font-medium border',
    lg: 'text-base px-3.5 py-1.5 rounded-full font-semibold border',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 uppercase tracking-wider ${sizeClasses[size]} ${getBadgeStyle(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

