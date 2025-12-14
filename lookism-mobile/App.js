import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { VoiceNavigationProvider } from './src/contexts/VoiceNavigationContext';

import LoginScreen from './src/screens/LoginScreen';
import VisionSelectorScreen from './src/screens/VisionSelectorScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchDestinationScreen from './src/screens/SearchDestinationScreen';
import TripTrackingScreen from './src/screens/TripTrackingScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SavedAddressesScreen from './src/screens/SavedAddressesScreen';
import RatingScreen from './src/screens/RatingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AccessibilityProvider>
      <VoiceNavigationProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="VisionSelector" component={VisionSelectorScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SearchDestination" component={SearchDestinationScreen} />
            <Stack.Screen name="TripTracking" component={TripTrackingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
            <Stack.Screen name="Rating" component={RatingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </VoiceNavigationProvider>
    </AccessibilityProvider>
  );
}
