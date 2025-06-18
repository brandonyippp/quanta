import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Button, Divider, Portal, Modal, TextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../contexts/SettingsContext';

const SettingsScreen = () => {
  const { settings, updateSettings, addWallet, removeWallet, setActiveWallet } = useSettings();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [usageTracking, setUsageTracking] = useState(true);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');

  const handleAddWallet = () => {
    if (newWalletName.trim()) {
      addWallet(newWalletName.trim());
      setNewWalletName('');
      setShowAddWalletModal(false);
    }
  };

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

        <List.Section>
          <List.Subheader>Wallets</List.Subheader>
          {settings.wallets.map((wallet) => (
            <List.Item
              key={wallet}
              title={wallet === 'default' ? 'Default' : wallet}
              right={() => (
                <View style={styles.walletActions}>
                  <Switch
                    value={settings.activeWallet === wallet}
                    onValueChange={() => setActiveWallet(wallet)}
                  />
                  {wallet !== 'default' && (
                    <IconButton
                      icon="delete"
                      onPress={() => removeWallet(wallet)}
                    />
                  )}
                </View>
              )}
            />
          ))}
          <List.Item
            title="Add New Wallet"
            left={props => <List.Icon {...props} icon="plus" />}
            onPress={() => setShowAddWalletModal(true)}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Display</List.Subheader>
          <List.Item
            title="Hide Empty Default Category"
            description="Hide the default category when it has no cards"
            left={props => <List.Icon {...props} icon="eye-off" />}
            right={() => (
              <Switch
                value={settings.hideEmptyDefaultCategory}
                onValueChange={(value) => 
                  updateSettings({ hideEmptyDefaultCategory: value })
                }
              />
            )}
          />
          <List.Item
            title="FAB Position"
            description={settings.fabPosition === 'right' ? 'Right' : 'Left'}
            right={() => (
              <Switch
                value={settings.fabPosition === 'right'}
                onValueChange={(value) =>
                  updateSettings({ fabPosition: value ? 'right' : 'left' })
                }
              />
            )}
          />
          <List.Item
            title="Swipe Direction"
            description={settings.swipeDirection === 'normal' ? 'Left to Use, Right to Delete' : 'Right to Use, Left to Delete'}
            right={() => (
              <Switch
                value={settings.swipeDirection === 'inverted'}
                onValueChange={(value) =>
                  updateSettings({ swipeDirection: value ? 'inverted' : 'normal' })
                }
              />
            )}
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

      <Portal>
        <Modal
          visible={showAddWalletModal}
          onDismiss={() => setShowAddWalletModal(false)}
          contentContainerStyle={styles.modal}
        >
          <TextInput
            label="Wallet Name"
            value={newWalletName}
            onChangeText={setNewWalletName}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddWallet}>
            Add Wallet
          </Button>
        </Modal>
      </Portal>
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
  walletActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
});

export default SettingsScreen; 