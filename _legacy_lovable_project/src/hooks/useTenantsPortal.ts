import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Assuming you have these types defined somewhere, otherwise define them here.
// You might need to adjust them based on your actual table structure.

export interface TenantSection {
  id: string;
  title: string;
  description: string;
  icon_name: string; // Storing icon name to map to component
  href: string;
  features: string[];
}

export interface TenantBenefit {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  benefit: string;
}

export const useTenantsPortal = () => {
  const [sections, setSections] = useState<TenantSection[]>([]);
  const [benefits, setBenefits] = useState<TenantBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: sectionsData, error: sectionsError },
        { data: benefitsData, error: benefitsError },
      ] = await Promise.all([
        supabase.from('tenant_portal_sections').select('*'),
        supabase.from('tenant_portal_benefits').select('*'),
      ]);

      if (sectionsError) throw sectionsError;
      if (benefitsError) throw benefitsError;

      setSections(sectionsData || []);
      setBenefits(benefitsData || []);

    } catch (err: any) {
      console.error('Error loading tenant portal data:', err);
      setError(err.message || 'Failed to fetch portal data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  return { sections, benefits, loading, error, refreshData: loadPortalData };
};
