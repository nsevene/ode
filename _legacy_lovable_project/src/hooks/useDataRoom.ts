import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DataRoomSection {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  href: string;
  status: 'restricted' | 'admin-only' | 'available';
  files: number;
  lastUpdated: string; // Assuming ISO string format
  features: string[];
}

export interface RecentFile {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string; // Assuming ISO string format
  status: 'new' | 'updated';
}

export const useDataRoom = () => {
  const [sections, setSections] = useState<DataRoomSection[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDataRoomData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        { data: sectionsData, error: sectionsError },
        { data: filesData, error: filesError },
      ] = await Promise.all([
        supabase.from('data_room_sections').select('*'),
        supabase.from('data_room_files').select('*').order('updated', { ascending: false }).limit(4),
      ]);

      if (sectionsError) throw sectionsError;
      if (filesError) throw filesError;

      setSections(sectionsData || []);
      setRecentFiles(filesData || []);

    } catch (err: any) {
      console.error('Error loading Data Room data:', err);
      setError(err.message || 'Failed to fetch Data Room data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataRoomData();
  }, [loadDataRoomData]);

  return { sections, recentFiles, loading, error, refreshData: loadDataRoomData };
};
