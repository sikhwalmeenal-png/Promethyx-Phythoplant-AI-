import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AlertsScreen } from '../screens/AlertsScreen';
import { AutomationScreen } from '../screens/AutomationScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LiveSignalsScreen } from '../screens/LiveSignalsScreen';
import { usePlantData } from '../hooks/usePlantData';
import {
  Sprout,
  ShieldAlert,
  Sliders,
  LineChart,
  Settings,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const { colors } = usePlantData();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 92 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colors.background === '#0D0E0C' ? 0.2 : 0.03,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Garden',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconTabContainer,
              focused && { backgroundColor: colors.primaryLight + '35' }
            ]}>
              <Sprout size={18} color={focused ? colors.primaryDark : colors.textMuted} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AlertsTab"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconTabContainer,
              focused && { backgroundColor: colors.primaryLight + '35' }
            ]}>
              <ShieldAlert size={18} color={focused ? colors.primaryDark : colors.textMuted} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AutomationTab"
        component={AutomationScreen}
        options={{
          tabBarLabel: 'Auto',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconTabContainer,
              focused && { backgroundColor: colors.primaryLight + '35' }
            ]}>
              <Sliders size={18} color={focused ? colors.primaryDark : colors.textMuted} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconTabContainer,
              focused && { backgroundColor: colors.primaryLight + '35' }
            ]}>
              <LineChart size={18} color={focused ? colors.primaryDark : colors.textMuted} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <View style={[
              styles.iconTabContainer,
              focused && { backgroundColor: colors.primaryLight + '35' }
            ]}>
              <Settings size={18} color={focused ? colors.primaryDark : colors.textMuted} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { colors } = usePlantData();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="LiveSignals" 
        component={LiveSignalsScreen} 
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconTabContainer: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
