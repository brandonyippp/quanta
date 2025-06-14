import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const StatsScreen = () => {
  // Mock data for now
  const dailyStats = {
    totalScreenTime: 180, // minutes
    mostUsedApp: 'Instagram',
    mostUsedAppTime: 45,
    productivityScore: 75, // percentage
  };

  const weeklyStats = {
    averageDailyUsage: 210, // minutes
    totalWorkspaceTime: 1200, // minutes
    totalPersonalTime: 270, // minutes
    mostProductiveDay: 'Wednesday',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Usage Statistics</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Today's Overview</Text>
            <View style={styles.statRow}>
              <Text>Total Screen Time:</Text>
              <Text>{Math.floor(dailyStats.totalScreenTime / 60)}h {dailyStats.totalScreenTime % 60}m</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Most Used App:</Text>
              <Text>{dailyStats.mostUsedApp} ({dailyStats.mostUsedAppTime}m)</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Productivity Score:</Text>
              <Text>{dailyStats.productivityScore}%</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Weekly Overview</Text>
            <View style={styles.statRow}>
              <Text>Average Daily Usage:</Text>
              <Text>{Math.floor(weeklyStats.averageDailyUsage / 60)}h {weeklyStats.averageDailyUsage % 60}m</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Total Workspace Time:</Text>
              <Text>{Math.floor(weeklyStats.totalWorkspaceTime / 60)}h {weeklyStats.totalWorkspaceTime % 60}m</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Total Personal Time:</Text>
              <Text>{Math.floor(weeklyStats.totalPersonalTime / 60)}h {weeklyStats.totalPersonalTime % 60}m</Text>
            </View>
            <View style={styles.statRow}>
              <Text>Most Productive Day:</Text>
              <Text>{weeklyStats.mostProductiveDay}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Insights</Text>
            <Text style={styles.insight}>
              • You're most productive between 9 AM and 11 AM
            </Text>
            <Text style={styles.insight}>
              • Social media usage has decreased by 15% this week
            </Text>
            <Text style={styles.insight}>
              • Project Alpha is taking up 60% of your workspace time
            </Text>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          style={styles.exportButton}
          onPress={() => {}}
        >
          Export Statistics
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
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  insight: {
    paddingVertical: 4,
  },
  exportButton: {
    margin: 16,
    marginTop: 8,
  },
});

export default StatsScreen; 