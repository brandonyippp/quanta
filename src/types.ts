export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'annually';

export interface TimeLimit {
  daily?: number;
  weekly?: number;
  monthly?: number;
}

export interface AppCard {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  timeUsed: number;
  timeLimit: TimeLimit;
  wallet: string;
}

export interface Category {
  id: string;
  name: string;
  cards: string[];
}

export interface Settings {
  activeWallet: string;
  wallets: string[];
  hideEmptyDefaultCategory: boolean;
  fabPosition: 'left' | 'right';
  swipeDirection: 'normal' | 'inverted';
}

export interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  addWallet: (name: string) => void;
  removeWallet: (id: string) => void;
  setActiveWallet: (id: string) => void;
}

export type MainTabParamList = {
  Cards: undefined;
  Categories: undefined;
  Settings: undefined;
}; 