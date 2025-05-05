import { ReactNode } from 'react';

export type ServiceWorkerWrapperType = {
  children?: ((args: { update?: () => void }) => ReactNode) | ReactNode;
  onError?: (error: Error) => void;
  onInstalled?: () => void;
  onUpdated?: () => void;
  onWaiting?: () => void;
  publicServiceWorkerDest: string;
  publicUrl?: string;
};
