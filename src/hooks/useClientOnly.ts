'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if component has hydrated on client-side
 * This prevents hydration mismatch issues with SSR
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
