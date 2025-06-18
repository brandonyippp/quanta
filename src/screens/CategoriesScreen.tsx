import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, List, Portal, Modal, Surface } from 'react-native-paper';
import { useCategories } from '../contexts/CategoriesContext';

const CategoriesScreen = () => {
  const { categories, addCategory, removeCategory } = useCategories();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddModal(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <Button
          mode="contained"
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          Add New Category
        </Button>

        {categories.map(category => (
          <List.Item
            key={category.id}
            title={category.name}
            description={`${category.cards.length} cards`}
            left={props => <List.Icon {...props} icon="folder" />}
            right={props => 
              category.id !== 'default' && (
                <Button
                  mode="text"
                  onPress={() => removeCategory(category.id)}
                  {...props}
                >
                  Delete
                </Button>
              )
            }
            style={styles.categoryItem}
          />
        ))}
      </Surface>

      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Add New Category</Text>
          <TextInput
            label="Category Name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleAddCategory}
            disabled={!newCategoryName.trim()}
            style={styles.modalButton}
          >
            Add Category
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  addButton: {
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
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
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
});

export default CategoriesScreen; 