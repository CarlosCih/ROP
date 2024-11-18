import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar objetivos
export const insertGoal = async (title, description, deadline, subGoals) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const newGoal = { id: Date.now(), title, description, deadline, subGoals: subGoals || [] };
    goals.push(newGoal);
    await AsyncStorage.setItem('goals', JSON.stringify(goals));
    console.log('Objetivo guardado:', newGoal);
    return newGoal;
  } catch (error) {
    console.error('Error al guardar objetivo:', error);
  }
};

// Obtener objetivos
export const getGoals = async (callback) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    console.log('Objetivos recuperados:', goals);
    callback(goals);
  } catch (error) {
    console.error('Error al obtener objetivos:', error);
  }
};

// Eliminar objetivo
export const removeGoal = async (id) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    console.log('Objetivos después de eliminar:', updatedGoals);
  } catch (error) {
    console.error('Error al eliminar objetivo:', error);
  }
};

// Actualizar objetivos
export const updateGoal = async ({ id, title, description, timeUnit, timeAmount, subGoals, deadline }) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            title,
            description,
            timeUnit,
            timeAmount,
            deadline, // Aseguramos que la fecha también se actualiza
            subGoals: Array.isArray(subGoals) ? subGoals : [],
          }
        : goal
    );
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    console.log('Objetivo actualizado correctamente:', {
      id,
      title,
      description,
      deadline,
    });
  } catch (error) {
    console.error('Error al actualizar objetivo:', error);
  }
};

// Obtener un objetivo por ID
export const getGoalById = async (id) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    console.log('Buscando ID:', id);
    console.log('Todos los objetivos:', goals);
    const goal = goals.find((goal) => goal.id === id);
    console.log('Objetivo encontrado:', goal);
    return goal || null;
  } catch (error) {
    console.error('Error al obtener el objetivo:', error);
    return null;
  }
};


