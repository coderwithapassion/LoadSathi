import {
  UserProfile,
  BusinessDetails,
  TransporterDetails,
  DriverDetails,
  Vehicle,
  Shipment,
  Quotation,
  Booking,
  TrackingUpdate,
  Payment,
  Complaint,
  NotificationItem,
  ShipmentStatus,
  VerificationStatus,
  UserRole
} from '../types';
import {
  SEED_USERS,
  SEED_VEHICLES,
  SEED_SHIPMENTS,
  SEED_QUOTATIONS,
  SEED_BOOKINGS,
  SEED_TRACKING,
  SEED_PAYMENTS,
  SEED_COMPLAINTS,
  SEED_NOTIFICATIONS
} from './seedData';

const STORAGE_KEY_PREFIX = 'loadsaathi_store_v1_';

function getOrInit<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading localStorage for key', key, e);
    return defaultVal;
  }
}

function save<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving to localStorage for key', key, e);
  }
}

class MockDataStore {
  private users: typeof SEED_USERS;
  private vehicles: Vehicle[];
  private shipments: Shipment[];
  private quotations: Quotation[];
  private bookings: Booking[];
  private trackingUpdates: TrackingUpdate[];
  private payments: Payment[];
  private complaints: Complaint[];
  private notifications: NotificationItem[];

  constructor() {
    this.users = getOrInit('users', SEED_USERS);
    this.vehicles = getOrInit('vehicles', SEED_VEHICLES);
    this.shipments = getOrInit('shipments', SEED_SHIPMENTS);
    this.quotations = getOrInit('quotations', SEED_QUOTATIONS);
    this.bookings = getOrInit('bookings', SEED_BOOKINGS);
    this.trackingUpdates = getOrInit('tracking', SEED_TRACKING);
    this.payments = getOrInit('payments', SEED_PAYMENTS);
    this.complaints = getOrInit('complaints', SEED_COMPLAINTS);
    this.notifications = getOrInit('notifications', SEED_NOTIFICATIONS);
  }

  // --- Users & Auth ---
  getUsers() {
    return this.users;
  }

  findUserByEmail(email: string) {
    return this.users.find(u => u.profile.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.users.find(u => u.profile.id === id);
  }

  registerUser(data: {
    email: string;
    full_name: string;
    phone?: string;
    role: UserRole;
    business_name?: string;
    company_name?: string;
    license_number?: string;
  }) {
    const existing = this.findUserByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const userId = 'usr-' + Math.random().toString(36).substring(2, 9);
    const newProfile: UserProfile = {
      id: userId,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone || '+91 98000 00000',
      role: data.role,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    let business: BusinessDetails | undefined;
    let transporter: TransporterDetails | undefined;
    let driver: DriverDetails | undefined;

    if (data.role === 'business') {
      business = {
        id: 'biz-' + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        business_name: data.business_name || `${data.full_name}'s Enterprise`,
        city: 'Delhi NCR',
        business_type: 'Wholesale & Distribution'
      };
    } else if (data.role === 'transporter') {
      transporter = {
        id: 'trans-' + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        company_name: data.company_name || `${data.full_name} Roadways`,
        fleet_size: 2,
        verification_status: 'verified', // Auto-verify new registered for demo smoothness
        rating: 4.8,
        total_reviews: 1
      };
    } else if (data.role === 'driver') {
      driver = {
        id: 'drv-' + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        transporter_id: 'trans-01',
        license_number: data.license_number || 'DL-2026-990182',
        experience_years: 4,
        verification_status: 'verified',
        is_available: true,
        current_location: 'Delhi NCR Hub'
      };
    }

    const newUserObj = { profile: newProfile, business, transporter, driver };
    this.users.push(newUserObj);
    save('users', this.users);

    return newUserObj;
  }

  toggleUserActive(userId: string) {
    const user = this.findUserById(userId);
    if (user) {
      user.profile.is_active = !user.profile.is_active;
      save('users', this.users);
      return user.profile.is_active;
    }
    return false;
  }

  // --- Shipments ---
  getShipments() {
    return this.shipments;
  }

  getShipmentById(id: string) {
    return this.shipments.find(s => s.id === id || s.shipment_code === id);
  }

  createShipment(shipmentData: Omit<Shipment, 'id' | 'shipment_code' | 'created_at' | 'status'> & { status?: ShipmentStatus }) {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const newShipment: Shipment = {
      ...shipmentData,
      id: 'sh-' + codeNumber,
      shipment_code: `LS-2026-${codeNumber}`,
      status: shipmentData.status || 'BOOKED',
      created_at: new Date().toISOString(),
      quotations_count: 0
    };

    this.shipments.unshift(newShipment);
    save('shipments', this.shipments);

    // Initial tracking update
    this.addTrackingUpdate({
      shipment_id: newShipment.id,
      status: 'BOOKED',
      location: newShipment.pickup_city || newShipment.pickup_location,
      lat: newShipment.pickup_lat,
      lng: newShipment.pickup_lng,
      description: `Shipment booked by ${newShipment.business_name || 'Business'} for pickup on ${newShipment.pickup_date}.`
    });

    return newShipment;
  }

  cancelShipment(shipmentId: string, reason: string) {
    const shipment = this.getShipmentById(shipmentId);
    if (shipment) {
      shipment.status = 'CANCELLED';
      save('shipments', this.shipments);

      this.addTrackingUpdate({
        shipment_id: shipment.id,
        status: 'CANCELLED',
        location: shipment.pickup_city,
        description: `Shipment cancelled. Reason: ${reason}`
      });

      // Update booking if exists
      const booking = this.bookings.find(b => b.shipment_id === shipment.id);
      if (booking) {
        booking.booking_status = 'cancelled';
        booking.cancellation_reason = reason;
        save('bookings', this.bookings);
      }
      return true;
    }
    return false;
  }

  // --- Quotations ---
  getQuotations(shipmentId?: string) {
    if (shipmentId) {
      return this.quotations.filter(q => q.shipment_id === shipmentId);
    }
    return this.quotations;
  }

  createQuotation(data: Omit<Quotation, 'id' | 'created_at' | 'status'>) {
    const newQuote: Quotation = {
      ...data,
      id: 'quot-' + Math.random().toString(36).substring(2, 9),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.quotations.unshift(newQuote);
    save('quotations', this.quotations);

    // Increment quotation count on shipment
    const shipment = this.getShipmentById(data.shipment_id);
    if (shipment) {
      shipment.quotations_count = (shipment.quotations_count || 0) + 1;
      save('shipments', this.shipments);

      // Create notification for business
      const bizUser = this.users.find(u => u.business?.id === shipment.business_id);
      if (bizUser) {
        this.addNotification({
          user_id: bizUser.profile.id,
          title: 'New Quotation Received',
          message: `${data.transporter_name || 'A transporter'} proposed ₹${data.proposed_price.toLocaleString('en-IN')} for shipment ${shipment.shipment_code}.`,
          link: '/dashboard/business/quotations'
        });
      }
    }

    return newQuote;
  }

  acceptQuotation(quotationId: string) {
    const quote = this.quotations.find(q => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    quote.status = 'accepted';
    
    // Reject other quotes for this shipment
    this.quotations.forEach(q => {
      if (q.shipment_id === quote.shipment_id && q.id !== quotationId) {
        q.status = 'rejected';
      }
    });
    save('quotations', this.quotations);

    // Update shipment status to CONFIRMED
    const shipment = this.getShipmentById(quote.shipment_id);
    if (shipment) {
      shipment.status = 'CONFIRMED';
      shipment.assigned_transporter = quote.transporter_name;
      shipment.assigned_vehicle = quote.vehicle_info?.split('/')[1]?.trim() || 'HR 26 DQ 8831';
      shipment.assigned_driver = 'Ramesh Yadav';
      save('shipments', this.shipments);

      // Create Booking
      const bookingId = 'bk-' + Math.random().toString(36).substring(2, 9);
      const newBooking: Booking = {
        id: bookingId,
        shipment_id: shipment.id,
        transporter_id: quote.transporter_id,
        transporter_name: quote.transporter_name,
        driver_id: 'drv-01',
        driver_name: 'Ramesh Yadav',
        driver_phone: '+91 98765 43210',
        vehicle_id: quote.available_vehicle_id || 'veh-02',
        vehicle_registration: shipment.assigned_vehicle,
        final_price: quote.proposed_price,
        booking_status: 'confirmed',
        created_at: new Date().toISOString()
      };
      this.bookings.unshift(newBooking);
      save('bookings', this.bookings);

      // Create Payment Record (10% fee)
      const newPayment: Payment = {
        id: 'pay-' + Math.random().toString(36).substring(2, 9),
        booking_id: bookingId,
        shipment_code: shipment.shipment_code,
        amount: quote.proposed_price,
        platform_fee: Math.round(quote.proposed_price * 0.10),
        payment_status: 'completed',
        payment_method: 'NetBanking / Escrow Secured',
        transaction_reference: 'TXN-LS-' + Math.floor(10000000 + Math.random() * 90000000),
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      this.payments.unshift(newPayment);
      save('payments', this.payments);

      // Tracking update
      this.addTrackingUpdate({
        shipment_id: shipment.id,
        status: 'CONFIRMED',
        location: shipment.pickup_city,
        lat: shipment.pickup_lat,
        lng: shipment.pickup_lng,
        description: `Booking confirmed with ${quote.transporter_name}. Vehicle and driver allocated.`
      });
    }

    return quote;
  }

  rejectQuotation(quotationId: string) {
    const quote = this.quotations.find(q => q.id === quotationId);
    if (quote) {
      quote.status = 'rejected';
      save('quotations', this.quotations);
      return true;
    }
    return false;
  }

  // --- Bookings ---
  getBookings(transporterId?: string) {
    if (transporterId) {
      return this.bookings.filter(b => b.transporter_id === transporterId);
    }
    return this.bookings;
  }

  // --- Tracking Updates ---
  getTrackingUpdates(shipmentId: string) {
    return this.trackingUpdates
      .filter(t => t.shipment_id === shipmentId)
      .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
  }

  addTrackingUpdate(data: Omit<TrackingUpdate, 'id' | 'updated_at'>) {
    const newTrk: TrackingUpdate = {
      ...data,
      id: 'trk-' + Math.random().toString(36).substring(2, 9),
      updated_at: new Date().toISOString()
    };
    this.trackingUpdates.push(newTrk);
    save('tracking', this.trackingUpdates);

    // Also update shipment status
    const shipment = this.getShipmentById(data.shipment_id);
    if (shipment) {
      shipment.status = data.status;
      save('shipments', this.shipments);
    }

    return newTrk;
  }

  // --- Vehicles ---
  getVehicles(transporterId?: string) {
    if (transporterId) {
      return this.vehicles.filter(v => v.transporter_id === transporterId);
    }
    return this.vehicles;
  }

  addVehicle(data: Omit<Vehicle, 'id' | 'created_at' | 'approval_status'> & { approval_status?: VerificationStatus }) {
    const newVeh: Vehicle = {
      ...data,
      id: 'veh-' + Math.random().toString(36).substring(2, 9),
      approval_status: data.approval_status || 'verified',
      created_at: new Date().toISOString()
    };
    this.vehicles.unshift(newVeh);
    save('vehicles', this.vehicles);
    return newVeh;
  }

  updateVehicleApproval(vehicleId: string, status: VerificationStatus) {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      vehicle.approval_status = status;
      save('vehicles', this.vehicles);
      return true;
    }
    return false;
  }

  // --- Transporter Verification ---
  verifyTransporter(transporterId: string, status: VerificationStatus) {
    const user = this.users.find(u => u.transporter?.id === transporterId);
    if (user && user.transporter) {
      user.transporter.verification_status = status;
      save('users', this.users);
      return true;
    }
    return false;
  }

  // --- Payments & Complaints ---
  getPayments() {
    return this.payments;
  }

  getComplaints() {
    return this.complaints;
  }

  resolveComplaint(complaintId: string) {
    const comp = this.complaints.find(c => c.id === complaintId);
    if (comp) {
      comp.status = 'resolved';
      save('complaints', this.complaints);
      return true;
    }
    return false;
  }

  // --- Notifications ---
  getNotifications(userId: string) {
    return this.notifications.filter(n => n.user_id === userId);
  }

  addNotification(data: Omit<NotificationItem, 'id' | 'is_read' | 'created_at'>) {
    const newNotif: NotificationItem = {
      ...data,
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    save('notifications', this.notifications);
    return newNotif;
  }

  markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      save('notifications', this.notifications);
    }
  }

  // --- Admin Analytics ---
  getAdminStats() {
    const totalUsers = this.users.length;
    const businesses = this.users.filter(u => u.profile.role === 'business').length;
    const transporters = this.users.filter(u => u.profile.role === 'transporter').length;
    const drivers = this.users.filter(u => u.profile.role === 'driver').length;
    const totalShipments = this.shipments.length;
    const deliveredShipments = this.shipments.filter(s => s.status === 'DELIVERED').length;
    const activeShipments = this.shipments.filter(s => !['DELIVERED', 'CANCELLED'].includes(s.status)).length;
    const platformRevenue = this.payments
      .filter(p => p.payment_status === 'completed')
      .reduce((sum, p) => sum + p.platform_fee, 0);

    return {
      totalUsers,
      businesses,
      transporters,
      drivers,
      totalShipments,
      deliveredShipments,
      activeShipments,
      platformRevenue
    };
  }

  // Reset to default seed
  resetStore() {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'users');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'vehicles');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'shipments');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'quotations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'bookings');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'tracking');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'payments');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'complaints');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notifications');
    window.location.reload();
  }
}

export const mockStore = new MockDataStore();

