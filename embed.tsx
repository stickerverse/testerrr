import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { FirebaseProviders } from './firebase/index';

// Store references to root instances for cleanup
const rootInstances = new Map<string, ReactDOM.Root>();

// Function to initialize the sticker editor
function initStickerEditor(elementId: string, config = {}) {
  console.log('StickerEditor: Initializing editor in element', elementId, 'with config', config);
  
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element with ID "${elementId}" not found`);
    return;
  }

  // Clean up any existing instance
  if (rootInstances.has(elementId)) {
    rootInstances.get(elementId)?.unmount();
  }

  // Create a new root
  const root = ReactDOM.createRoot(container);
  rootInstances.set(elementId, root);
  
  root.render(
    <React.StrictMode>
      <FirebaseProviders>
        <App {...config} />
      </FirebaseProviders>
    </React.StrictMode>
  );

  console.log('StickerEditor: Successfully initialized editor in', elementId);

  return {
    unmount: () => {
      if (rootInstances.has(elementId)) {
        rootInstances.get(elementId)?.unmount();
        rootInstances.delete(elementId);
      }
    }
  };
}

// Auto-initialize if the script has data-container attribute
document.addEventListener('DOMContentLoaded', () => {
  const scripts = document.querySelectorAll('script[data-container]');
  scripts.forEach(script => {
    const containerId = script.getAttribute('data-container');
    if (containerId) {
      // Try to parse config from data-config attribute
      let config = {};
      const configAttr = script.getAttribute('data-config');
      if (configAttr) {
        try {
          config = JSON.parse(configAttr);
        } catch (e) {
          console.error('Failed to parse config:', e);
        }
      }
      
      initStickerEditor(containerId, config);
    }
  });
});

// Export for manual initialization
export { initStickerEditor };

// Also attach to window for non-module usage
if (typeof window !== 'undefined') {
  console.log('StickerEditor: Attaching to window object');
  (window as any).StickerEditor = {
    init: initStickerEditor
  };
  console.log('StickerEditor: Successfully attached to window object');
}
