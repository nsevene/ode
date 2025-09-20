-- Phase 2 Migration 002: Create Tenant Applications Table
-- Date: 2025-09-20
-- Purpose: Create tenant applications table for B2B platform

-- ==============================================
-- 1. CREATE TENANT APPLICATIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS tenant_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Application status and metadata
    status application_status DEFAULT 'pending' NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES profiles(id),
    
    -- Contact information
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Business information
    brand_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100),
    website_url VARCHAR(255),
    concept_description TEXT NOT NULL,
    
    -- Property preferences
    preferred_property_type property_type NOT NULL,
    desired_location VARCHAR(255),
    desired_space_size_min INTEGER, -- square meters
    desired_space_size_max INTEGER, -- square meters
    
    -- Financial information
    monthly_budget_min DECIMAL(12,2),
    monthly_budget_max DECIMAL(12,2),
    investment_amount DECIMAL(12,2),
    
    -- Documents and presentations
    presentation_url VARCHAR(500), -- Storage URL for uploaded presentation
    business_plan_url VARCHAR(500), -- Storage URL for business plan
    additional_documents JSONB, -- Array of document URLs
    
    -- Admin notes and processing
    admin_notes TEXT,
    internal_score INTEGER CHECK (internal_score >= 1 AND internal_score <= 10),
    follow_up_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

CREATE INDEX idx_tenant_applications_status ON tenant_applications(status);
CREATE INDEX idx_tenant_applications_email ON tenant_applications(email);
CREATE INDEX idx_tenant_applications_submitted_at ON tenant_applications(submitted_at);
CREATE INDEX idx_tenant_applications_property_type ON tenant_applications(preferred_property_type);
CREATE INDEX idx_tenant_applications_reviewer ON tenant_applications(reviewer_id);
CREATE INDEX idx_tenant_applications_score ON tenant_applications(internal_score);

-- ==============================================
-- 3. CREATE UPDATE TRIGGER
-- ==============================================

-- Trigger to automatically update updated_at
CREATE TRIGGER update_tenant_applications_updated_at
    BEFORE UPDATE ON tenant_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 4. CREATE APPLICATION NOTES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS application_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES tenant_applications(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Note content
    note_text TEXT NOT NULL,
    note_type VARCHAR(20) DEFAULT 'general' CHECK (note_type IN ('general', 'internal', 'followup', 'decision')),
    is_visible_to_applicant BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for application notes
CREATE INDEX idx_application_notes_application_id ON application_notes(application_id);
CREATE INDEX idx_application_notes_author_id ON application_notes(author_id);
CREATE INDEX idx_application_notes_created_at ON application_notes(created_at);

-- Update trigger for application notes
CREATE TRIGGER update_application_notes_updated_at
    BEFORE UPDATE ON application_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 5. CREATE SAMPLE DATA
-- ==============================================

-- Insert sample tenant applications for testing
INSERT INTO tenant_applications (
    full_name,
    email,
    phone,
    brand_name,
    company_name,
    concept_description,
    preferred_property_type,
    desired_location,
    desired_space_size_min,
    desired_space_size_max,
    monthly_budget_min,
    monthly_budget_max,
    status
) VALUES 
(
    'Анна Петрова',
    'anna.petrova@example.com',
    '+7 (495) 123-45-67',
    'Кофе & Круассаны',
    'ООО Петрова Кофе',
    'Уютная кофейня с авторскими напитками и свежими круассанами. Фокус на качественный кофе и дружественную атмосферу.',
    'restaurant',
    'Центр Москвы',
    50,
    80,
    150000.00,
    200000.00,
    'pending'
),
(
    'Игорь Смирнов',
    'igor.smirnov@techstore.ru',
    '+7 (495) 987-65-43',
    'ТехСтор',
    'ООО ТехСтор',
    'Магазин современной электроники и гаджетов. Специализация на мобильных устройствах и аксессуарах.',
    'retail',
    'Торговый центр',
    100,
    150,
    300000.00,
    400000.00,
    'under_review'
),
(
    'Мария Козлова',
    'maria@fitnessstudio.com',
    '+7 (495) 555-12-34',
    'Фитнес Студия Premium',
    'ИП Козлова М.А.',
    'Современная фитнес студия с персональными тренировками и групповыми занятиями.',
    'office',
    'Жилой район',
    200,
    300,
    500000.00,
    700000.00,
    'approved'
) ON CONFLICT DO NOTHING;

-- ==============================================
-- 6. CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to get applications with pagination
CREATE OR REPLACE FUNCTION get_tenant_applications(
    page_offset INTEGER DEFAULT 0,
    page_limit INTEGER DEFAULT 20,
    filter_status application_status DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    full_name VARCHAR,
    email VARCHAR,
    brand_name VARCHAR,
    status application_status,
    submitted_at TIMESTAMP WITH TIME ZONE,
    preferred_property_type property_type
)
LANGUAGE sql
AS $$
    SELECT ta.id, ta.full_name, ta.email, ta.brand_name, ta.status, ta.submitted_at, ta.preferred_property_type
    FROM tenant_applications ta
    WHERE (filter_status IS NULL OR ta.status = filter_status)
    ORDER BY ta.submitted_at DESC
    LIMIT page_limit OFFSET page_offset;
$$;

-- Function to update application status
CREATE OR REPLACE FUNCTION update_application_status(
    app_id UUID,
    new_status application_status,
    reviewer_email VARCHAR,
    note TEXT DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    reviewer_profile_id UUID;
BEGIN
    -- Get reviewer ID
    SELECT id INTO reviewer_profile_id
    FROM profiles 
    WHERE email = reviewer_email AND role = 'admin';
    
    IF reviewer_profile_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Update application
    UPDATE tenant_applications 
    SET 
        status = new_status,
        reviewed_at = NOW(),
        reviewer_id = reviewer_profile_id,
        updated_at = NOW()
    WHERE id = app_id;
    
    -- Add note if provided
    IF note IS NOT NULL THEN
        INSERT INTO application_notes (application_id, author_id, note_text, note_type)
        VALUES (app_id, reviewer_profile_id, note, 'decision');
    END IF;
    
    RETURN true;
END;
$$;