import React from 'react';
import { AuthProvider } from './auth';
import { DesignProvider } from './designs';

// Re-export everything from our Firebase modules
export * from './config';
export * from './auth';
export * from './db';
export * from './designs';

// Export the combined providers component
export function FirebaseProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DesignProvider>
        {children}
      </DesignProvider>
    </AuthProvider>
  );
}
