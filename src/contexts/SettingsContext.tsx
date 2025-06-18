import React, { createContext, useContext, useState } from 'react';
import { Settings, SettingsContextType } from '../types';

const defaultSettings: Settings = {
  activeWallet: 'default',
  wallets: ['default'],
  hideEmptyDefaultCategory: false,
  fabPosition: 'right',
  swipeDirection: 'normal',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addWallet = (name: string) => {
    const newWallet = Date.now().toString();
    setSettings(prev => ({
      ...prev,
      wallets: [...prev.wallets, newWallet],
    }));
  };

  const removeWallet = (id: string) => {
    if (id === 'default') return; // Prevent removing default wallet
    setSettings(prev => ({
      ...prev,
      wallets: prev.wallets.filter(wallet => wallet !== id),
      activeWallet: prev.activeWallet === id ? 'default' : prev.activeWallet,
    }));
  };

  const setActiveWallet = (id: string) => {
    setSettings(prev => ({
      ...prev,
      activeWallet: id,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        addWallet,
        removeWallet,
        setActiveWallet,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 