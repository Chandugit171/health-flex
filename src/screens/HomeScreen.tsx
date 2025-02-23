import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Timer, Category } from '../types';
import TimerList from '../components/TimerList';
import AddTimerModal from '../components/AddTimerModal';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/general/Header';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = () => {
  const navigation =useNavigation()
    const { darkMode, toggleTheme } = useContext(ThemeContext); 
  
  const [timers, setTimers] = useState<Timer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
const handleHistory =()=>{
  navigation.navigate("History")
}
  useEffect(() => {
    loadTimers();
  }, []);
  const onUpdateTimers = (updatedTimers: Timer[]) => {
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };
  useEffect(() => {
    onUpdateTimers(timers);
  }, [timers]);
    

  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        const parsedTimers = JSON.parse(storedTimers);
        setTimers(parsedTimers);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(parsedTimers.map((timer: Timer) => timer.category))
        ).map(category => ({
          name: category,
          expanded: true
        }));
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error loading timers:', error);
    }
  };

  const saveTimers = async (updatedTimers: Timer[]) => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    } catch (error) {
      console.error('Error saving timers:', error);
    }
  };

  const handleAddTimer = async (newTimer: Timer) => {
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    await saveTimers(updatedTimers);
    
    if (!categories.find(cat => cat.name === newTimer.category)) {
      setCategories([...categories, { name: newTimer.category, expanded: true }]);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setCategories(categories.map(cat => 
      cat.name === categoryName 
        ? { ...cat, expanded: !cat.expanded }
        : cat
    ));
  };

  const handleBulkAction = (category: string, action: 'start' | 'pause' | 'reset') => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category) {
        switch (action) {
          case 'start':
            return { ...timer, status: 'running' };
          case 'pause':
            return { ...timer, status: 'paused' };
          case 'reset':
            return { ...timer, remainingTime: timer.duration, status: 'idle' };
          default:
            return timer;
        }
      }
      return timer;
    });
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#222' : '#c2c' }]}>
      <Header />

      <ScrollView>
        {categories.map(category => (
          <View key={category.name} >
            <TouchableOpacity
            style={[styles.categoryHeader, { backgroundColor: darkMode ? '#ccc' : '#fff' }]}
              // style={styles.categoryHeader}
              onPress={() => toggleCategory(category.name)}
            >
              <Text style={[styles.categoryTitle, { color: darkMode ? '#222' : '#c2c' }]}>{category.name}</Text>
              <Icon
                name={category.expanded ? 'expand-less' : 'expand-more'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            
            {category.expanded && (
              <View style={styles.bulkActions}>
                <TouchableOpacity
                  onPress={() => handleBulkAction(category.name, 'start')}
                  style={styles.bulkActionButton}
                >
                  <Text>Start All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleBulkAction(category.name, 'pause')}
                  style={styles.bulkActionButton}
                >
                  <Text>Pause All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleBulkAction(category.name, 'reset')}
                  style={styles.bulkActionButton}
                >
                  <Text>Reset All</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {category.expanded && (
              <TimerList
                timers={timers.filter(timer => timer.category === category.name)}
                onUpdateTimer={(updatedTimer) => {
                  const newTimers = timers.map(t => 
                    t.id === updatedTimer.id ? updatedTimer : t
                  );
                  setTimers(newTimers);
                  saveTimers(newTimers);
                }}
              />
            )}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}

      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>




      <AddTimerModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddTimer}
        existingCategories={categories.map(cat => cat.name)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  categoryContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    // backgroundColor: '#e0e0e0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  bulkActionButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 2,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HomeScreen;