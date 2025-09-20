import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TenantBranding {
  brand_primary_color: string;
  brand_secondary_color: string;
  brand_font_family: string;
  logo_url?: string;
}

interface TenantBrandingProps {
  tenantId?: string;
  children: React.ReactNode;
}

const TenantBranding: React.FC<TenantBrandingProps> = ({
  tenantId,
  children,
}) => {
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      loadTenantBranding(tenantId);
    } else {
      // Load default branding or from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const tenant = urlParams.get('tenant');
      if (tenant) {
        loadTenantBranding(tenant);
      } else {
        setLoading(false);
      }
    }
  }, [tenantId]);

  const loadTenantBranding = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select(
          'brand_primary_color, brand_secondary_color, brand_font_family, logo_url'
        )
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error loading tenant branding:', error);
        setLoading(false);
        return;
      }

      setBranding(data);
    } catch (error) {
      console.error('Error loading tenant branding:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branding) {
      applyBranding(branding);
    }
  }, [branding]);

  const applyBranding = (branding: TenantBranding) => {
    const root = document.documentElement;

    // Apply primary color
    if (branding.brand_primary_color) {
      root.style.setProperty('--primary', branding.brand_primary_color);
      root.style.setProperty(
        '--primary-foreground',
        getContrastColor(branding.brand_primary_color)
      );
    }

    // Apply secondary color
    if (branding.brand_secondary_color) {
      root.style.setProperty('--secondary', branding.brand_secondary_color);
      root.style.setProperty(
        '--secondary-foreground',
        getContrastColor(branding.brand_secondary_color)
      );
    }

    // Apply font family
    if (branding.brand_font_family) {
      root.style.setProperty('--font-family', branding.brand_font_family);
      document.body.style.fontFamily = branding.brand_font_family;
    }

    // Apply logo if available
    if (branding.logo_url) {
      const logoElement = document.querySelector(
        '[data-tenant-logo]'
      ) as HTMLImageElement;
      if (logoElement) {
        logoElement.src = branding.logo_url;
        logoElement.style.display = 'block';
      }
    }
  };

  const getContrastColor = (hexColor: string): string => {
    // Remove # if present
    const color = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  if (loading) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default TenantBranding;
