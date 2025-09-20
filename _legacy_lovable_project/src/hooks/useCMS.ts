import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CMSData {
  kitchens: any[];
  spaces: any[];
  experiences: any[];
  tenants: any[];
  contentBlocks: any[];
}

interface CMSStats {
  totalKitchens: number;
  totalSpaces: number;
  totalExperiences: number;
  totalTenants: number;
  totalContentBlocks: number;
  activeKitchens: number;
  activeSpaces: number;
  activeExperiences: number;
  activeTenants: number;
  activeContentBlocks: number;
}

export const useCMS = () => {
  const [data, setData] = useState<CMSData>({
    kitchens: [],
    spaces: [],
    experiences: [],
    tenants: [],
    contentBlocks: [],
  });
  const [stats, setStats] = useState<CMSStats>({
    totalKitchens: 0,
    totalSpaces: 0,
    totalExperiences: 0,
    totalTenants: 0,
    totalContentBlocks: 0,
    activeKitchens: 0,
    activeSpaces: 0,
    activeExperiences: 0,
    activeTenants: 0,
    activeContentBlocks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        { data: kitchens, error: kitchensError },
        { data: spaces, error: spacesError },
        { data: experiences, error: experiencesError },
        { data: tenants, error: tenantsError },
        { data: contentBlocks, error: contentBlocksError },
      ] = await Promise.all([
        supabase.from('kitchens').select('*'),
        supabase.from('spaces').select('*'),
        supabase.from('experiences').select('*'),
        supabase.from('tenants').select('*'),
        supabase.from('content_blocks').select('*'),
      ]);

      if (
        kitchensError ||
        spacesError ||
        experiencesError ||
        tenantsError ||
        contentBlocksError
      ) {
        throw new Error('Error loading CMS data');
      }

      setData({
        kitchens: kitchens || [],
        spaces: spaces || [],
        experiences: experiences || [],
        tenants: tenants || [],
        contentBlocks: contentBlocks || [],
      });

      // Calculate stats
      setStats({
        totalKitchens: kitchens?.length || 0,
        totalSpaces: spaces?.length || 0,
        totalExperiences: experiences?.length || 0,
        totalTenants: tenants?.length || 0,
        totalContentBlocks: contentBlocks?.length || 0,
        activeKitchens: kitchens?.filter((k) => k.is_available).length || 0,
        activeSpaces: spaces?.filter((s) => s.is_available).length || 0,
        activeExperiences:
          experiences?.filter((e) => e.is_available).length || 0,
        activeTenants: tenants?.filter((t) => t.is_active).length || 0,
        activeContentBlocks:
          contentBlocks?.filter((c) => c.is_active).length || 0,
      });
    } catch (err) {
      console.error('Error loading CMS data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getContentBySection = (section: string) => {
    return data.contentBlocks
      .filter((block) => block.page_section === section && block.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  };

  const getActiveKitchens = () => {
    return data.kitchens.filter((kitchen) => kitchen.is_available);
  };

  const getActiveSpaces = () => {
    return data.spaces.filter((space) => space.is_available);
  };

  const getActiveExperiences = () => {
    return data.experiences.filter((experience) => experience.is_available);
  };

  const getActiveTenants = () => {
    return data.tenants.filter((tenant) => tenant.is_active);
  };

  const getFeaturedItems = (
    type: 'kitchens' | 'spaces' | 'experiences' | 'tenants'
  ) => {
    return data[type].filter((item) => item.is_featured);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return {
    data,
    stats,
    loading,
    error,
    loadAllData,
    getContentBySection,
    getActiveKitchens,
    getActiveSpaces,
    getActiveExperiences,
    getActiveTenants,
    getFeaturedItems,
  };
};

export default useCMS;
