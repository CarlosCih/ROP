import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import GoalScreen from '../screens/GoalScreen';
import EditGoalScreen from '../screens/EditGoalScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Mis Objetivos" }} />
        <Stack.Screen name="Goal" component={GoalScreen} options={{ title: "Añadir Objetivo" }} />
        <Stack.Screen name="EditGoal" component={EditGoalScreen} options={{ title: "Editar Objetivo" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
