import React, { useContext, useState, useEffect } from 'react';
import { IRootStore, getStore, getStoreAsync } from '../models/RootStore';

// Create context
const StoreContext = React.createContext<IRootStore | null>(null);

// Async Store Provider component
export const AsyncStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<IRootStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initStore = async () => {
      try {
        const initializedStore = await getStoreAsync();
        setStore(initializedStore);
      } catch (error) {
        console.error('Failed to initialize store from cache:', error);
        // Fallback to synchronous initialization if async fails
        setStore(getStore());
      } finally {
        setIsLoading(false);
      }
    };

    initStore();
  }, []);

  if (isLoading) {
    // Optional: Return a loading indicator here
    return null;
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};


// Hook to use the store
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
}; 