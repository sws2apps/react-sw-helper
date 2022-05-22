import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper/ServiceWorkerWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ServiceWorkerWrapper>
			<App />
		</ServiceWorkerWrapper>
	</React.StrictMode>
);
