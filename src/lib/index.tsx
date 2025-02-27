import { useCallback, useEffect, useState } from 'react';
import { ServiceWorkerWrapperType } from './index.types';

const isLocalhost = Boolean(
  window?.location.hostname === 'localhost' ||
    window?.location.hostname === '[::1]' ||
    window?.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const ServiceWorkerWrapper = ({
  children,
  onError,
  onInstalled,
  onUpdated,
  onWaiting,
  publicServiceWorkerDest,
  publicUrl = '',
}: ServiceWorkerWrapperType) => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const registerServiceWorker = useCallback(async () => {
    try {
      const registration =
        (await navigator.serviceWorker.getRegistration()) ||
        (await navigator.serviceWorker.register(
          `${publicUrl}${publicServiceWorkerDest}`
        ));

      setRegistration(registration);

      if (registration?.waiting) {
        console.log('Service Worker is in waiting state.');
        onUpdated?.();
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing || registration.waiting;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              onUpdated?.();
            } else {
              onInstalled?.();
            }
          }
        });
      });
    } catch (err) {
      console.error('Error during service worker registration:', err);
      onError?.(err as Error);
    }
  }, [
    publicUrl,
    publicServiceWorkerDest,
    onError,
    onWaiting,
    onInstalled,
    onUpdated,
  ]);

  const checkServiceWorker = useCallback(async () => {
    try {
      const response = await fetch(`${publicUrl}${publicServiceWorkerDest}`);
      if (
        response.status === 404 ||
        !response.headers.get('content-type')?.includes('javascript')
      ) {
        const registration = await navigator.serviceWorker.ready;
        await registration.unregister();
        window.location.reload();
      } else {
        registerServiceWorker();
      }
    } catch (err) {
      console.log(
        'No internet connection found. App is running in offline mode.',
        err
      );
    }
  }, [publicUrl, publicServiceWorkerDest, registerServiceWorker]);

  const register = useCallback(() => {
    if ('serviceWorker' in navigator) {
      if (
        new URL(publicUrl, window.location.href).origin !==
        window.location.origin
      ) {
        console.warn(
          'Service worker cannot be registered because PUBLIC_URL is on a different origin from page.'
        );
        return;
      }

      if (isLocalhost) {
        checkServiceWorker();
      } else {
        registerServiceWorker();
      }
    }
  }, [publicUrl, checkServiceWorker, registerServiceWorker]);

  const update = useCallback(() => {
    if (registration) {
      registration.update();

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  }, [registration]);

  useEffect(() => {
    if (process.env['NODE_ENV'] === 'production') {
      register();
    }
  }, [register]);

  return typeof children === 'function'
    ? children({ update: update })
    : children;
};

export default ServiceWorkerWrapper;
