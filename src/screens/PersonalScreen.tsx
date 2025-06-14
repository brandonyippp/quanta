import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppUsage {
  packageName: string;
  appName: string;
  timeUsed: number;
  timeLimit: number;
}

const PersonalScreen = () => {
  const [apps, setApps] = useState<AppUsage[]>([]);

  // Mock data for now - we'll implement real app usage tracking later
  useEffect(() => {
    setApps([
      {
        packageName: 'com.instagram.android',
        appName: 'Instagram',
        timeUsed: 45, // minutes
        timeLimit: 60,
      },
      {
        packageName: 'com.facebook.android',
        appName: 'Facebook',
        timeUsed: 30,
        timeLimit: 45,
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Personal Time Management</Text>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium">Daily Summary</Text>
            <Text>Total Screen Time: 2h 15m</Text>
            <Text>Apps Monitored: {apps.length}</Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>App Usage</Text>
        {apps.map((app, index) => (
          <Card key={app.packageName} style={styles.appCard}>
            <Card.Content>
              <Text variant="titleMedium">{app.appName}</Text>
              <Text>Time Used: {app.timeUsed} minutes</Text>
              <Text>Time Limit: {app.timeLimit} minutes</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(app.timeUsed / app.timeLimit) * 100}%` }
                  ]} 
                />
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Adjust Limit</Button>
              <Button onPress={() => {}}>View Details</Button>
            </Card.Actions>
          </Card>
        ))}

        <Button 
          mode="contained" 
          style={styles.addButton}
          onPress={() => {}}
        >
          Add New App
        </Button>
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
  summaryCard: {
    margin: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  appCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  addButton: {
    margin: 16,
    marginTop: 8,
  },
});

export default PersonalScreen; 