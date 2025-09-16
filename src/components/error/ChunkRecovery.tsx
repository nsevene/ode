import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Minimal global handler to recover from stale chunk errors on clients with cached SW
// - Detects ChunkLoadError / dynamic import failures
// - Unregisters service workers, clears Cache Storage, then reloads once
// - Uses a session flag to avoid infinite reload loops
const ChunkRecovery = () => {
  const attemptedRef = useRef(false);

  useEffect(() => {
    const alreadyRecovered = sessionStorage.getItem('chunk-recovery-done') === '1';

    const shouldHandle = (message?: string, name?: string) => {
      const m = (message || '').toLowerCase();
      const n = (name || '').toLowerCase();
      return (
        n.includes('chunkloaderror') ||
        m.includes('loading chunk') ||
        m.includes('chunk load') ||
        m.includes('failed to fetch dynamically imported module') ||
        m.includes('import() failed')
      );
    };

    const clearCachesAndReload = async () => {
      if (attemptedRef.current || alreadyRecovered) return;
      attemptedRef.current = true;
      sessionStorage.setItem('chunk-recovery-done', '1');

      try {
        // Unregister all service workers
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }

        // Clear Cache Storage
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch (e) {
        console.warn('ChunkRecovery cleanup warning:', e);
      } finally {
        // Inform the user and reload
        try {
          toast.error('Произошла ошибка загрузки. Обновляем страницу…');
        } catch {}
        window.location.reload();
      }
    };

    const onError = (event: ErrorEvent) => {
      if (shouldHandle(event.message, (event.error && (event.error as any).name) || undefined)) {
        // Log full details for diagnostics before preventing default
        try {
          // eslint-disable-next-line no-console
          console.error('ChunkRecovery onError:', {
            message: event.message,
            name: (event.error && (event.error as any).name) || undefined,
            stack: (event.error && (event.error as any).stack) || undefined,
          });
        } catch {}
        event.preventDefault?.();
        clearCachesAndReload();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = (event.reason && String(event.reason)) || '';
      const name = (event.reason && (event.reason.name || '')) as string;
      if (shouldHandle(reason, name)) {
        try {
          // eslint-disable-next-line no-console
          console.error('ChunkRecovery onRejection:', { reason, name, reasonObj: event.reason });
        } catch {}
        event.preventDefault?.();
        clearCachesAndReload();
      }
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
};

export default ChunkRecovery;
