import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar objetivos
export const insertGoal = async (title, description, deadline, subGoals, timeUnit, timeAmount) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const newGoal = {
      id: Date.now(),
      title,
      description,
      deadline: deadline instanceof Date ? deadline.toISOString() : deadline, // Asegurar formato ISO
      subGoals: subGoals || [],
      timeUnit: timeUnit || '',
      timeAmount: parseInt(timeAmount) || null,
      isCompleted: false, // Nuevo campo que indica si el objetivo está completado
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
    console.log('Objetivos recuperados:', goals); // Log para verificar los datos
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

// Actualizar objetivo
export const updateGoal = async ({
  id,
  title,
  description,
  deadline,
  subGoals,
  timeUnit,
  timeAmount,
  isCompleted,
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
            timeUnit: timeUnit || '',
            timeAmount: parseInt(timeAmount) || null,
            isCompleted: isCompleted || false,
            completedDate: isCompleted ? new Date().toISOString() : goal.completedDate,
          }
        : goal
    );
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    console.log('Objetivo actualizado correctamente:', { id, isCompleted });
  } catch (error) {
    console.error('Error al actualizar objetivo:', error);
  }
};

// Marcar objetivo como completado
export const markGoalAsCompleted = async (id) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            isCompleted: true,
            completedDate: new Date().toISOString(),
          }
        : goal
    );
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    console.log('Objetivo marcado como completado:', id);
  } catch (error) {
    console.error('Error al marcar objetivo como completado:', error);
  }
};

export const getGoalById = async (id) => {
  try {
    const goals = JSON.parse(await AsyncStorage.getItem('goals')) || [];
    const goal = goals.find((goal) => goal.id === id);
    console.log('Objetivo recuperado por ID:', goal); // Verificar datos recuperados
    return {
      ...goal,
      timeUnit: goal?.timeUnit || '', // Valor predeterminado si no está
      timeAmount: goal?.timeAmount?.toString() || '', // Convertir a cadena
      subGoals: Array.isArray(goal?.subGoals) ? goal.subGoals : [], // Asegurar que sea un array
    };
  } catch (error) {
    console.error('Error al obtener objetivo por ID:', error);
    return null;
  }
};
