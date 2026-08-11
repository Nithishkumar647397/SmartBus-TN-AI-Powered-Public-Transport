import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AlertsScreen from '../screens/Alerts/AlertsScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import LocationPickerScreen from '../screens/Location/LocationPickerScreen';
import DestinationResultsScreen from '../screens/Location/DestinationResultsScreen';
import BusDetailsScreen from '../screens/BusDetails/BusDetailsScreen';
import { useAppTheme } from '../utils/theme';

export type BottomTabParamList = {
  HomeTab: undefined;
  LiveTab: undefined;
  AlertsTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerification: { mobile: string; isRegistration?: boolean };
  Register: undefined;
  MainTabs: undefined;
  LocationPicker: undefined;
  DestinationResults: { origin: string };
  LiveTracking: { busId: string; destination?: string; serviceType?: 'normal' | 'express' | 'point_to_point' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Dummy stubs for tabs and tracking
const StubScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen Stub</Text>
  </View>
);

function MainTabNavigator() {
  const theme = useAppTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'LiveTab') iconName = focused ? 'radar' : 'map-marker-radius-outline';
          else if (route.name === 'AlertsTab') iconName = focused ? 'bell' : 'bell-outline';
          else if (route.name === 'SettingsTab') iconName = focused ? 'cog' : 'cog-outline';
          
          return (
            <View style={{ 
              paddingHorizontal: 16, 
              paddingVertical: 4, 
              borderRadius: 20, 
              backgroundColor: focused ? `${theme.colors.primary}15` : 'transparent' 
            }}>
              <MaterialCommunityIcons name={iconName} size={24} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondaryText || '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="LiveTab" children={() => <StubScreen name="Live" />} />
      <Tab.Screen name="AlertsTab" component={AlertsScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="DestinationResults" component={DestinationResultsScreen} />
      <Stack.Screen name="LiveTracking" component={BusDetailsScreen} />
    </Stack.Navigator>
  );
}
