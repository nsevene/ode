-- Phase 2 Migration 001: Create Enums and Profiles Table
-- Date: 2025-09-20
-- Purpose: Create foundational types and user profiles table

-- ==============================================
-- 1. CREATE ENUM TYPES
-- ==============================================

-- User roles for the B2B platform
CREATE TYPE user_role AS ENUM (
    'admin',        -- System administrators
    'investor',     -- Investors with portfolio access
    'tenant',       -- Tenants with applications
    'public'        -- Public/unauthenticated users
);

-- Application status for tenant applications
CREATE TYPE application_status AS ENUM (
    'pending',      -- Initial status after submission
    'under_review', -- Admin is reviewing the application
    'approved',     -- Application accepted
    'rejected',     -- Application declined
    'contacted'     -- Admin contacted the applicant
);

-- Property types for real estate
CREATE TYPE property_type AS ENUM (
    'office',       -- Office spaces
    'retail',       -- Retail/shopping spaces
    'warehouse',    -- Storage and logistics
    'restaurant',   -- Food service locations
    'mixed_use'     -- Combined use properties
);

-- Investment status
CREATE TYPE investment_status AS ENUM (
    'active',       -- Currently invested
    'pending',      -- Investment in process
    'exited',       -- Investment completed/sold
    'cancelled'     -- Investment cancelled
);

-- Document access levels
CREATE TYPE document_access_level AS ENUM (
    'public',       -- Everyone can access
    'tenant',       -- Only tenants
    'investor',     -- Only investors
    'admin',        -- Only admins
    'private'       -- Owner only
);

-- ==============================================
-- 2. CREATE PROFILES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication info (synced with Supabase Auth)
    auth_user_id UUID UNIQUE, -- References auth.users(id)
    email VARCHAR(255) UNIQUE NOT NULL,
    
    -- Profile information
    display_name VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    
    -- Role and permissions
    role user_role DEFAULT 'public' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    -- Company information (for business users)
    company_name VARCHAR(100),
    company_position VARCHAR(100),
    
    -- Preferences
    language VARCHAR(5) DEFAULT 'ru',
    timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
    email_notifications BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Profile completion
    profile_completed BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false
);

-- ==============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_company_name ON profiles(company_name);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- ==============================================
-- 4. CREATE UPDATE TRIGGER
-- ==============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 6. CREATE RLS POLICIES FOR PROFILES
-- ==============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (auth.uid() = auth_user_id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Admins can update all profiles (for role management)
CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ==============================================
-- 7. CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT role FROM profiles 
    WHERE auth_user_id = auth.uid()
    LIMIT 1;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND role = 'admin'
    );
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE auth_user_id = auth.uid() 
        AND role = required_role
    );
$$;