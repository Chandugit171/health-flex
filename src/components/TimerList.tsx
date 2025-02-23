import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Timer } from '../types';
import ProgressBar from './ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerListProps {
  timers: Timer[];
  onUpdateTimers?: (updatedTimers: Timer[]) => void; // Make it optional
}

const TimerList: React.FC<TimerListProps> = ({ timers, onUpdateTimers }) => {
  const [localTimers, setLocalTimers] = useState<Timer[]>(timers);

  useEffect(() => {
    setLocalTimers(timers);
  }, [timers]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setLocalTimers((prevTimers) =>
  //       prevTimers.map((timer) => {
  //         if (timer.status === 'running' && timer.remainingTime > 0) {
  //           const newTime = timer.remainingTime - 1;

  //           if (timer.halfwayAlert && newTime === Math.floor(timer.duration / 2)) {
  //             Alert.alert(`Halfway alert for ${timer.name}`);
  //           }

  //           return { ...timer, remainingTime: newTime };
  //         }
  //         return timer;
  //       })
  //     );
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setLocalTimers((prevTimers) =>
  //       prevTimers.map((timer) => {
  //         if (timer.status === 'running' && timer.remainingTime > 0) {
  //           const newTime = timer.remainingTime - 1;
  //           const halfwayMark = Math.floor(timer.duration / 2);
  
  //           console.log(`Timer: ${timer.name}, Remaining Time: ${newTime}, Halfway Mark: ${halfwayMark}`);
  
  //           // Check if the alert needs to be triggered
  //           if (timer.halfwayAlert && newTime === halfwayMark) {
  //             Alert.alert(`Halfway alert for ${timer.name}`);
  //             console.log(`Halfway Alert Triggered for ${timer.name}`);
  //           }
  
  //           return { ...timer, remainingTime: newTime };
  //         }
  //         return timer;
  //       })
  //     );
  //   }, 1000);
  
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setLocalTimers((prevTimers:any) =>
        prevTimers.map((timer:any) => {
          if (timer.status === 'running' && timer.remainingTime > 0) {
            const newTime = timer.remainingTime - 1;
            const halfwayMark = Math.floor(timer.duration / 2);
  
            if (timer.halfwayAlert && newTime === halfwayMark) {
              Alert.alert(`Halfway alert for ${timer.name}`);
            }
  
            if (newTime === 0) {
              const completedTimer = { ...timer, status: 'completed' };
              saveToHistory(completedTimer); // Save completed timer to history
              return completedTimer;
            }
  
            return { ...timer, remainingTime: newTime };
          }
          return timer;
        })
      );
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  
  

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerAction = (action: string, timerId?: string) => {
    setLocalTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timerId && timer.id !== timerId) return timer;

        if (action === 'start') {
          return { ...timer, status: 'running' };
        } else if (action === 'pause') {
          return { ...timer, status: 'paused' };
        } else if (action === 'reset') {
          return { ...timer, remainingTime: timer.duration, status: 'idle' };
        }
        return timer;
      })
    );
  };

  useEffect(() => {
    if (onUpdateTimers) {
      onUpdateTimers(localTimers);
    }
  }, [localTimers, onUpdateTimers]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running':
        return '#4CAF50';
      case 'paused':
        return '#FFC107';
      case 'completed':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const saveToHistory = async (completedTimer: Timer) => {
    try {
      const storedLogs = await AsyncStorage.getItem('timerLogs');
      const logs = storedLogs ? JSON.parse(storedLogs) : [];
  
      const newLog = {
        id: completedTimer.id,
        timerName: completedTimer.name,
        category: 'General', // Change if you have categories
        completedAt: new Date().toISOString(),
      };
  
      logs.push(newLog);
      await AsyncStorage.setItem('timerLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving timer to history:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => handleTimerAction('start')}
        style={styles.startAllButton}
      >
        <Text style={styles.startAllText}>Start All</Text>
      </TouchableOpacity> */}

      {localTimers.map((timer) => (
        <View key={timer.id} style={styles.timerCard}>
          <View style={styles.timerHeader}>
            <Text style={styles.timerName}>{timer.name}</Text>
            <Text
              style={[
                styles.status,
                { color: getStatusColor(timer.status) },
              ]}
            >
              {timer.status.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>

          <ProgressBar
            progress={timer.remainingTime / timer.duration}
            color={getStatusColor(timer.status)}
          />

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => handleTimerAction('start', timer.id)}
              disabled={timer.status === 'running'}
              style={[
                styles.controlButton,
                timer.status === 'running' && styles.disabledButton,
              ]}
            >
              <Icon name="play-arrow" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTimerAction('pause', timer.id)}
              disabled={timer.status !== 'running'}
              style={[
                styles.controlButton,
                timer.status !== 'running' && styles.disabledButton,
              ]}
            >
              <Icon name="pause" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTimerAction('reset', timer.id)}
              style={styles.controlButton}
            >
              <Icon name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  startAllButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  startAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  controlButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
});

export default TimerList;
