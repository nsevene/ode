-- Phase 2 Migration 004: Create Documents and Audit Tables
-- Date: 2025-09-20
-- Purpose: Create document management and audit logging tables

-- ==============================================
-- 1. CREATE DOCUMENTS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Document metadata
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL, -- Storage path
    file_size BIGINT NOT NULL, -- Size in bytes
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64), -- SHA256 hash for integrity
    
    -- Document categorization
    document_type VARCHAR(50) NOT NULL, -- 'presentation', 'business_plan', 'financial_report', etc.
    title VARCHAR(200),
    description TEXT,
    tags JSONB, -- Array of tags for search
    
    -- Access control
    access_level document_access_level DEFAULT 'private' NOT NULL,
    owner_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Related entities
    property_id UUID REFERENCES properties(id), -- If document relates to specific property
    application_id UUID REFERENCES tenant_applications(id), -- If document relates to application
    investment_id UUID REFERENCES investments(id), -- If document relates to investment
    
    -- Version control
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id), -- For versioning
    is_current_version BOOLEAN DEFAULT true,
    
    -- Security and compliance
    is_confidential BOOLEAN DEFAULT false,
    retention_until DATE, -- When document can be deleted
    encryption_key_id VARCHAR(100), -- For encrypted documents
    
    -- Download tracking
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    last_downloaded_by UUID REFERENCES profiles(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- ==============================================
-- 2. CREATE DOCUMENT ACCESS LOG TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS document_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Access details
    access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('view', 'download', 'share', 'delete')),
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    
    -- Timestamp
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 3. CREATE AUDIT LOGS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User information
    user_id UUID REFERENCES profiles(id),
    user_email VARCHAR(255),
    user_role user_role,
    
    -- Action details
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'profile', 'application', 'property', 'investment', etc.
    entity_id UUID,
    
    -- Change details
    old_values JSONB, -- Previous state
    new_values JSONB, -- New state
    changes JSONB, -- Diff of changes
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    session_id VARCHAR(100),
    
    -- Additional metadata
    description TEXT,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    tags JSONB,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Documents indexes
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_access_level ON documents(access_level);
CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_documents_application ON documents(application_id);
CREATE INDEX idx_documents_investment ON documents(investment_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_filename ON documents(filename);
CREATE INDEX idx_documents_current_version ON documents(is_current_version);

-- Document access log indexes
CREATE INDEX idx_document_access_log_document ON document_access_log(document_id);
CREATE INDEX idx_document_access_log_user ON document_access_log(user_id);
CREATE INDEX idx_document_access_log_accessed_at ON document_access_log(accessed_at);
CREATE INDEX idx_document_access_log_type ON document_access_log(access_type);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_ip ON audit_logs(ip_address);

-- ==============================================
-- 5. CREATE UPDATE TRIGGERS
-- ==============================================

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 6. CREATE AUDIT TRIGGER FUNCTIONS
-- ==============================================

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id UUID,
    p_action VARCHAR,
    p_entity_type VARCHAR,
    p_entity_id UUID,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    log_id UUID;
    user_info RECORD;
BEGIN
    -- Get user information
    SELECT email, role INTO user_info
    FROM profiles 
    WHERE id = p_user_id;
    
    -- Insert audit log
    INSERT INTO audit_logs (
        user_id,
        user_email,
        user_role,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        description
    ) VALUES (
        p_user_id,
        user_info.email,
        user_info.role,
        p_action,
        p_entity_type,
        p_entity_id,
        p_old_values,
        p_new_values,
        p_description
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- ==============================================
-- 7. CREATE SAMPLE DOCUMENTS
-- ==============================================

-- Insert sample documents
DO $$
DECLARE
    admin_id UUID;
    investor_id UUID;
    property1_id UUID;
    application1_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
    SELECT id INTO investor_id FROM profiles WHERE email = 'investor@example.com' LIMIT 1;
    SELECT id INTO property1_id FROM properties WHERE name = 'Офисный центр "Московский"' LIMIT 1;
    SELECT id INTO application1_id FROM tenant_applications LIMIT 1;
    
    -- Create sample documents
    IF admin_id IS NOT NULL THEN
        INSERT INTO documents (
            filename,
            original_filename,
            file_path,
            file_size,
            mime_type,
            document_type,
            title,
            description,
            access_level,
            owner_id,
            property_id
        ) VALUES 
        (
            'office_center_financial_2024.pdf',
            'Финансовый отчет 2024.pdf',
            '/documents/properties/office_center_financial_2024.pdf',
            2048000,
            'application/pdf',
            'financial_report',
            'Финансовый отчет - Офисный центр "Московский" 2024',
            'Детальный финансовый отчет по доходности офисного центра за 2024 год',
            'investor',
            admin_id,
            property1_id
        ),
        (
            'investment_overview_q3_2024.pdf',
            'Обзор инвестиций Q3 2024.pdf',
            '/documents/reports/investment_overview_q3_2024.pdf',
            1536000,
            'application/pdf',
            'investment_report',
            'Обзор инвестиций Q3 2024',
            'Квартальный отчет по инвестиционному портфелю',
            'investor',
            admin_id,
            NULL
        );
        
        -- Create application document if application exists
        IF application1_id IS NOT NULL THEN
            INSERT INTO documents (
                filename,
                original_filename,
                file_path,
                file_size,
                mime_type,
                document_type,
                title,
                description,
                access_level,
                owner_id,
                application_id
            ) VALUES (
                'coffee_shop_presentation.pdf',
                'Презентация Кофе & Круассаны.pdf',
                '/documents/applications/coffee_shop_presentation.pdf',
                5120000,
                'application/pdf',
                'presentation',
                'Презентация бизнес-концепции "Кофе & Круассаны"',
                'Подробная презентация концепции кофейни с финансовыми прогнозами',
                'admin',
                admin_id,
                application1_id
            );
        END IF;
    END IF;
END $$;

-- ==============================================
-- 8. CREATE HELPER FUNCTIONS
-- ==============================================

-- Function to get documents for investor
CREATE OR REPLACE FUNCTION get_investor_documents(investor_email VARCHAR)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    filename VARCHAR,
    document_type VARCHAR,
    file_size BIGINT,
    property_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
AS $$
    SELECT 
        d.id,
        d.title,
        d.filename,
        d.document_type,
        d.file_size,
        p.name as property_name,
        d.created_at
    FROM documents d
    LEFT JOIN properties p ON d.property_id = p.id
    LEFT JOIN investments i ON i.property_id = p.id
    LEFT JOIN profiles pr ON i.investor_id = pr.id
    WHERE d.access_level IN ('public', 'investor')
    AND (
        d.access_level = 'public' 
        OR pr.email = investor_email
        OR d.access_level = 'investor'
    )
    AND d.deleted_at IS NULL
    AND d.is_current_version = true
    ORDER BY d.created_at DESC;
$$;

-- Function to log document access
CREATE OR REPLACE FUNCTION log_document_access(
    doc_id UUID,
    user_email VARCHAR,
    access_type VARCHAR,
    user_ip INET DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    user_id UUID;
    log_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM profiles WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User not found: %', user_email;
    END IF;
    
    -- Insert access log
    INSERT INTO document_access_log (
        document_id,
        user_id,
        access_type,
        ip_address
    ) VALUES (
        doc_id,
        user_id,
        access_type,
        user_ip
    ) RETURNING id INTO log_id;
    
    -- Update document download count if downloading
    IF access_type = 'download' THEN
        UPDATE documents 
        SET 
            download_count = download_count + 1,
            last_downloaded_at = NOW(),
            last_downloaded_by = user_id
        WHERE id = doc_id;
    END IF;
    
    RETURN log_id;
END;
$$;