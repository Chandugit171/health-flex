import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import Header from '../components/general/Header';
import { ThemeProvider } from '../context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <ThemeProvider>

    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: () => <Header />, 
          }}
          
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'Timer History',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;