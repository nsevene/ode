import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InvestorSection {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  href: string;
  features: string[];
}

export interface DataRoomSection {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    href: string;
}

export const useInvestorsPortal = () => {
  const [investorSections, setInvestorSections] = useState<InvestorSection[]>([]);
  const [dataRoomSections, setDataRoomSections] = useState<DataRoomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: investorData, error: investorError },
        { data: dataRoomData, error: dataRoomError },
      ] = await Promise.all([
        supabase.from('investor_portal_sections').select('*'),
        supabase.from('data_room_sections').select('*'),
      ]);

      if (investorError) throw investorError;
      if (dataRoomError) throw dataRoomError;

      setInvestorSections(investorData || []);
      setDataRoomSections(dataRoomData || []);

    } catch (err: any) {
      console.error('Error loading investor portal data:', err);
      setError(err.message || 'Failed to fetch portal data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortalData();
  }, [loadPortalData]);

  return { investorSections, dataRoomSections, loading, error, refreshData: loadPortalData };
};
