# React Service Worker Helper

A pure react component for managing service worker life cycle. This project is inspired by the project [@medipass/react-service-worker](https://github.com/medipass/react-service-worker) published by @medipass. Tailored to our needs, and hopefully for you too, here are the differences from the original one:

- we have updated the code to use the functional component of react.
- the service worker is register by default if you are building the reactjs app for production.
- we have disabled the option to unregister the service worker.

## Installation

```
npm i @sws2apps/react-sw-helper
```

## Usage

### Basic implementation

Import the `<ServiceWorkerWrapper>` component and wrap it around your application.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <ServiceWorkerWrapper>
        <App />
     </ServiceWorkerWrapper>
  </React.StrictMode>
);
```

### Advanced implementation

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ServiceWorkerWrapper from '@sws2apps/react-sw-helper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ServiceWorkerWrapper
       onError={(err) => console.log(`An error occured: ${err}`)}
       onInstalled={() => console.log('Service worker installed')}
       onUpdated={() => console.log('Service worker updated')}
       onWaiting={() => console.log('Service worker waiting')}
       publicServiceWorkerDest='/service-worker.js'
    >
       {({ update }) => <App updatePwa={update} />}
    </ServiceWorkerWrapper>
  </React.StrictMode>
);
```

## `<ServiceWorkerWrapper>` props

### publicServiceWorkerDest

> `string`

The destination of where your service worker is located.

Example usage:

`<ServiceWorkerWrapper publicServiceWorkerDest="/service-worker.js" />`

### publicUrl

> `string` | Optional

The public URL of your application. Defaults to the root origin.

Example usage:

`<ServiceWorkerWrapper publicUrl="https://example.com/app" />`

### onError

> `function(error: Error)` | Optional

Invoked when an error occurs during service worker registration.

Example usage:

`` <ServiceWorkerWrapper onError={err => console.log(`An error occured! Error: ${err}`)} /> ``

### onInstalled

> `function()` | Optional

Invoked when the service worker is installed.

Example usage:

`<ServiceWorkerWrapper onInstalled={() => console.log('Service worker successfully installed.')} />`

### onUpdated

> `function()` | Optional

Invoked when the service worker is updated.

Example usage:

`<ServiceWorkerWrapper onUpdated={() => console.log('Service worker successfully updated.')} />`

### onWaiting

> `function()` | Optional

Invoked when the service worker is already installed but waiting to be activated.

Example usage:

`<ServiceWorkerWrapper onWaiting={() => console.log('Service worker already installed but waiting to be activated.')} />`

### `children` Render Props

#### update

> `function()`

When invoked, `update` will update the service worker.
