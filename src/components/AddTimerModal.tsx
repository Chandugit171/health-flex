import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import 'react-native-get-random-values'; 

import { v4 as uuidv4 } from 'uuid';
import { Timer } from '../types';

interface AddTimerModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (timer: Timer) => void;
  existingCategories: string[];
}

const AddTimerModal: React.FC<AddTimerModalProps> = ({
  visible,
  onClose,
  onAdd,
  existingCategories,
}) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleSubmit = () => {
    if (!name || !duration) {
      return;
    }

    const durationInSeconds = parseInt(duration, 10) * 60; // Convert minutes to seconds
    const selectedCategory = showNewCategoryInput ? newCategory : category;

    const newTimer: Timer = {
      id: uuidv4(),
      name,
      duration: durationInSeconds,
      category: selectedCategory,
      remainingTime: durationInSeconds,
      status: 'idle',
      halfwayAlert,
    };

    onAdd(newTimer);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDuration('');
    setCategory('');
    setHalfwayAlert(false);
    setNewCategory('');
    setShowNewCategoryInput(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Add New Timer</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Timer Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                
                onChangeText={setName}
                placeholder="Enter timer name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="Enter duration in minutes"
              />
            </View>

            {!showNewCategoryInput && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryContainer}>
                    {existingCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryButton,
                          category === cat && styles.selectedCategory,
                        ]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            category === cat && styles.selectedCategoryText,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.newCategoryButton}
              onPress={() => setShowNewCategoryInput(!showNewCategoryInput)}
            >
              <Text style={styles.newCategoryButtonText}>
                {showNewCategoryInput ? 'Select Existing Category' : 'Add New Category'}
              </Text>
            </TouchableOpacity>

            {showNewCategoryInput && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Category Name</Text>
                <TextInput
                  style={styles.input}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="Enter new category name"
                />
              </View>
            )}

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Enable Halfway Alert</Text>
              <Switch
                value={halfwayAlert}
                onValueChange={setHalfwayAlert}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={halfwayAlert ? '#2196F3' : '#f4f3f4'}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Add Timer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
  },
  categoryButtonText: {
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
  },
  newCategoryButton: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  newCategoryButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  addButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTimerModal;