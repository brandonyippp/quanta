import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [usageTracking, setUsageTracking] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <List.Section>
          <List.Subheader>General</List.Subheader>
          <List.Item
            title="Notifications"
            description="Receive alerts when time limits are reached"
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark theme"
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Data & Privacy</List.Subheader>
          <List.Item
            title="Usage Tracking"
            description="Track app usage and screen time"
            right={() => (
              <Switch
                value={usageTracking}
                onValueChange={setUsageTracking}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Auto Sync"
            description="Automatically sync data across devices"
            right={() => (
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Profile"
            description="View and edit your profile"
            onPress={() => {}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Workspace Settings"
            description="Manage workspace configurations"
            onPress={() => {}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.button}
          >
            Export Data
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.button}
          >
            Clear All Data
          </Button>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 8,
  },
  version: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
});

export default SettingsScreen; 