import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Shipment,
  Quotation,
  Booking,
  TrackingUpdate,
  Vehicle,
  Payment,
  Complaint,
  NotificationItem,
  ShipmentStatus,
  VerificationStatus,
  UserRole
} from '../types';
import { mockStore } from '../lib/mockStorage';
import { useAuth } from './AuthContext';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface LogisticsContextType {
  shipments: Shipment[];
  quotations: Quotation[];
  bookings: Booking[];
  vehicles: Vehicle[];
  payments: Payment[];
  complaints: Complaint[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Shipments
  createShipment: (data: Omit<Shipment, 'id' | 'shipment_code' | 'created_at' | 'status'>) => Promise<Shipment>;
  cancelShipment: (shipmentId: string, reason: string) => Promise<boolean>;
  getShipmentById: (id: string) => Shipment | undefined;
  
  // Quotations
  getQuotationsByShipment: (shipmentId: string) => Quotation[];
  submitQuotation: (data: {
    shipment_id: string;
    proposed_price: number;
    estimated_delivery: string;
    available_vehicle_id?: string;
    vehicle_info?: string;
    additional_charges?: number;
    message?: string;
  }) => Promise<Quotation>;
  acceptQuotation: (quotationId: string) => Promise<Quotation>;
  rejectQuotation: (quotationId: string) => Promise<boolean>;
  
  // Tracking
  getShipmentTracking: (shipmentId: string) => TrackingUpdate[];
  updateShipmentStatus: (
    shipmentId: string,
    status: ShipmentStatus,
    location: string,
    description: string,
    proofUrl?: string
  ) => Promise<TrackingUpdate>;
  
  // Vehicles
  addVehicle: (data: {
    registration_number: string;
    vehicle_type: string;
    capacity: number;
    capacity_unit?: string;
    availability: boolean;
  }) => Promise<Vehicle>;
  updateVehicleApproval: (vehicleId: string, status: VerificationStatus) => Promise<boolean>;
  
  // Admin & Management
  verifyTransporter: (transporterId: string, status: VerificationStatus) => Promise<boolean>;
  toggleUserActive: (userId: string) => Promise<boolean>;
  resolveComplaint: (complaintId: string) => Promise<boolean>;
  getAdminStats: () => {
    totalUsers: number;
    businesses: number;
    transporters: number;
    drivers: number;
    totalShipments: number;
    deliveredShipments: number;
    activeShipments: number;
    platformRevenue: number;
  };
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  refreshData: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, businessDetails, transporterDetails } = useAuth();
  
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshData = () => {
    setShipments([...mockStore.getShipments()]);
    setQuotations([...mockStore.getQuotations()]);
    setBookings([...mockStore.getBookings()]);
    setVehicles([...mockStore.getVehicles()]);
    setPayments([...mockStore.getPayments()]);
    setComplaints([...mockStore.getComplaints()]);
    if (user) {
      setNotifications([...mockStore.getNotifications(user.id)]);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  // Create Shipment
  const createShipment = async (data: Omit<Shipment, 'id' | 'shipment_code' | 'created_at' | 'status'>) => {
    try {
      const newShipment = mockStore.createShipment({
        ...data,
        business_id: businessDetails?.id || 'biz-01',
        business_name: businessDetails?.business_name || user?.full_name || 'Shipper Enterprise',
      });
      refreshData();
      addToast(`Shipment ${newShipment.shipment_code} created successfully! Quotations are open.`, 'success');
      return newShipment;
    } catch (e: any) {
      addToast(e.message || 'Error creating shipment', 'error');
      throw e;
    }
  };

  // Cancel Shipment
  const cancelShipment = async (shipmentId: string, reason: string) => {
    const ok = mockStore.cancelShipment(shipmentId, reason);
    if (ok) {
      refreshData();
      addToast(`Shipment has been cancelled.`, 'info');
      return true;
    }
    addToast('Could not cancel shipment.', 'error');
    return false;
  };

  const getShipmentById = (id: string) => {
    return mockStore.getShipmentById(id);
  };

  const getQuotationsByShipment = (shipmentId: string) => {
    return mockStore.getQuotations(shipmentId);
  };

  // Submit quotation
  const submitQuotation = async (data: {
    shipment_id: string;
    proposed_price: number;
    estimated_delivery: string;
    available_vehicle_id?: string;
    vehicle_info?: string;
    additional_charges?: number;
    message?: string;
  }) => {
    try {
      const newQuote = mockStore.createQuotation({
        ...data,
        transporter_id: transporterDetails?.id || 'trans-01',
        transporter_name: transporterDetails?.company_name || 'Singh Express Roadways',
        transporter_rating: transporterDetails?.rating || 4.8,
      });
      refreshData();
      addToast(`Quotation of ₹${data.proposed_price.toLocaleString('en-IN')} submitted successfully!`, 'success');
      return newQuote;
    } catch (e: any) {
      addToast(e.message || 'Error submitting quotation', 'error');
      throw e;
    }
  };

  // Accept quotation
  const acceptQuotation = async (quotationId: string) => {
    try {
      const quote = mockStore.acceptQuotation(quotationId);
      refreshData();
      addToast(`Quotation accepted! Transporter assigned & booking confirmed.`, 'success');
      return quote;
    } catch (e: any) {
      addToast(e.message || 'Error accepting quotation', 'error');
      throw e;
    }
  };

  // Reject quotation
  const rejectQuotation = async (quotationId: string) => {
    const ok = mockStore.rejectQuotation(quotationId);
    if (ok) {
      refreshData();
      addToast('Quotation rejected', 'info');
      return true;
    }
    return false;
  };

  // Tracking
  const getShipmentTracking = (shipmentId: string) => {
    return mockStore.getTrackingUpdates(shipmentId);
  };

  const updateShipmentStatus = async (
    shipmentId: string,
    status: ShipmentStatus,
    location: string,
    description: string,
    proofUrl?: string
  ) => {
    try {
      const update = mockStore.addTrackingUpdate({
        shipment_id: shipmentId,
        status,
        location,
        description,
        proof_image_url: proofUrl,
        updated_by: user?.id
      });
      refreshData();
      addToast(`Shipment status progressed to "${status}"`, 'success');
      return update;
    } catch (e: any) {
      addToast(e.message || 'Error updating status', 'error');
      throw e;
    }
  };

  // Vehicles
  const addVehicle = async (data: {
    registration_number: string;
    vehicle_type: string;
    capacity: number;
    capacity_unit?: string;
    availability: boolean;
  }) => {
    try {
      const newVeh = mockStore.addVehicle({
        ...data,
        transporter_id: transporterDetails?.id || 'trans-01',
        approval_status: 'verified'
      });
      refreshData();
      addToast(`Vehicle ${newVeh.registration_number} added successfully!`, 'success');
      return newVeh;
    } catch (e: any) {
      addToast(e.message || 'Error adding vehicle', 'error');
      throw e;
    }
  };

  const updateVehicleApproval = async (vehicleId: string, status: VerificationStatus) => {
    const ok = mockStore.updateVehicleApproval(vehicleId, status);
    if (ok) {
      refreshData();
      addToast(`Vehicle verification set to ${status}`, 'info');
      return true;
    }
    return false;
  };

  const verifyTransporter = async (transporterId: string, status: VerificationStatus) => {
    const ok = mockStore.verifyTransporter(transporterId, status);
    if (ok) {
      refreshData();
      addToast(`Transporter verification updated to ${status}`, 'success');
      return true;
    }
    return false;
  };

  const toggleUserActive = async (userId: string) => {
    const active = mockStore.toggleUserActive(userId);
    refreshData();
    addToast(`User account status: ${active ? 'Active' : 'Suspended'}`, 'warning');
    return active;
  };

  const resolveComplaint = async (complaintId: string) => {
    const ok = mockStore.resolveComplaint(complaintId);
    if (ok) {
      refreshData();
      addToast('Complaint marked as resolved', 'success');
      return true;
    }
    return false;
  };

  const markNotificationAsRead = (id: string) => {
    mockStore.markNotificationAsRead(id);
    refreshData();
  };

  const getAdminStats = () => {
    return mockStore.getAdminStats();
  };

  return (
    <LogisticsContext.Provider
      value={{
        shipments,
        quotations,
        bookings,
        vehicles,
        payments,
        complaints,
        notifications,
        toasts,
        addToast,
        removeToast,
        createShipment,
        cancelShipment,
        getShipmentById,
        getQuotationsByShipment,
        submitQuotation,
        acceptQuotation,
        rejectQuotation,
        getShipmentTracking,
        updateShipmentStatus,
        addVehicle,
        updateVehicleApproval,
        verifyTransporter,
        toggleUserActive,
        resolveComplaint,
        getAdminStats,
        markNotificationAsRead,
        refreshData,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};

