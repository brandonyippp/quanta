import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from './types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WalletSelectionModal from '../components/WalletSelectionModal';
import CustomTabBarButton from '../components/CustomTabBarButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../contexts/SettingsContext';
import { useNavigation } from '@react-navigation/native';

// Import screens
import PersonalScreen from '../screens/PersonalScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddAppScreen from '../screens/AddAppScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

type WalletStackParamList = {
  WalletMain: undefined;
  AddApp: undefined;
};

type RootStackParamList = {
  Main: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const WalletStack = createNativeStackNavigator<WalletStackParamList>();

const WalletStackNavigator = () => {
  const navigation = useNavigation<NativeStackNavigationProp<WalletStackParamList>>();
  
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen 
        name="WalletMain" 
        component={PersonalScreen}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen 
        name="AddApp" 
        component={AddAppScreen}
        options={{ 
          headerShown: true,
          title: 'Add New App',
          headerLeft: () => (
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              onPress={() => navigation.navigate('WalletMain')}
              style={{ marginLeft: 16 }}
            />
          ),
        }}
      />
    </WalletStack.Navigator>
  );
};

const MainTabs = () => {
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [wallets] = useState([
    { id: '1', name: 'Personal' },
    { id: '2', name: 'Work' },
    { id: '3', name: 'Volunteer' },
  ]);
  const [initialRouteName, setInitialRouteName] = useState<keyof MainTabParamList>('Wallet');
  const { settings } = useSettings();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (!hasLaunched) {
          // First launch - set Wallet as default
          setInitialRouteName('Wallet');
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          // Not first launch - get last selected tab
          const lastTab = await AsyncStorage.getItem('lastSelectedTab');
          if (lastTab && (lastTab === 'Wallet' || lastTab === 'Insights' || lastTab === 'Settings')) {
            setInitialRouteName(lastTab as keyof MainTabParamList);
          }
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setInitialRouteName('Wallet');
      }
    };

    checkFirstLaunch();
  }, []);

  const handleWalletPress = () => {
    setWalletModalVisible(true);
  };

  const handleWalletSelect = (wallet: { id: string; name: string }) => {
    // TODO: Handle wallet selection
    setWalletModalVisible(false);
  };

  const handleAddWallet = () => {
    // TODO: Handle adding new wallet
    setWalletModalVisible(false);
  };

  const handleTabPress = async (tabName: keyof MainTabParamList) => {
    try {
      await AsyncStorage.setItem('lastSelectedTab', tabName);
    } catch (error) {
      console.error('Error saving last selected tab:', error);
    }
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            display: 'flex',
          },
        }}
      >
        <Tab.Screen 
          name="Insights" 
          component={StatsScreen}
          options={{ headerShown: false }}
          listeners={{
            tabPress: () => handleTabPress('Insights'),
          }}
        />
        <Tab.Screen 
          name="Wallet" 
          component={WalletStackNavigator}
          options={{ 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="wallet" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ headerShown: false }}
          listeners={{
            tabPress: () => handleTabPress('Settings'),
          }}
        />
      </Tab.Navigator>

      <WalletSelectionModal
        visible={walletModalVisible}
        onDismiss={() => setWalletModalVisible(false)}
        wallets={wallets}
        onSelectWallet={handleWalletSelect}
        onAddWallet={handleAddWallet}
      />
    </>
  );
};

const AppNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen 
        name="Main" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};

export default AppNavigator; 