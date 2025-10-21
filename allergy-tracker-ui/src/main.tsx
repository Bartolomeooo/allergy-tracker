import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';

async function enableMocksIfNeeded() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS) {
    const {worker} = await import('./mocks/browser');
    await worker.start({
      serviceWorker: {url: '/mockServiceWorker.js'},
      onUnhandledRequest: 'bypass',
    });
    console.info('Mock Service Worker uruchomiony');
  }
}

function renderRoot() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void enableMocksIfNeeded()
  .catch((err) => {
    console.error('MSW failed to start:', err);
  })
  .finally(renderRoot);
