import { useEffect } from 'react';

export const HTTPSRedirect: React.FC = () => {
  useEffect(() => {
    // Only redirect to HTTPS in production
    if (import.meta.env.PROD && window.location.protocol === 'http:') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

  return null;
};
