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
  NotificationItem
} from '../types';

export const SEED_USERS: {
  profile: UserProfile;
  business?: BusinessDetails;
  transporter?: TransporterDetails;
  driver?: DriverDetails;
}[] = [
  {
    profile: {
      id: 'usr-biz-01',
      email: 'rajesh.sharma@delhitechexports.in',
      full_name: 'Rajesh Sharma',
      phone: '+91 98101 23456',
      role: 'business',
      is_active: true,
      created_at: '2026-01-10T09:00:00Z',
    },
    business: {
      id: 'biz-01',
      user_id: 'usr-biz-01',
      business_name: 'Delhi Tech Exports Pvt Ltd',
      address: 'Okhla Industrial Area Phase-III, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110020',
      business_type: 'Heavy Engineering & Electronics',
      gstin: '07AAAAA0000A1Z5'
    }
  },
  {
    profile: {
      id: 'usr-trans-01',
      email: 'vikram.singh@singhlogistics.com',
      full_name: 'Vikramjit Singh',
      phone: '+91 98202 34567',
      role: 'transporter',
      is_active: true,
      created_at: '2026-01-12T10:30:00Z',
    },
    transporter: {
      id: 'trans-01',
      user_id: 'usr-trans-01',
      company_name: 'Singh Express Roadways',
      fleet_size: 14,
      verification_status: 'verified',
      rating: 4.85,
      total_reviews: 46,
      documents_url: 'https://docs.loadsaathi.com/singh-kyc.pdf'
    }
  },
  {
    profile: {
      id: 'usr-drv-01',
      email: 'ramesh.yadav@singhlogistics.com',
      full_name: 'Ramesh Yadav',
      phone: '+91 98765 43210',
      role: 'driver',
      is_active: true,
      created_at: '2026-01-15T11:00:00Z',
    },
    driver: {
      id: 'drv-01',
      user_id: 'usr-drv-01',
      transporter_id: 'trans-01',
      license_number: 'DL-0420180098412',
      experience_years: 8,
      verification_status: 'verified',
      is_available: false,
      current_location: 'NH 48, Near Surat Highway'
    }
  },
  {
    profile: {
      id: 'usr-adm-01',
      email: 'admin@loadsaathi.com',
      full_name: 'Amitabh Sen',
      phone: '+91 99999 88888',
      role: 'admin',
      is_active: true,
      created_at: '2026-01-01T08:00:00Z',
    }
  }
];

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    transporter_id: 'trans-01',
    registration_number: 'DL 01 AA 4291',
    vehicle_type: '32ft Multi-Axle Container (16T)',
    capacity: 16.0,
    capacity_unit: 'Tonnes',
    availability: false,
    approval_status: 'verified',
    created_at: '2026-01-14T08:00:00Z'
  },
  {
    id: 'veh-02',
    transporter_id: 'trans-01',
    registration_number: 'HR 26 DQ 8831',
    vehicle_type: 'Eicher Pro 14ft Open (4T)',
    capacity: 4.0,
    capacity_unit: 'Tonnes',
    availability: true,
    approval_status: 'verified',
    created_at: '2026-01-14T08:30:00Z'
  },
  {
    id: 'veh-03',
    transporter_id: 'trans-01',
    registration_number: 'MH 12 RN 7820',
    vehicle_type: 'Tata 407 LPT (2.5T)',
    capacity: 2.5,
    capacity_unit: 'Tonnes',
    availability: true,
    approval_status: 'verified',
    created_at: '2026-01-20T10:00:00Z'
  },
  {
    id: 'veh-04',
    transporter_id: 'trans-01',
    registration_number: 'UP 16 BT 9012',
    vehicle_type: 'Tata Ace Gold (1.5T)',
    capacity: 1.5,
    capacity_unit: 'Tonnes',
    availability: true,
    approval_status: 'pending',
    created_at: '2026-02-01T12:00:00Z'
  }
];

export const SEED_SHIPMENTS: Shipment[] = [
  {
    id: 'sh-1042',
    shipment_code: 'LS-2026-1042',
    business_id: 'biz-01',
    business_name: 'Delhi Tech Exports Pvt Ltd',
    pickup_location: 'Okhla Industrial Area Phase-III, New Delhi',
    pickup_city: 'Delhi',
    pickup_lat: 28.5355,
    pickup_lng: 77.2732,
    delivery_location: 'Bhiwandi Logistics Hub, Thane / Mumbai',
    delivery_city: 'Mumbai',
    delivery_lat: 19.2967,
    delivery_lng: 73.0631,
    goods_type: 'Heavy Industrial Machinery & Electrical Drives',
    weight: 12.5,
    weight_unit: 'Tonnes',
    packages_count: 8,
    vehicle_type: '32ft Multi-Axle Container (16T)',
    special_instructions: 'Handle with hydraulic forklift only. Water-proof tarp mandatory.',
    expected_budget: 48000,
    contact_person: 'Harish Verma (Dispatch Manager)',
    contact_phone: '+91 98111 22334',
    pickup_date: '2026-11-12',
    delivery_deadline: '2026-11-17',
    status: 'IN TRANSIT',
    created_at: '2026-11-10T10:00:00Z',
    quotations_count: 3,
    assigned_transporter: 'Singh Express Roadways',
    assigned_driver: 'Ramesh Yadav',
    assigned_vehicle: 'DL 01 AA 4291'
  },
  {
    id: 'sh-1043',
    shipment_code: 'LS-2026-1043',
    business_id: 'biz-01',
    business_name: 'Delhi Tech Exports Pvt Ltd',
    pickup_location: 'Chakan MIDC Industrial Area, Pune',
    pickup_city: 'Pune',
    pickup_lat: 18.7606,
    pickup_lng: 73.8567,
    delivery_location: 'Sanand Industrial Estate, Ahmedabad',
    delivery_city: 'Ahmedabad',
    delivery_lat: 22.9868,
    delivery_lng: 72.3814,
    goods_type: 'Automotive Precision Spare Parts',
    weight: 3.8,
    weight_unit: 'Tonnes',
    packages_count: 42,
    vehicle_type: 'Eicher Pro 14ft Open (4T)',
    special_instructions: 'Keep dry, stack max 3 crates high.',
    expected_budget: 26000,
    contact_person: 'Sandeep Patil',
    contact_phone: '+91 97665 43210',
    pickup_date: '2026-11-16',
    delivery_deadline: '2026-11-19',
    status: 'CONFIRMED',
    created_at: '2026-11-13T14:30:00Z',
    quotations_count: 2,
    assigned_transporter: 'Singh Express Roadways',
    assigned_driver: 'Ramesh Yadav',
    assigned_vehicle: 'HR 26 DQ 8831'
  },
  {
    id: 'sh-1044',
    shipment_code: 'LS-2026-1044',
    business_id: 'biz-01',
    business_name: 'Delhi Tech Exports Pvt Ltd',
    pickup_location: 'Peenya Industrial Area 4th Phase, Bengaluru',
    pickup_city: 'Bengaluru',
    pickup_lat: 13.0285,
    pickup_lng: 77.5197,
    delivery_location: 'Sriperumbudur SEZ, Chennai',
    delivery_city: 'Chennai',
    delivery_lat: 12.9699,
    delivery_lng: 79.9407,
    goods_type: 'Solar Inverters & Electronic Assemblies',
    weight: 6.2,
    weight_unit: 'Tonnes',
    packages_count: 24,
    vehicle_type: '19ft Heavy Truck (7T)',
    special_instructions: 'Fragile equipment. Electronic shocksensors attached.',
    expected_budget: 34000,
    contact_person: 'K. Ramanathan',
    contact_phone: '+91 94440 12345',
    pickup_date: '2026-11-18',
    delivery_deadline: '2026-11-20',
    status: 'BOOKED',
    created_at: '2026-11-14T09:15:00Z',
    quotations_count: 2
  },
  {
    id: 'sh-1040',
    shipment_code: 'LS-2026-1040',
    business_id: 'biz-01',
    business_name: 'Delhi Tech Exports Pvt Ltd',
    pickup_location: 'VKI Area Road No. 9, Jaipur',
    pickup_city: 'Jaipur',
    pickup_lat: 26.9658,
    pickup_lng: 75.7681,
    delivery_location: 'Mayapuri Industrial Area, New Delhi',
    delivery_city: 'Delhi',
    delivery_lat: 28.6367,
    delivery_lng: 77.1126,
    goods_type: 'Glazed Ceramic Tiles & Stone Slabs',
    weight: 15.0,
    weight_unit: 'Tonnes',
    packages_count: 120,
    vehicle_type: '32ft Multi-Axle Container (16T)',
    special_instructions: 'Fragile, loaded vertically on A-frames.',
    expected_budget: 38000,
    contact_person: 'Mohan Sharma',
    contact_phone: '+91 94140 55667',
    pickup_date: '2026-11-04',
    delivery_deadline: '2026-11-07',
    status: 'DELIVERED',
    created_at: '2026-11-02T11:00:00Z',
    quotations_count: 4,
    assigned_transporter: 'Singh Express Roadways',
    assigned_driver: 'Ramesh Yadav',
    assigned_vehicle: 'DL 01 AA 4291'
  },
  {
    id: 'sh-1039',
    shipment_code: 'LS-2026-1039',
    business_id: 'biz-01',
    business_name: 'Delhi Tech Exports Pvt Ltd',
    pickup_location: 'Focal Point Industrial Complex, Ludhiana',
    pickup_city: 'Ludhiana',
    pickup_lat: 30.8755,
    pickup_lng: 75.8924,
    delivery_location: 'Noida Sector 63 Export Zone, Noida',
    delivery_city: 'Noida',
    delivery_lat: 28.6279,
    delivery_lng: 77.3789,
    goods_type: 'Textile Fabric Rolls & Hosiery Products',
    weight: 4.5,
    weight_unit: 'Tonnes',
    packages_count: 65,
    vehicle_type: 'Eicher Pro 14ft Open (4T)',
    special_instructions: 'Moisture-proof wrapping required.',
    expected_budget: 22000,
    contact_person: 'Gurpreet Singh',
    contact_phone: '+91 98140 99887',
    pickup_date: '2026-10-28',
    delivery_deadline: '2026-10-30',
    status: 'DELIVERED',
    created_at: '2026-10-25T15:20:00Z',
    quotations_count: 3
  }
];

export const SEED_QUOTATIONS: Quotation[] = [
  {
    id: 'quot-01',
    shipment_id: 'sh-1044',
    shipment_code: 'LS-2026-1044',
    transporter_id: 'trans-01',
    transporter_name: 'Singh Express Roadways',
    transporter_rating: 4.85,
    proposed_price: 32500,
    estimated_delivery: '28-32 Hours',
    available_vehicle_id: 'veh-02',
    vehicle_info: 'Eicher Pro 14ft Open (4T) / HR 26 DQ 8831',
    additional_charges: 0,
    message: 'We operate daily direct shuttles on the Bangalore-Chennai corridor. GPS-enabled vehicle with insured transit.',
    status: 'pending',
    created_at: '2026-11-14T11:00:00Z'
  },
  {
    id: 'quot-02',
    shipment_id: 'sh-1044',
    shipment_code: 'LS-2026-1044',
    transporter_id: 'trans-02',
    transporter_name: 'Deccan Freightlines',
    transporter_rating: 4.60,
    proposed_price: 35000,
    estimated_delivery: '24 Hours Express',
    additional_charges: 1500,
    message: 'Dedicated vehicle with 2 drivers for non-stop transit. Immediate placement.',
    status: 'pending',
    created_at: '2026-11-14T13:40:00Z'
  },
  {
    id: 'quot-03',
    shipment_id: 'sh-1042',
    shipment_code: 'LS-2026-1042',
    transporter_id: 'trans-01',
    transporter_name: 'Singh Express Roadways',
    transporter_rating: 4.85,
    proposed_price: 47500,
    estimated_delivery: '4 days (NH 48 expressway)',
    available_vehicle_id: 'veh-01',
    vehicle_info: '32ft Multi-Axle Container (16T) / DL 01 AA 4291',
    additional_charges: 0,
    message: 'Container body vehicle will ensure 100% moisture protection.',
    status: 'accepted',
    created_at: '2026-11-10T12:00:00Z'
  }
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: 'bk-01',
    shipment_id: 'sh-1042',
    transporter_id: 'trans-01',
    transporter_name: 'Singh Express Roadways',
    driver_id: 'drv-01',
    driver_name: 'Ramesh Yadav',
    driver_phone: '+91 98765 43210',
    vehicle_id: 'veh-01',
    vehicle_registration: 'DL 01 AA 4291',
    final_price: 47500,
    booking_status: 'ongoing',
    created_at: '2026-11-10T16:00:00Z'
  },
  {
    id: 'bk-02',
    shipment_id: 'sh-1043',
    transporter_id: 'trans-01',
    transporter_name: 'Singh Express Roadways',
    driver_id: 'drv-01',
    driver_name: 'Ramesh Yadav',
    driver_phone: '+91 98765 43210',
    vehicle_id: 'veh-02',
    vehicle_registration: 'HR 26 DQ 8831',
    final_price: 25500,
    booking_status: 'confirmed',
    created_at: '2026-11-13T17:00:00Z'
  },
  {
    id: 'bk-03',
    shipment_id: 'sh-1040',
    transporter_id: 'trans-01',
    transporter_name: 'Singh Express Roadways',
    driver_id: 'drv-01',
    driver_name: 'Ramesh Yadav',
    driver_phone: '+91 98765 43210',
    vehicle_id: 'veh-01',
    vehicle_registration: 'DL 01 AA 4291',
    final_price: 37000,
    booking_status: 'completed',
    created_at: '2026-11-02T14:00:00Z'
  }
];

export const SEED_TRACKING: TrackingUpdate[] = [
  {
    id: 'trk-01',
    shipment_id: 'sh-1042',
    status: 'BOOKED',
    location: 'Okhla Industrial Area, New Delhi',
    lat: 28.5355,
    lng: 77.2732,
    description: 'Shipment booking confirmed by business Delhi Tech Exports.',
    updated_at: '2026-11-10T16:00:00Z'
  },
  {
    id: 'trk-02',
    shipment_id: 'sh-1042',
    status: 'CONFIRMED',
    location: 'Singh Logistics Depot, Gurugram',
    lat: 28.4595,
    lng: 77.0266,
    description: 'Vehicle DL 01 AA 4291 and Driver Ramesh Yadav assigned.',
    updated_at: '2026-11-11T09:30:00Z'
  },
  {
    id: 'trk-03',
    shipment_id: 'sh-1042',
    status: 'PICKED UP',
    location: 'Okhla Warehouse Gate #3, New Delhi',
    lat: 28.5355,
    lng: 77.2732,
    description: 'Cargo loaded and verified (12.5T Industrial Drives). E-Way Bill 4819283719 verified.',
    updated_at: '2026-11-12T14:15:00Z'
  },
  {
    id: 'trk-04',
    shipment_id: 'sh-1042',
    status: 'IN TRANSIT',
    location: 'NH 48 Highway Toll Plaza, Near Vadodara / Surat bypass',
    lat: 21.7051,
    lng: 72.9959,
    description: 'Vehicle moving at steady speed (62 km/h). All cargo seals intact. ETA Mumbai tomorrow noon.',
    updated_at: '2026-11-15T18:20:00Z'
  }
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-01',
    booking_id: 'bk-01',
    shipment_code: 'LS-2026-1042',
    amount: 47500,
    platform_fee: 4750, // 10%
    payment_status: 'completed',
    payment_method: 'HDFC Corporate NetBanking',
    transaction_reference: 'TXN-LS-98124982',
    paid_at: '2026-11-10T16:05:00Z',
    created_at: '2026-11-10T16:00:00Z'
  },
  {
    id: 'pay-02',
    booking_id: 'bk-02',
    shipment_code: 'LS-2026-1043',
    amount: 25500,
    platform_fee: 2550, // 10%
    payment_status: 'pending',
    payment_method: 'UPI Business Autopay',
    transaction_reference: 'TXN-LS-98124999',
    created_at: '2026-11-13T17:05:00Z'
  },
  {
    id: 'pay-03',
    booking_id: 'bk-03',
    shipment_code: 'LS-2026-1040',
    amount: 37000,
    platform_fee: 3700, // 10%
    payment_status: 'completed',
    payment_method: 'ICICI Bank NEFT',
    transaction_reference: 'TXN-LS-98124711',
    paid_at: '2026-11-02T14:10:00Z',
    created_at: '2026-11-02T14:00:00Z'
  }
];

export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-01',
    shipment_id: 'sh-1040',
    shipment_code: 'LS-2026-1040',
    raised_by_name: 'Rajesh Sharma',
    raised_by_role: 'Business Owner',
    subject: 'Minor outer packaging tear on crate #4',
    description: 'During unloading at Mayapuri, outer tarpaulin cover had a 5-inch tear. Goods inside were undamaged.',
    status: 'resolved',
    priority: 'low',
    created_at: '2026-11-07T16:30:00Z'
  },
  {
    id: 'cmp-02',
    shipment_id: 'sh-1042',
    shipment_code: 'LS-2026-1042',
    raised_by_name: 'Vikramjit Singh',
    raised_by_role: 'Transporter',
    subject: 'Toll clearance delay at Rajasthan-Gujarat border',
    description: 'National highway FASTag server downtime caused 2 hour stoppage at Shamlaji toll.',
    status: 'open',
    priority: 'medium',
    created_at: '2026-11-14T08:00:00Z'
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    user_id: 'usr-biz-01',
    title: 'New Quotation Received',
    message: 'Singh Express Roadways submitted a quote of ₹32,500 for Shipment LS-2026-1044.',
    link: '/dashboard/business/quotations',
    is_read: false,
    created_at: '2026-11-14T11:00:00Z'
  },
  {
    id: 'notif-02',
    user_id: 'usr-biz-01',
    title: 'Shipment In Transit',
    message: 'Shipment LS-2026-1042 crossed Vadodara and is approaching Surat.',
    link: '/dashboard/business/track/sh-1042',
    is_read: true,
    created_at: '2026-11-15T18:20:00Z'
  },
  {
    id: 'notif-03',
    user_id: 'usr-drv-01',
    title: 'New Route Assigned',
    message: 'You have been assigned to drive shipment LS-2026-1042 (Delhi to Mumbai).',
    link: '/dashboard/driver',
    is_read: false,
    created_at: '2026-11-11T09:30:00Z'
  }
];

