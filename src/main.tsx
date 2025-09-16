
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/i18n";  // Initialize i18n
import usePWA from './hooks/usePWA';

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA: Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('PWA: Service Worker registration failed:', error);
      });
  });
}

// Initialize PWA features
const PWAWrapper: React.FC = () => {
  usePWA();
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PWAWrapper />
  </StrictMode>
);
