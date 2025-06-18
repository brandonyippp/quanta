import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, List, Portal, Modal, Surface } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '../contexts/SettingsContext';
import { useCategories } from '../contexts/CategoriesContext';
import { AppCard, TimePeriod } from '../types';

type TimeUnit = 'minutes' | 'hours';

const AddAppScreen = () => {
  const navigation = useNavigation();
  const { settings } = useSettings();
  const { categories, addCardToCategory } = useCategories();
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(settings.activeWallet);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('default');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Time allowance states
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [dailyHours, setDailyHours] = useState(0);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyMinutes, setMonthlyMinutes] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);

  // Time input states
  const [editingTime, setEditingTime] = useState<{
    type: 'daily' | 'weekly' | 'monthly';
    unit: 'hours' | 'minutes';
  } | null>(null);
  const [tempTimeValue, setTempTimeValue] = useState('');

  const formatTotalTime = (minutes: number, hours: number) => {
    const totalMinutes = hours * 60 + minutes;
    const displayHours = Math.floor(totalMinutes / 60);
    const displayMinutes = totalMinutes % 60;

    let result = '';
    if (displayHours > 0) result += `${displayHours}h `;
    if (displayMinutes > 0) result += `${displayMinutes}m`;
    return result.trim() || '0m';
  };

  const handleAddApp = () => {
    if (!appName || !packageName) return;

    // Convert time values to seconds
    const convertToSeconds = (minutes: number, hours: number) => {
      return (hours * 60 + minutes) * 60;
    };

    const newCard: AppCard = {
      id: Date.now().toString(),
      name: appName,
      packageName,
      icon: '📱', // Default icon
      timeUsed: 0,
      timeLimit: {
        daily: (dailyHours > 0 || dailyMinutes > 0) ? convertToSeconds(dailyMinutes, dailyHours) : undefined,
        weekly: (weeklyHours > 0 || weeklyMinutes > 0) ? convertToSeconds(weeklyMinutes, weeklyHours) : undefined,
        monthly: (monthlyHours > 0 || monthlyMinutes > 0) ? convertToSeconds(monthlyMinutes, monthlyHours) : undefined,
      },
      wallet: selectedWallet,
    };

    addCardToCategory(newCard.id, selectedCategory);
    navigation.goBack();
  };

  const handleTimeSubmit = () => {
    if (!editingTime) return;
    
    const newValue = Math.min(
      editingTime.unit === 'hours' ? 24 : 59,
      Math.max(0, parseInt(tempTimeValue) || 0)
    );

    switch (editingTime.type) {
      case 'daily':
        if (editingTime.unit === 'hours') setDailyHours(newValue);
        else setDailyMinutes(newValue);
        break;
      case 'weekly':
        if (editingTime.unit === 'hours') setWeeklyHours(newValue);
        else setWeeklyMinutes(newValue);
        break;
      case 'monthly':
        if (editingTime.unit === 'hours') setMonthlyHours(newValue);
        else setMonthlyMinutes(newValue);
        break;
    }

    setEditingTime(null);
  };

  const renderTimeSelector = (
    label: string,
    type: 'daily' | 'weekly' | 'monthly',
    minutes: number,
    setMinutes: (value: number) => void,
    hours: number,
    setHours: (value: number) => void
  ) => {
    const isEditingHours = editingTime?.type === type && editingTime?.unit === 'hours';
    const isEditingMinutes = editingTime?.type === type && editingTime?.unit === 'minutes';

    return (
      <Surface style={styles.timeSelector}>
        <Text style={styles.timeLabel}>{label}</Text>
        <Text style={styles.totalTime}>Total: {formatTotalTime(minutes, hours)}</Text>
        <View style={styles.timeInputs}>
          <View style={styles.timeInput}>
            <Text>Hours</Text>
            <Slider
              value={hours}
              onValueChange={setHours}
              minimumValue={0}
              maximumValue={24}
              step={1}
              style={styles.slider}
            />
            {isEditingHours ? (
              <TextInput
                value={tempTimeValue}
                onChangeText={setTempTimeValue}
                keyboardType="numeric"
                onBlur={handleTimeSubmit}
                onSubmitEditing={handleTimeSubmit}
                style={styles.timeTextInput}
                autoFocus
              />
            ) : (
              <TouchableOpacity 
                onPress={() => {
                  setEditingTime({ type, unit: 'hours' });
                  setTempTimeValue(hours.toString());
                }}
              >
                <Text style={styles.timeValue}>{hours}h</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.timeInput}>
            <Text>Minutes</Text>
            <Slider
              value={minutes}
              onValueChange={setMinutes}
              minimumValue={0}
              maximumValue={59}
              step={1}
              style={styles.slider}
            />
            {isEditingMinutes ? (
              <TextInput
                value={tempTimeValue}
                onChangeText={setTempTimeValue}
                keyboardType="numeric"
                onBlur={handleTimeSubmit}
                onSubmitEditing={handleTimeSubmit}
                style={styles.timeTextInput}
                autoFocus
              />
            ) : (
              <TouchableOpacity 
                onPress={() => {
                  setEditingTime({ type, unit: 'minutes' });
                  setTempTimeValue(minutes.toString());
                }}
              >
                <Text style={styles.timeValue}>{minutes}m</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Surface>
    );
  };

  const handleWalletSelect = (wallet: string) => {
    setSelectedWallet(wallet);
    setShowWalletModal(false);
  };

  const handleAddWallet = () => {
    // TODO: Implement add wallet logic
    setShowWalletModal(false);
  };

  const renderCategoriesTab = () => (
    <View style={styles.tabContent}>
      <Button
        mode="contained"
        onPress={() => setShowCategoryModal(true)}
        style={styles.addCategoryButton}
      >
        Add New Category
      </Button>
      <ScrollView>
        {categories.map((category) => (
          <List.Item
            key={category.id}
            title={category.name}
            description={`${category.cards.length} cards`}
            left={props => <List.Icon {...props} icon="folder" />}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.selectedCategory
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderAddAppTab = () => (
    <View style={styles.tabContent}>
      <TextInput
        label="App Name"
        value={appName}
        onChangeText={setAppName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Package Name"
        value={packageName}
        onChangeText={setPackageName}
        style={styles.input}
        mode="outlined"
      />

      <Text style={styles.sectionTitle}>Time Allowance</Text>
      {renderTimeSelector('Daily Limit', 'daily', dailyMinutes, setDailyMinutes, dailyHours, setDailyHours)}
      {renderTimeSelector('Weekly Limit', 'weekly', weeklyMinutes, setWeeklyMinutes, weeklyHours, setWeeklyHours)}
      {renderTimeSelector('Monthly Limit', 'monthly', monthlyMinutes, setMonthlyMinutes, monthlyHours, setMonthlyHours)}

      <Button
        mode="contained"
        onPress={() => setShowWalletModal(true)}
        style={styles.walletButton}
      >
        Select Wallet: {selectedWallet}
      </Button>

      <Button
        mode="contained"
        onPress={handleAddApp}
        style={styles.addButton}
        disabled={!appName || !packageName}
      >
        Add App
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={activeTab.toString()}
          onValueChange={(value) => setActiveTab(parseInt(value))}
          buttons={[
            { 
              value: '0', 
              label: 'Add App', 
              icon: 'plus',
              style: styles.tabButton,
              labelStyle: styles.tabLabel,
            },
            { 
              value: '1', 
              label: 'Categories', 
              icon: 'folder',
              style: styles.tabButton,
              labelStyle: styles.tabLabel,
            },
          ]}
          style={styles.tabs}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {activeTab === 0 ? renderAddAppTab() : renderCategoriesTab()}
      </ScrollView>

      <Portal>
        <Modal
          visible={showWalletModal}
          onDismiss={() => setShowWalletModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Select Wallet</Text>
          {settings.wallets.map((wallet) => (
            <List.Item
              key={wallet}
              title={wallet === 'default' ? 'Default' : wallet}
              left={props => <List.Icon {...props} icon="wallet" />}
              onPress={() => handleWalletSelect(wallet)}
              style={styles.walletItem}
            />
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Add padding to account for the nav bar
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  tabs: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  input: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeSelector: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  timeValue: {
    textAlign: 'center',
    marginTop: 2,
    fontSize: 14,
  },
  walletButton: {
    marginTop: 16,
  },
  addButton: {
    marginTop: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  walletItem: {
    paddingVertical: 8,
  },
  addCategoryButton: {
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedCategory: {
    backgroundColor: '#e3f2fd',
  },
  timeTextInput: {
    textAlign: 'center',
    fontSize: 14,
    padding: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 2,
  },
});

export default AddAppScreen; 