-- Create tenant_applications table
CREATE TABLE IF NOT EXISTS tenant_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
    full_name TEXT NOT NULL,
    brand_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    concept_description TEXT,
    presentation_url TEXT,
    notes TEXT
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_tenant_applications_email ON tenant_applications(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_tenant_applications_status ON tenant_applications(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tenant_applications_created_at ON tenant_applications(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tenant_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (anyone can insert applications)
CREATE POLICY "Allow public to insert tenant applications" ON tenant_applications
    FOR INSERT WITH CHECK (true);

-- Create policy for authenticated users to read applications (for admin panel)
CREATE POLICY "Allow authenticated users to read tenant applications" ON tenant_applications
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to update applications (for admin panel)
CREATE POLICY "Allow authenticated users to update tenant applications" ON tenant_applications
    FOR UPDATE USING (auth.role() = 'authenticated');
