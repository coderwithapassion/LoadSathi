-- ========================================================
-- LoadSaathi – Smart Logistics Marketplace Database Schema
-- Supabase PostgreSQL Schema with RLS Policies & Triggers
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('business', 'transporter', 'driver', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shipment_status AS ENUM (
        'BOOKED', 
        'CONFIRMED', 
        'PICKED UP', 
        'IN TRANSIT', 
        'OUT FOR DELIVERY', 
        'DELIVERED', 
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quotation_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('confirmed', 'ongoing', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'business',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 2. BUSINESSES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    gstin TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    business_type TEXT DEFAULT 'Manufacturing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_business_user UNIQUE(user_id)
);

-- --------------------------------------------------------
-- 3. TRANSPORTERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transporters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    fleet_size INTEGER DEFAULT 1,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    rating NUMERIC(3, 2) DEFAULT 4.80,
    total_reviews INTEGER DEFAULT 0,
    documents_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_transporter_user UNIQUE(user_id)
);

-- --------------------------------------------------------
-- 4. DRIVERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    transporter_id UUID REFERENCES public.transporters(id) ON DELETE SET NULL,
    license_number TEXT NOT NULL,
    experience_years INTEGER DEFAULT 2,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    is_available BOOLEAN DEFAULT true,
    current_location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_driver_user UNIQUE(user_id)
);

-- --------------------------------------------------------
-- 5. VEHICLES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transporter_id UUID NOT NULL REFERENCES public.transporters(id) ON DELETE CASCADE,
    registration_number TEXT UNIQUE NOT NULL,
    vehicle_type TEXT NOT NULL, -- e.g., 'Tata Ace / 1.5 Ton', 'Eicher 14ft / 4 Ton', '32ft Multi-Axle / 16 Ton'
    capacity NUMERIC(8, 2) NOT NULL, -- in Tonnes or KG
    capacity_unit TEXT DEFAULT 'Tonnes',
    availability BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    approval_status verification_status NOT NULL DEFAULT 'verified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 6. SHIPMENTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_code TEXT UNIQUE NOT NULL, -- e.g. LS-2026-9812
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    pickup_location TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    pickup_lat NUMERIC(10, 6) DEFAULT 28.6139,
    pickup_lng NUMERIC(10, 6) DEFAULT 77.2090,
    delivery_location TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_lat NUMERIC(10, 6) DEFAULT 19.0760,
    delivery_lng NUMERIC(10, 6) DEFAULT 72.8777,
    goods_type TEXT NOT NULL,
    weight NUMERIC(10, 2) NOT NULL,
    weight_unit TEXT DEFAULT 'Tonnes',
    packages_count INTEGER DEFAULT 1,
    vehicle_type TEXT NOT NULL,
    special_instructions TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    pickup_date DATE NOT NULL,
    delivery_deadline DATE NOT NULL,
    budget NUMERIC(12, 2) NOT NULL,
    status shipment_status NOT NULL DEFAULT 'BOOKED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 7. QUOTATIONS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    transporter_id UUID NOT NULL REFERENCES public.transporters(id) ON DELETE CASCADE,
    proposed_price NUMERIC(12, 2) NOT NULL,
    estimated_delivery TEXT NOT NULL, -- e.g. '24-36 Hours' or specific date
    available_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    additional_charges NUMERIC(10, 2) DEFAULT 0,
    message TEXT,
    status quotation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 8. BOOKINGS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    transporter_id UUID NOT NULL REFERENCES public.transporters(id) ON DELETE RESTRICT,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    final_price NUMERIC(12, 2) NOT NULL,
    booking_status booking_status NOT NULL DEFAULT 'confirmed',
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_shipment_booking UNIQUE(shipment_id)
);

-- --------------------------------------------------------
-- 9. TRACKING_UPDATES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tracking_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
    status shipment_status NOT NULL,
    location TEXT NOT NULL,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    description TEXT,
    proof_image_url TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 10. PAYMENTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL, -- e.g. 10% commission
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT 'UPI / NetBanking',
    transaction_reference TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 11. REVIEWS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- 12. NOTIFICATIONS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- --------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_shipments_business ON public.shipments(business_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_quotations_shipment ON public.quotations(shipment_id);
CREATE INDEX IF NOT EXISTS idx_quotations_transporter ON public.quotations(transporter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_shipment ON public.bookings(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_shipment ON public.tracking_updates(shipment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view their own profile, admins can view all
CREATE POLICY "Profiles view policy" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles update policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Shipments policies:
-- Business can manage their own, transporters/drivers can view open/assigned, admins full access
CREATE POLICY "Shipments select policy" ON public.shipments
    FOR SELECT USING (
        public.is_admin() OR
        business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid()) OR
        status IN ('BOOKED', 'CONFIRMED', 'PICKED UP', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED')
    );

CREATE POLICY "Shipments insert policy" ON public.shipments
    FOR INSERT WITH CHECK (
        public.is_admin() OR
        business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
    );

CREATE POLICY "Shipments update policy" ON public.shipments
    FOR UPDATE USING (
        public.is_admin() OR
        business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
    );

-- Quotations policies:
CREATE POLICY "Quotations select policy" ON public.quotations
    FOR SELECT USING (
        public.is_admin() OR
        transporter_id IN (SELECT id FROM public.transporters WHERE user_id = auth.uid()) OR
        shipment_id IN (SELECT id FROM public.shipments WHERE business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid()))
    );

CREATE POLICY "Quotations insert policy" ON public.quotations
    FOR INSERT WITH CHECK (
        public.is_admin() OR
        transporter_id IN (SELECT id FROM public.transporters WHERE user_id = auth.uid())
    );

CREATE POLICY "Quotations update policy" ON public.quotations
    FOR UPDATE USING (
        public.is_admin() OR
        transporter_id IN (SELECT id FROM public.transporters WHERE user_id = auth.uid()) OR
        shipment_id IN (SELECT id FROM public.shipments WHERE business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid()))
    );

-- Notifications policy:
CREATE POLICY "User notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Tracking updates policy:
CREATE POLICY "Tracking viewable by authenticated users" ON public.tracking_updates
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Tracking insert by drivers and transporters" ON public.tracking_updates
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

