import { useCallback, useEffect, useState } from 'react';
import { ServiceWorkerWrapperType } from './index.types';

const isLocalhost = Boolean(
	window?.location.hostname === 'localhost' ||
		window?.location.hostname === '[::1]' ||
		window?.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
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
	const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

	const serviceWorkerUrl = `${publicUrl}${publicServiceWorkerDest}`;

	const registerValidServiceWorker = useCallback(async () => {
		try {
			let registration = await navigator.serviceWorker.getRegistration();
			if (!registration) {
				registration = await navigator.serviceWorker.register(serviceWorkerUrl);
			}

			// check if there are any awaiting sw
			const waitingWorker = registration.waiting;
			if (waitingWorker && waitingWorker.state === 'installed') {
				onWaiting && onWaiting();
			}

			setRegistration(registration);

			registration.addEventListener('updatefound', () => {
				const installingWorker = registration.installing;

				if (installingWorker) {
					installingWorker.onstatechange = () => {
						if (installingWorker.state === 'installed') {
							if (navigator.serviceWorker.controller) {
								onUpdated && onUpdated();
							}
							onInstalled && onInstalled();
						}
					};
				}

				const waitingWorker = registration.waiting;
				if (waitingWorker) {
					waitingWorker.onstatechange = () => {
						if (waitingWorker.state === 'installed') {
							if (navigator.serviceWorker.controller) {
								onUpdated && onUpdated();
							}
							onInstalled && onInstalled();
						}
					};
				}
			});
		} catch (err) {
			console.error('Error during service worker registration:', err);
			onError && onError(err as Error);
		}
	}, [serviceWorkerUrl, onError, onWaiting, onInstalled, onUpdated]);

	const checkValidServiceWorker = useCallback(async () => {
		try {
			const response = await fetch(serviceWorkerUrl);
			// Ensure service worker exists, and that we really are getting a JS file.
			if (response.status === 404 || response.headers.get('content-type')!.indexOf('javascript') === -1) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then(async (registration) => {
					await registration.unregister();
					window.location.reload();
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidServiceWorker();
			}
		} catch (err) {
			console.log('No internet connection found. App is running in offline mode.');
		}
	}, [registerValidServiceWorker, serviceWorkerUrl]);

	const register = useCallback(async () => {
		if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
			// The URL constructor is available in all browsers that support SW.
			const pUrl = new URL(publicUrl);

			if (pUrl.origin !== window.location.origin) {
				// Our service worker won't work if PUBLIC_URL is on a different origin
				// from what our page is served on. This might happen if a CDN is used to
				// serve assets
				return;
			}

			if (isLocalhost) {
				// This is running on localhost. Lets check if a service worker still exists or not.
				checkValidServiceWorker();
				// Add some additional logging to localhost, pointing developers to the
				// service worker/PWA documentation.
				navigator.serviceWorker.ready.then(() => {
					console.log(
						'This web app is being served cache-first by a service ' + 'worker. To learn more, visit https://goo.gl/SC7cgQ'
					);
				});
			} else {
				// Is not local host. Just register service worker
				registerValidServiceWorker();
			}
		}
	}, [checkValidServiceWorker, publicUrl, registerValidServiceWorker]);

	const update = useCallback(() => {
		if (registration) {
			registration.update();
			registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
		}
	}, [registration]);

	useEffect(() => {
		if (process.env['NODE_ENV'] === 'production') {
			register();
		}
	}, [register]);

	return typeof children === 'function' ? children({ update: update }) : children;
};

export default ServiceWorkerWrapper;
