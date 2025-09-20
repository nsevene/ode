-- Phase 2 Storage Setup: File Storage Configuration for PostgreSQL
-- Date: 2025-09-20
-- Purpose: Configure file storage metadata and permissions

-- ==============================================
-- 1. CREATE STORAGE BUCKETS TABLE
-- ==============================================

-- Table to manage file storage buckets (folders)
CREATE TABLE IF NOT EXISTS storage_buckets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Access control
    public_access BOOLEAN DEFAULT false,
    allowed_mime_types JSONB, -- Array of allowed MIME types
    max_file_size_bytes BIGINT DEFAULT 10485760, -- 10MB default
    
    -- Storage path configuration
    storage_path VARCHAR(200) NOT NULL, -- Relative path from public/uploads/
    
    -- Policies
    require_authentication BOOLEAN DEFAULT true,
    allowed_roles JSONB, -- Array of roles that can access this bucket
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. CREATE FILE UPLOAD PERMISSIONS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS file_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- File reference
    file_path VARCHAR(500) NOT NULL,
    bucket_name VARCHAR(100) NOT NULL REFERENCES storage_buckets(name),
    
    -- User permissions
    user_id UUID REFERENCES profiles(id),
    user_role user_role,
    
    -- Permission types
    can_read BOOLEAN DEFAULT false,
    can_write BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_share BOOLEAN DEFAULT false,
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES profiles(id)
);

-- ==============================================
-- 3. CREATE INDEXES
-- ==============================================

CREATE INDEX idx_storage_buckets_name ON storage_buckets(name);
CREATE INDEX idx_file_permissions_file_path ON file_permissions(file_path);
CREATE INDEX idx_file_permissions_user_id ON file_permissions(user_id);
CREATE INDEX idx_file_permissions_bucket ON file_permissions(bucket_name);

-- ==============================================
-- 4. CREATE UPDATE TRIGGERS
-- ==============================================

CREATE TRIGGER update_storage_buckets_updated_at
    BEFORE UPDATE ON storage_buckets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 5. CREATE DEFAULT STORAGE BUCKETS
-- ==============================================

INSERT INTO storage_buckets (
    name,
    description,
    public_access,
    allowed_mime_types,
    max_file_size_bytes,
    storage_path,
    require_authentication,
    allowed_roles
) VALUES 
(
    'documents',
    'General document storage for all file types',
    false,
    '["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]',
    52428800, -- 50MB
    'documents/',
    true,
    '["admin", "investor", "tenant"]'
),
(
    'presentations',
    'Presentation files from tenant applications',
    false,
    '["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]',
    104857600, -- 100MB
    'presentations/',
    true,
    '["admin"]'
),
(
    'reports',
    'Financial and investment reports',
    false,
    '["application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]',
    26214400, -- 25MB
    'reports/',
    true,
    '["admin", "investor"]'
),
(
    'images',
    'Property images and photos',
    true,
    '["image/jpeg", "image/png", "image/webp", "image/gif"]',
    10485760, -- 10MB
    'images/',
    false,
    '["admin", "investor", "tenant", "public"]'
),
(
    'applications',
    'Files attached to tenant applications',
    false,
    '["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"]',
    52428800, -- 50MB
    'applications/',
    true,
    '["admin"]'
),
(
    'properties',
    'Property-related documents and floor plans',
    false,
    '["application/pdf", "image/jpeg", "image/png", "application/vnd.ms-excel"]',
    26214400, -- 25MB
    'properties/',
    true,
    '["admin", "investor"]'
),
(
    'investments', 
    'Investment-related documents and contracts',
    false,
    '["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]',
    52428800, -- 50MB
    'investments/',
    true,
    '["admin", "investor"]'
) ON CONFLICT (name) DO NOTHING;

-- ==============================================
-- 6. CREATE STORAGE HELPER FUNCTIONS
-- ==============================================

-- Function to check if user can access bucket
CREATE OR REPLACE FUNCTION can_access_bucket(
    bucket_name VARCHAR,
    user_email VARCHAR,
    access_type VARCHAR DEFAULT 'read'
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    user_info RECORD;
    bucket_info RECORD;
BEGIN
    -- Get user information
    SELECT role INTO user_info FROM profiles WHERE email = user_email;
    
    -- Get bucket information
    SELECT * INTO bucket_info FROM storage_buckets WHERE name = bucket_name;
    
    IF bucket_info IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if bucket is public and access is read-only
    IF bucket_info.public_access = true AND access_type = 'read' THEN
        RETURN true;
    END IF;
    
    -- Check if user role is allowed
    IF user_info.role::text = ANY(SELECT jsonb_array_elements_text(bucket_info.allowed_roles)) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$;

-- Function to generate file path
CREATE OR REPLACE FUNCTION generate_file_path(
    bucket_name VARCHAR,
    original_filename VARCHAR,
    user_email VARCHAR DEFAULT NULL
)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
    bucket_path VARCHAR;
    file_extension VARCHAR;
    new_filename VARCHAR;
    timestamp_str VARCHAR;
BEGIN
    -- Get bucket storage path
    SELECT storage_path INTO bucket_path FROM storage_buckets WHERE name = bucket_name;
    
    IF bucket_path IS NULL THEN
        RAISE EXCEPTION 'Bucket not found: %', bucket_name;
    END IF;
    
    -- Extract file extension
    file_extension := substring(original_filename from '\.([^.]*)$');
    
    -- Generate timestamp
    timestamp_str := to_char(NOW(), 'YYYYMMDD_HH24MISS');
    
    -- Generate new filename with UUID
    new_filename := concat(
        substring(md5(random()::text) from 1 for 8),
        '_',
        timestamp_str,
        '.',
        file_extension
    );
    
    RETURN concat(bucket_path, new_filename);
END;
$$;

-- Function to validate file upload
CREATE OR REPLACE FUNCTION validate_file_upload(
    bucket_name VARCHAR,
    filename VARCHAR,
    file_size BIGINT,
    mime_type VARCHAR,
    user_email VARCHAR
)
RETURNS TABLE(
    valid BOOLEAN,
    error_message TEXT,
    file_path VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    bucket_info RECORD;
    generated_path VARCHAR;
BEGIN
    -- Get bucket configuration
    SELECT * INTO bucket_info FROM storage_buckets WHERE name = bucket_name;
    
    IF bucket_info IS NULL THEN
        RETURN QUERY SELECT false, 'Bucket not found', NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Check file size
    IF file_size > bucket_info.max_file_size_bytes THEN
        RETURN QUERY SELECT false, 'File size exceeds limit', NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Check MIME type
    IF NOT (mime_type = ANY(SELECT jsonb_array_elements_text(bucket_info.allowed_mime_types))) THEN
        RETURN QUERY SELECT false, 'File type not allowed', NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Check user access
    IF NOT can_access_bucket(bucket_name, user_email, 'write') THEN
        RETURN QUERY SELECT false, 'Access denied', NULL::VARCHAR;
        RETURN;
    END IF;
    
    -- Generate file path
    generated_path := generate_file_path(bucket_name, filename, user_email);
    
    RETURN QUERY SELECT true, 'Valid'::TEXT, generated_path;
END;
$$;

-- ==============================================
-- 7. CREATE SAMPLE STORAGE CONFIGURATION
-- ==============================================

-- Log storage setup completion
DO $$
BEGIN
    PERFORM create_audit_log(
        (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
        'system_setup',
        'storage',
        NULL,
        NULL,
        jsonb_build_object('buckets_created', 7),
        'Storage buckets configured successfully'
    );
END $$;