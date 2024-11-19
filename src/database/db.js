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
    // Sección relacionada con estadísticas:
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
    // Sección relacionada con estadísticas:
    console.log('Objetivos después de eliminar:', updatedGoals);
  } catch (error) {
    console.error('Error al eliminar objetivo:', error);
  }
};

// Actualizar objetivos
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
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const allSubGoalsCompleted = Array.isArray(subGoals) && subGoals.every((subGoal) => subGoal.isCompleted);
        return {
          ...goal,
          title,
          description,
          deadline: deadline instanceof Date ? deadline.toISOString() : deadline, // Asegurar formato ISO
          subGoals: Array.isArray(subGoals) ? subGoals : [],
          timeUnit: timeUnit || '',
          timeAmount: parseInt(timeAmount) || null,
          isCompleted: allSubGoalsCompleted || goal.isCompleted, // Actualiza el estado de `isCompleted`
        };
      }
      return goal;
    });
    await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    // Sección relacionada con estadísticas:
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
      deadline: goal?.deadline ? new Date(goal.deadline) : null, // Convertir a Date si está en ISO
      timeUnit: goal?.timeUnit || '',
      timeAmount: goal?.timeAmount || '',
      subGoals: Array.isArray(goal?.subGoals) ? goal.subGoals : [],
    };
  } catch (error) {
    console.error('Error al obtener el objetivo:', error);
    return null;
  }
};
