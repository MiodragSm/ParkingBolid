import React from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';
import { ZoneDataProvider } from './src/contexts/ZoneDataContext';
import { VehicleProvider } from './src/contexts/VehicleContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <VehicleProvider>
      <ZoneDataProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: true,
              headerStyle: { backgroundColor: '#000' },
              headerTintColor: '#fff',
              contentStyle: { backgroundColor: '#000' },
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ZoneDataProvider>
    </VehicleProvider>
  );
};

export default App;
