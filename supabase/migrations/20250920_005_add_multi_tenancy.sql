-- Phase 2 Migration 005: Add Multi-Tenancy Support
-- Date: 2025-09-20
-- Purpose: Add organization/tenant isolation for B2B platform

-- ==============================================
-- 1. CREATE ORGANIZATIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Organization details
    name VARCHAR(200) NOT NULL,
    display_name VARCHAR(200),
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
    description TEXT,
    
    -- Contact information
    website_url VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Address
    address VARCHAR(255),
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Россия',
    
    -- Business information
    business_type VARCHAR(50), -- 'property_manager', 'investor_fund', 'tenant_company'
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    
    -- Status and settings
    is_active BOOLEAN DEFAULT true,
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    max_users INTEGER DEFAULT 10,
    max_properties INTEGER DEFAULT 100,
    
    -- Branding
    logo_url VARCHAR(500),
    primary_color VARCHAR(7), -- Hex color code
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. ADD TENANT_ID TO EXISTING TABLES
-- ==============================================

-- Add organization_id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Add organization_id to tenant_applications
ALTER TABLE tenant_applications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Add organization_id to properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Add organization_id to investments
ALTER TABLE investments ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Add organization_id to documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- ==============================================
-- 3. CREATE ORGANIZATION MEMBERSHIPS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Membership details
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Role within organization
    org_role VARCHAR(50) DEFAULT 'member' CHECK (org_role IN ('owner', 'admin', 'member', 'viewer')),
    permissions JSONB, -- Array of specific permissions
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
    invited_by UUID REFERENCES profiles(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, user_id)
);

-- ==============================================
-- 4. CREATE INDEXES FOR MULTI-TENANCY
-- ==============================================

-- Organizations indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_business_type ON organizations(business_type);
CREATE INDEX idx_organizations_active ON organizations(is_active);

-- Tenant isolation indexes
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_tenant_applications_organization ON tenant_applications(organization_id);
CREATE INDEX idx_properties_organization ON properties(organization_id);
CREATE INDEX idx_investments_organization ON investments(organization_id);
CREATE INDEX idx_documents_organization ON documents(organization_id);

-- Membership indexes
CREATE INDEX idx_organization_memberships_org ON organization_memberships(organization_id);
CREATE INDEX idx_organization_memberships_user ON organization_memberships(user_id);
CREATE INDEX idx_organization_memberships_role ON organization_memberships(org_role);

-- ==============================================
-- 5. CREATE UPDATE TRIGGERS
-- ==============================================

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_memberships_updated_at
    BEFORE UPDATE ON organization_memberships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 6. ADD ROW LEVEL SECURITY POLICIES
-- ==============================================

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organizations
CREATE POLICY "Users can view their organizations"
ON organizations
FOR SELECT
USING (
    id IN (
        SELECT organization_id 
        FROM organization_memberships 
        WHERE user_id = (SELECT id FROM profiles WHERE email = current_user)
        AND status = 'active'
    )
);

-- Organization memberships: Users can only see memberships in their organizations
CREATE POLICY "Users can view organization memberships"
ON organization_memberships
FOR SELECT
USING (
    organization_id IN (
        SELECT organization_id 
        FROM organization_memberships 
        WHERE user_id = (SELECT id FROM profiles WHERE email = current_user)
        AND status = 'active'
    )
);

-- Update existing tables with tenant isolation policies
-- Profiles: Users can only see profiles in their organization
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view organization profiles"
ON profiles
FOR SELECT
USING (
    id = (SELECT id FROM profiles WHERE email = current_user)
    OR organization_id IN (
        SELECT organization_id 
        FROM organization_memberships 
        WHERE user_id = (SELECT id FROM profiles WHERE email = current_user)
        AND status = 'active'
    )
);

-- ==============================================
-- 7. CREATE DEFAULT ORGANIZATIONS
-- ==============================================

-- Create default organization for existing data
INSERT INTO organizations (
    name,
    display_name,
    slug,
    description,
    business_type,
    is_active
) VALUES (
    'ODE Portal',
    'ODE Portal - Главная организация',
    'ode-portal',
    'Основная организация для управления платформой ODE Portal',
    'property_manager',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Create sample tenant organization
INSERT INTO organizations (
    name,
    display_name,
    slug,
    description,
    business_type,
    max_users,
    max_properties
) VALUES (
    'Инвест Групп',
    'ООО "Инвест Групп"',
    'invest-group',
    'Инвестиционная компания, специализирующаяся на коммерческой недвижимости',
    'investor_fund',
    25,
    500
) ON CONFLICT (slug) DO NOTHING;

-- ==============================================
-- 8. MIGRATE EXISTING DATA
-- ==============================================

DO $$
DECLARE
    main_org_id UUID;
    investor_org_id UUID;
    admin_id UUID;
    investor_id UUID;
BEGIN
    -- Get organization IDs
    SELECT id INTO main_org_id FROM organizations WHERE slug = 'ode-portal';
    SELECT id INTO investor_org_id FROM organizations WHERE slug = 'invest-group';
    
    -- Get user IDs
    SELECT id INTO admin_id FROM profiles WHERE email = 'admin@odportal.com';
    SELECT id INTO investor_id FROM profiles WHERE email = 'investor@example.com';
    
    -- Assign admin to main organization
    IF admin_id IS NOT NULL AND main_org_id IS NOT NULL THEN
        UPDATE profiles SET organization_id = main_org_id WHERE id = admin_id;
        
        INSERT INTO organization_memberships (organization_id, user_id, org_role, status)
        VALUES (main_org_id, admin_id, 'owner', 'active')
        ON CONFLICT (organization_id, user_id) DO NOTHING;
    END IF;
    
    -- Assign investor to investor organization
    IF investor_id IS NOT NULL AND investor_org_id IS NOT NULL THEN
        UPDATE profiles SET organization_id = investor_org_id WHERE id = investor_id;
        
        INSERT INTO organization_memberships (organization_id, user_id, org_role, status)
        VALUES (investor_org_id, investor_id, 'member', 'active')
        ON CONFLICT (organization_id, user_id) DO NOTHING;
    END IF;
    
    -- Update existing data with organization assignments
    IF main_org_id IS NOT NULL THEN
        -- Assign applications to main org (as they come through the platform)
        UPDATE tenant_applications SET organization_id = main_org_id WHERE organization_id IS NULL;
        
        -- Assign properties to main org
        UPDATE properties SET organization_id = main_org_id WHERE organization_id IS NULL;
        
        -- Assign documents to appropriate organizations
        UPDATE documents SET organization_id = main_org_id WHERE organization_id IS NULL;
    END IF;
    
    -- Assign investments to investor organization
    IF investor_org_id IS NOT NULL AND investor_id IS NOT NULL THEN
        UPDATE investments 
        SET organization_id = investor_org_id 
        WHERE investor_id = investor_id AND organization_id IS NULL;
    END IF;
END $$;

-- ==============================================
-- 9. CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to get current user's organization
CREATE OR REPLACE FUNCTION get_current_user_organization()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT organization_id 
    FROM profiles 
    WHERE email = current_user
    LIMIT 1;
$$;

-- Function to check organization membership
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_email VARCHAR)
RETURNS boolean
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM organization_memberships om
        JOIN profiles p ON om.user_id = p.id
        WHERE om.organization_id = org_id 
        AND p.email = user_email
        AND om.status = 'active'
    );
$$;

-- Function to check organization role
CREATE OR REPLACE FUNCTION has_organization_role(org_id UUID, user_email VARCHAR, required_role VARCHAR)
RETURNS boolean
LANGUAGE sql
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM organization_memberships om
        JOIN profiles p ON om.user_id = p.id
        WHERE om.organization_id = org_id 
        AND p.email = user_email
        AND om.org_role = required_role
        AND om.status = 'active'
    );
$$;