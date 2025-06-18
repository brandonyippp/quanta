import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { CategoriesProvider } from './src/contexts/CategoriesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <SettingsProvider>
        <CategoriesProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </CategoriesProvider>
      </SettingsProvider>
    </PaperProvider>
  );
}