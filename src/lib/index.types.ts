import { PropsWithChildren } from 'react';

type ServiceWorkerWrapperProps = {
  onError?: (error: Error) => void;
  onInstalled?: () => void;
  onUpdated?: () => void;
  onWaiting?: () => void;
  publicServiceWorkerDest: string;
  publicUrl?: string;
};

export type ServiceWorkerWrapperType =
  PropsWithChildren<ServiceWorkerWrapperProps>;
