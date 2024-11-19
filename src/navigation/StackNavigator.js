import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import GoalScreen from '../screens/GoalScreen';
import EditGoalScreen from '../screens/EditGoalScreen';
import StatsScreen from '../screens/StatsScreen';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener react-native-vector-icons instalado

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator para Home y Stats
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#f8f8f8' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ title: 'Estadísticas' }} />
    </Tab.Navigator>
  );
}

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tab Navigator para Home y Stats */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }} // Oculta el header del Stack para el Tab Navigator
        />
        {/* Otras pantallas como Goal y EditGoal */}
        <Stack.Screen name="Goal" component={GoalScreen} options={{ title: 'Añadir Objetivo' }} />
        <Stack.Screen name="EditGoal" component={EditGoalScreen} options={{ title: 'Editar Objetivo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
