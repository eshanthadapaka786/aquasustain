import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { FarmerDashboardScreen } from '../screens/FarmerDashboardScreen';
import { PondAssessmentScreen } from '../screens/PondAssessmentScreen';
import { WaterQualityScreen } from '../screens/WaterQualityScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { WeatherScreen } from '../screens/WeatherScreen';
import { LearningScreen } from '../screens/LearningScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.teal,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={FarmerDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 16 }}>🏡</Text>,
        }}
      />
      <Tab.Screen
        name="Assessment"
        component={PondAssessmentScreen}
        options={{
          tabBarLabel: 'Diagnose',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 16 }}>🩺</Text>,
        }}
      />
      <Tab.Screen
        name="WaterQuality"
        component={WaterQualityScreen}
        options={{
          tabBarLabel: 'Water',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 16 }}>💧</Text>,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 16 }}>⚖️</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 16 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '800', fontSize: 16 },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: 'Farm Expenses' }}
      />
      <Stack.Screen
        name="Weather"
        component={WeatherScreen}
        options={{ title: 'Coastal Weather Forecast' }}
      />
      <Stack.Screen
        name="Learning"
        component={LearningScreen}
        options={{ title: 'Knowledge Center' }}
      />
      <Stack.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ title: 'Task Reminders' }}
      />
    </Stack.Navigator>
  );
};
