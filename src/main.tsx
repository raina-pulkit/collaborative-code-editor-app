import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ErrorProvider } from './context/error-context';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </BrowserRouter>
  </StrictMode>,
);
