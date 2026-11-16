export type UserRole = 'business' | 'transporter' | 'driver' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ShipmentStatus = 
  | 'BOOKED' 
  | 'CONFIRMED' 
  | 'PICKED UP' 
  | 'IN TRANSIT' 
  | 'OUT FOR DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type QuotationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type BookingStatus = 'confirmed' | 'ongoing' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface BusinessDetails {
  id: string;
  user_id: string;
  business_name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  business_type?: string;
  gstin?: string;
}

export interface TransporterDetails {
  id: string;
  user_id: string;
  company_name: string;
  fleet_size?: number;
  verification_status: VerificationStatus;
  rating: number;
  total_reviews?: number;
  documents_url?: string;
}

export interface DriverDetails {
  id: string;
  user_id: string;
  transporter_id?: string;
  license_number: string;
  experience_years?: number;
  verification_status: VerificationStatus;
  is_available: boolean;
  current_location?: string;
}

export interface Vehicle {
  id: string;
  transporter_id: string;
  registration_number: string;
  vehicle_type: string;
  capacity: number; // in tonnes
  capacity_unit?: string;
  availability: boolean;
  image_url?: string;
  approval_status: VerificationStatus;
  created_at: string;
}

export interface Shipment {
  id: string;
  shipment_code: string;
  business_id: string;
  business_name?: string;
  pickup_location: string;
  pickup_city: string;
  pickup_lat: number;
  pickup_lng: number;
  delivery_location: string;
  delivery_city: string;
  delivery_lat: number;
  delivery_lng: number;
  goods_type: string;
  weight: number;
  weight_unit: string;
  packages_count: number;
  vehicle_type: string;
  special_instructions?: string;
  expected_budget: number;
  contact_person: string;
  contact_phone: string;
  pickup_date: string;
  delivery_deadline: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at?: string;
  // Computed / joined fields
  quotations_count?: number;
  assigned_transporter?: string;
  assigned_driver?: string;
  assigned_vehicle?: string;
}

export interface Quotation {
  id: string;
  shipment_id: string;
  shipment_code?: string;
  transporter_id: string;
  transporter_name?: string;
  transporter_rating?: number;
  proposed_price: number;
  estimated_delivery: string;
  available_vehicle_id?: string;
  vehicle_info?: string;
  additional_charges?: number;
  message?: string;
  status: QuotationStatus;
  created_at: string;
}

export interface Booking {
  id: string;
  shipment_id: string;
  shipment?: Shipment;
  transporter_id: string;
  transporter_name?: string;
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  vehicle_id?: string;
  vehicle_registration?: string;
  final_price: number;
  booking_status: BookingStatus;
  cancellation_reason?: string;
  created_at: string;
}

export interface TrackingUpdate {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string;
  lat?: number;
  lng?: number;
  description: string;
  proof_image_url?: string;
  updated_by?: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  shipment_code: string;
  amount: number;
  platform_fee: number;
  payment_status: PaymentStatus;
  payment_method: string;
  transaction_reference: string;
  paid_at?: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  shipment_id: string;
  shipment_code: string;
  raised_by_name: string;
  raised_by_role: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

