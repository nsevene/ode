-- Phase 2 Migration 001: Create Enums and Profiles Table (PostgreSQL Compatible)
-- Date: 2025-09-20
-- Purpose: Create foundational types and user profiles table for standard PostgreSQL

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
    
    -- Authentication info
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- For basic auth (will implement proper auth later)
    
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
-- 5. CREATE ADMIN USER
-- ==============================================

-- Insert default admin user for testing
INSERT INTO profiles (
    email,
    password_hash,
    display_name,
    first_name,
    last_name,
    role,
    profile_completed,
    onboarding_completed
) VALUES (
    'admin@odportal.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password123'
    'Системный администратор',
    'Админ',
    'ODPortal',
    'admin',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- ==============================================
-- 6. CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to get user by email
CREATE OR REPLACE FUNCTION get_user_by_email(user_email VARCHAR)
RETURNS TABLE(
    id UUID,
    email VARCHAR,
    display_name VARCHAR,
    role user_role,
    is_active BOOLEAN
)
LANGUAGE sql
AS $$
    SELECT p.id, p.email, p.display_name, p.role, p.is_active
    FROM profiles p 
    WHERE p.email = user_email AND p.is_active = true;
$$;

-- Function to check if user is admin by email
CREATE OR REPLACE FUNCTION is_admin_user(user_email VARCHAR)
RETURNS boolean
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE email = user_email 
        AND role = 'admin'
        AND is_active = true
    );
$$;

-- Function to get user role by email
CREATE OR REPLACE FUNCTION get_user_role(user_email VARCHAR)
RETURNS user_role
LANGUAGE sql
AS $$
    SELECT role FROM profiles 
    WHERE email = user_email 
    AND is_active = true
    LIMIT 1;
$$;