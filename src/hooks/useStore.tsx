import React, { useContext, createContext } from 'react';
import { IRootStore, getStore } from '../models/CouponModel';

// Tạo context để truyền store xuống component tree
const StoreContext = createContext<IRootStore | undefined>(undefined);

// Provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = getStore();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};

// Hook để sử dụng store
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
} 