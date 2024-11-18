import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar objetivos
export const insertGoal = async (title, description, deadline, subGoals, timeUnit, timeAmount) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const newGoal = {
      id: Date.now(),
      title,
      description,
      deadline,
      subGoals: subGoals || [],
      timeUnit: timeUnit || '', // Guarda el timeUnit
      timeAmount: parseInt(timeAmount) || null, // Guarda el timeAmount como número
    };
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
    if (!goals.some((goal) => goal.id === id)) {
      console.warn(`El objetivo con ID ${id} no existe.`);
      return;
    }
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    console.log('Objetivos después de eliminar:', updatedGoals);
  } catch (error) {
    console.error('Error al eliminar objetivo:', error);
  }
};

/// Actualizar objetivos
export const updateGoal = async ({
  id,
  title,
  description,
  deadline,
  subGoals,
  timeUnit,
  timeAmount,
}) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            title,
            description,
            deadline,
            subGoals: Array.isArray(subGoals) ? subGoals : [],
            timeUnit: timeUnit || '', // Actualiza el timeUnit
            timeAmount: parseInt(timeAmount) || null, // Actualiza el timeAmount como número
          }
        : goal
    );
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    console.log('Objetivo actualizado correctamente:', { id, title, description, deadline });
  } catch (error) {
    console.error('Error al actualizar objetivo:', error);
  }
};

// Obtener un objetivo por ID
export const getGoalById = async (id) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const goal = goals.find((goal) => goal.id === id);
    return {
      ...goal,
      timeUnit: goal?.timeUnit || '', // Devuelve un valor predeterminado si está vacío
      timeAmount: goal?.timeAmount || '', // Devuelve un valor predeterminado si está vacío
      subGoals: Array.isArray(goal?.subGoals) ? goal.subGoals : [], // Asegúrate de que sea un array
    };
  } catch (error) {
    console.error('Error al obtener el objetivo:', error);
    return null;
  }
};
