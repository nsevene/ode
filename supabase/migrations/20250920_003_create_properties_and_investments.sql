-- Phase 2 Migration 003: Create Properties and Investments Tables
-- Date: 2025-09-20
-- Purpose: Create properties and investments tables for B2B platform

-- ==============================================
-- 1. CREATE PROPERTIES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic property information
    name VARCHAR(100) NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    
    -- Location information
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Россия',
    
    -- Property details
    total_area_sqm INTEGER NOT NULL, -- Total area in square meters
    available_area_sqm INTEGER, -- Available area for lease
    floor_number INTEGER,
    total_floors INTEGER,
    parking_spaces INTEGER DEFAULT 0,
    
    -- Financial information
    price_per_sqm_month DECIMAL(10,2), -- Monthly rent per square meter
    base_rent_monthly DECIMAL(12,2), -- Base monthly rent
    utilities_included BOOLEAN DEFAULT false,
    security_deposit_months INTEGER DEFAULT 2,
    
    -- Property features
    features JSONB, -- Array of features: ["wifi", "parking", "security", etc.]
    amenities JSONB, -- Array of amenities
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    available_from DATE,
    lease_term_min_months INTEGER DEFAULT 12,
    lease_term_max_months INTEGER DEFAULT 60,
    
    -- Media
    images JSONB, -- Array of image URLs
    floor_plan_url VARCHAR(500),
    virtual_tour_url VARCHAR(500),
    
    -- Management
    property_manager_id UUID REFERENCES profiles(id),
    owner_company VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. CREATE INVESTMENTS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Investor and property
    investor_id UUID NOT NULL REFERENCES profiles(id),
    property_id UUID NOT NULL REFERENCES properties(id),
    
    -- Investment details
    investment_amount DECIMAL(15,2) NOT NULL,
    investment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ownership_percentage DECIMAL(5,2) CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    
    -- Financial tracking
    current_valuation DECIMAL(15,2),
    total_returns DECIMAL(15,2) DEFAULT 0,
    monthly_rental_income DECIMAL(12,2) DEFAULT 0,
    
    -- Performance metrics
    irr_percentage DECIMAL(5,2), -- Internal Rate of Return
    total_return_percentage DECIMAL(5,2), -- Total return percentage
    holding_period_months INTEGER DEFAULT 0,
    
    -- Investment status
    status investment_status DEFAULT 'pending' NOT NULL,
    exit_date DATE,
    exit_amount DECIMAL(15,2),
    exit_reason TEXT,
    
    -- Notes
    investment_notes TEXT,
    risk_assessment TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 3. CREATE INVESTMENT RETURNS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS investment_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
    
    -- Return details
    return_date DATE NOT NULL,
    return_amount DECIMAL(12,2) NOT NULL,
    return_type VARCHAR(20) NOT NULL CHECK (return_type IN ('rental', 'dividend', 'capital_gain', 'other')),
    description TEXT,
    
    -- Tax information
    gross_amount DECIMAL(12,2),
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Properties indexes
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_available ON properties(is_available);
CREATE INDEX idx_properties_price ON properties(price_per_sqm_month);
CREATE INDEX idx_properties_area ON properties(total_area_sqm);
CREATE INDEX idx_properties_manager ON properties(property_manager_id);

-- Investments indexes
CREATE INDEX idx_investments_investor ON investments(investor_id);
CREATE INDEX idx_investments_property ON investments(property_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_date ON investments(investment_date);
CREATE INDEX idx_investments_amount ON investments(investment_amount);

-- Investment returns indexes
CREATE INDEX idx_investment_returns_investment ON investment_returns(investment_id);
CREATE INDEX idx_investment_returns_date ON investment_returns(return_date);
CREATE INDEX idx_investment_returns_type ON investment_returns(return_type);

-- ==============================================
-- 5. CREATE UPDATE TRIGGERS
-- ==============================================

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at
    BEFORE UPDATE ON investments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_returns_updated_at
    BEFORE UPDATE ON investment_returns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 6. CREATE SAMPLE DATA
-- ==============================================

-- Insert sample properties
INSERT INTO properties (
    name,
    description,
    property_type,
    address,
    city,
    region,
    total_area_sqm,
    available_area_sqm,
    floor_number,
    price_per_sqm_month,
    base_rent_monthly,
    features,
    amenities,
    is_available,
    available_from
) VALUES 
(
    'Офисный центр "Московский"',
    'Современный офисный центр в деловом районе Москвы с развитой инфраструктурой',
    'office',
    'ул. Тверская, д. 15',
    'Москва',
    'Московская область',
    5000,
    2500,
    5,
    3500.00,
    8750000.00,
    '["wifi", "parking", "security", "elevators", "air_conditioning"]',
    '["restaurant", "gym", "conference_rooms", "reception"]',
    true,
    '2025-01-01'
),
(
    'ТЦ "Новый Арбат"',
    'Торговый центр в центре Москвы с высокой проходимостью',
    'retail',
    'Новый Арбат, д. 24',
    'Москва',
    'Московская область',
    8000,
    3000,
    2,
    5000.00,
    15000000.00,
    '["escalators", "parking", "security", "loading_dock"]',
    '["food_court", "cinema", "entertainment", "children_area"]',
    true,
    '2025-02-01'
),
(
    'Ресторанный комплекс "Парк"',
    'Ресторанный комплекс в парковой зоне с летними террасами',
    'restaurant',
    'Парк Сокольники, павильон 12',
    'Москва',
    'Московская область',
    1200,
    800,
    1,
    4000.00,
    3200000.00,
    '["kitchen_equipment", "ventilation", "terrace", "parking"]',
    '["garden_view", "outdoor_seating", "events_space"]',
    true,
    '2025-03-01'
) ON CONFLICT DO NOTHING;

-- Get admin and sample investor for investments
DO $$
DECLARE
    admin_id UUID;
    prop1_id UUID;
    prop2_id UUID;
BEGIN
    -- Get admin ID
    SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
    
    -- Get property IDs
    SELECT id INTO prop1_id FROM properties WHERE name = 'Офисный центр "Московский"' LIMIT 1;
    SELECT id INTO prop2_id FROM properties WHERE name = 'ТЦ "Новый Арбат"' LIMIT 1;
    
    -- Create sample investor
    INSERT INTO profiles (
        email,
        display_name,
        first_name,
        last_name,
        role,
        company_name,
        profile_completed
    ) VALUES (
        'investor@example.com',
        'Петр Инвестор',
        'Петр',
        'Инвестор',
        'investor',
        'ООО ИнвестГрупп',
        true
    ) ON CONFLICT (email) DO NOTHING;
    
    -- Create sample investments if properties exist
    IF prop1_id IS NOT NULL AND prop2_id IS NOT NULL THEN
        INSERT INTO investments (
            investor_id,
            property_id,
            investment_amount,
            ownership_percentage,
            current_valuation,
            monthly_rental_income,
            irr_percentage,
            status
        ) VALUES 
        (
            (SELECT id FROM profiles WHERE email = 'investor@example.com'),
            prop1_id,
            50000000.00,
            25.00,
            55000000.00,
            2187500.00,
            12.5,
            'active'
        ),
        (
            (SELECT id FROM profiles WHERE email = 'investor@example.com'),
            prop2_id,
            75000000.00,
            15.00,
            82000000.00,
            2250000.00,
            15.2,
            'active'
        );
    END IF;
END $$;

-- ==============================================
-- 7. CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to get investor portfolio
CREATE OR REPLACE FUNCTION get_investor_portfolio(investor_email VARCHAR)
RETURNS TABLE(
    property_name VARCHAR,
    investment_amount DECIMAL,
    current_valuation DECIMAL,
    ownership_percentage DECIMAL,
    monthly_income DECIMAL,
    total_return_percentage DECIMAL,
    status investment_status
)
LANGUAGE sql
AS $$
    SELECT 
        p.name,
        i.investment_amount,
        i.current_valuation,
        i.ownership_percentage,
        i.monthly_rental_income,
        i.total_return_percentage,
        i.status
    FROM investments i
    JOIN properties p ON i.property_id = p.id
    JOIN profiles pr ON i.investor_id = pr.id
    WHERE pr.email = investor_email
    ORDER BY i.investment_date DESC;
$$;

-- Function to calculate portfolio KPIs
CREATE OR REPLACE FUNCTION get_portfolio_kpis(investor_email VARCHAR)
RETURNS TABLE(
    total_invested DECIMAL,
    current_portfolio_value DECIMAL,
    total_monthly_income DECIMAL,
    average_irr DECIMAL,
    number_of_properties INTEGER
)
LANGUAGE sql
AS $$
    SELECT 
        COALESCE(SUM(i.investment_amount), 0),
        COALESCE(SUM(i.current_valuation), 0),
        COALESCE(SUM(i.monthly_rental_income), 0),
        COALESCE(AVG(i.irr_percentage), 0),
        COUNT(i.id)::INTEGER
    FROM investments i
    JOIN profiles pr ON i.investor_id = pr.id
    WHERE pr.email = investor_email AND i.status = 'active';
$$;