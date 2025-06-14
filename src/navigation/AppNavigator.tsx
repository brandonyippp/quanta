import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from './types';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import PersonalScreen from '../screens/PersonalScreen';
import WorkspaceScreen from '../screens/WorkspaceScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Personal':
              iconName = 'person';
              break;
            case 'Workspace':
              iconName = 'work';
              break;
            case 'Stats':
              iconName = 'bar-chart';
              break;
            default:
              iconName = 'help';
          }

        //   return <MaterialIcons name={iconName as string} size={size} color={color} />;
          return <MaterialIcons size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Personal" component={PersonalScreen} />
      <Tab.Screen name="Workspace" component={WorkspaceScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 