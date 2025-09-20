import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentBlock {
  id: string;
  title: string;
  content: string;
  content_type: string;
  page_section: string;
  display_order: number;
  is_active: boolean;
  metadata: any;
}

interface DynamicContentProps {
  section: string;
  fallback?: React.ReactNode;
  className?: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({
  section,
  fallback = null,
  className = '',
}) => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContentBlocks();
  }, [section]);

  const loadContentBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_section', section)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading content blocks:', error);
        setContentBlocks([]);
        return;
      }

      setContentBlocks(data || []);
    } catch (error) {
      console.error('Error loading content blocks:', error);
      setContentBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (block: ContentBlock) => {
    switch (block.content_type) {
      case 'text':
        return (
          <div
            key={block.id}
            className={`dynamic-content-text ${className}`}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );

      case 'html':
        return (
          <div
            key={block.id}
            className={`dynamic-content-html ${className}`}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );

      case 'image':
        return (
          <div key={block.id} className={`dynamic-content-image ${className}`}>
            <img
              src={block.content}
              alt={block.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        );

      case 'link':
        return (
          <div key={block.id} className={`dynamic-content-link ${className}`}>
            <a
              href={block.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {block.metadata?.linkText || block.title}
            </a>
          </div>
        );

      case 'video':
        return (
          <div key={block.id} className={`dynamic-content-video ${className}`}>
            <div className="aspect-video w-full">
              <iframe
                src={block.content}
                title={block.metadata?.videoTitle || block.title}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          </div>
        );

      default:
        return (
          <div
            key={block.id}
            className={`dynamic-content-default ${className}`}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>;
  }

  if (contentBlocks.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className="dynamic-content-container">
      {contentBlocks.map(renderContent)}
    </div>
  );
};

export default DynamicContent;
