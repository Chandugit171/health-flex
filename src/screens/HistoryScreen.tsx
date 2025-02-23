import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerLog } from '../types';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../context/ThemeContext';

const HistoryScreen = () => {
  const navigation =useNavigation()
  const [logs, setLogs] = useState<TimerLog[]>([]);
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Use theme context

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadLogs);
    return unsubscribe;
  }, [navigation]);
  

  const loadLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem('timerLogs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.setItem('timerLogs', JSON.stringify([]));
      setLogs([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };
  const handleBack =()=>{
    navigation.navigate("Home")
  }

  const renderItem = ({ item }: { item: TimerLog }) => (
    <View style={styles.logItem}>
      <Text style={styles.timerName}>{item.timerName}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.completedAt}>
        Completed: {new Date(item.completedAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#222' : '#c2c' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>

                      <Icon
                      name="arrow-back-ios-new"
                      size={24}
                      color="#333"
                      />
        </TouchableOpacity>
        <Text style={styles.title}>Timer History</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 10,
  },
  logItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    color: '#666',
    marginBottom: 3,
  },
  completedAt: {
    color: '#888',
    fontSize: 12,
  },
});

export default HistoryScreen;