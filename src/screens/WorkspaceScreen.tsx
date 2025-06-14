import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Workspace {
  id: string;
  name: string;
  totalTime: number;
  allocatedTime: number;
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  timeSpent: number;
  timeAllocated: number;
}

const WorkspaceScreen = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1',
      name: 'Project Alpha',
      totalTime: 480, // 8 hours in minutes
      allocatedTime: 360,
      tasks: [
        {
          id: '1',
          name: 'Development',
          timeSpent: 120,
          timeAllocated: 180,
        },
        {
          id: '2',
          name: 'Meetings',
          timeSpent: 60,
          timeAllocated: 90,
        },
      ],
    },
    {
      id: '2',
      name: 'Project Beta',
      totalTime: 360,
      allocatedTime: 240,
      tasks: [
        {
          id: '3',
          name: 'Planning',
          timeSpent: 90,
          timeAllocated: 120,
        },
      ],
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Workspace Management</Text>
        
        {workspaces.map((workspace) => (
          <Card key={workspace.id} style={styles.workspaceCard}>
            <Card.Content>
              <Text variant="titleLarge">{workspace.name}</Text>
              <Text>Total Time: {workspace.totalTime} minutes</Text>
              <Text>Allocated Time: {workspace.allocatedTime} minutes</Text>
              
              <Divider style={styles.divider} />
              
              <Text variant="titleMedium" style={styles.tasksTitle}>Tasks</Text>
              {workspace.tasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <Text variant="titleSmall">{task.name}</Text>
                  <View style={styles.taskProgress}>
                    <Text>Time Spent: {task.timeSpent} minutes</Text>
                    <Text>Allocated: {task.timeAllocated} minutes</Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${(task.timeSpent / task.timeAllocated) * 100}%` }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Add Task</Button>
              <Button onPress={() => {}}>Edit Workspace</Button>
            </Card.Actions>
          </Card>
        ))}

        <Button 
          mode="contained" 
          style={styles.addButton}
          onPress={() => {}}
        >
          Create New Workspace
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
  workspaceCard: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
  divider: {
    marginVertical: 12,
  },
  tasksTitle: {
    marginBottom: 8,
  },
  taskItem: {
    marginVertical: 8,
  },
  taskProgress: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  addButton: {
    margin: 16,
    marginTop: 8,
  },
});

export default WorkspaceScreen; 