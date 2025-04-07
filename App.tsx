import React from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
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
              headerShown: false,
              contentStyle: { backgroundColor: '#000' },
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ZoneDataProvider>
    </VehicleProvider>
  );
};

export default App;
