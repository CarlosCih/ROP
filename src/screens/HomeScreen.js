import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getGoals, removeGoal, markGoalAsCompleted } from '../database/db';

export default function HomeScreen({ navigation }) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadGoals(); // Carga los objetivos al volver a esta pantalla
    });
    return unsubscribe; // Limpia el listener al desmontar el componente
  }, [navigation]);

  const loadGoals = async () => {
    try {
      await getGoals((data) => setGoals(data)); // Carga los objetivos desde la base de datos
    } catch (error) {
      console.error('Error al cargar los objetivos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeGoal(id); // Elimina el objetivo de la base de datos
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id)); // Actualiza el estado
    } catch (error) {
      console.error('Error al eliminar el objetivo:', error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await markGoalAsCompleted(id); // Marca el objetivo como completado en la base de datos
      const updatedGoals = goals.map((goal) =>
        goal.id === id ? { ...goal, isCompleted: true } : goal
      );
      setGoals(updatedGoals); // Actualiza la lista en el estado
    } catch (error) {
      console.error('Error al completar el objetivo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Añadir un Objetivo" onPress={() => navigation.navigate('Goal')} />
      {goals.length === 0 ? (
        <Text style={styles.noGoals}>No hay objetivos guardados.</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.goalItem}>
              <Text style={styles.goalTitle}>{item.title}</Text>
              <Text style={styles.goalDeadline}>
                Fecha Límite: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No definida'}
              </Text>
              <Text style={styles.goalSubGoals}>
                Subobjetivos: {item.subGoals ? item.subGoals.length : 0}
              </Text>
              <Text style={styles.goalStatus}>
                Estado: {item.isCompleted ? 'Completado' : 'Pendiente'}
              </Text>
              <View style={styles.buttonRow}>
                {!item.isCompleted && (
                  <Button
                    title="Completar"
                    onPress={async () => {
                      await handleComplete(item.id);
                    }}
                    color="green"
                  />
                )}
                <Button
                  title="Editar"
                  onPress={() => navigation.navigate('EditGoal', { goalId: item.id })}
                />
                <Button
                  title="Eliminar"
                  onPress={async () => {
                    await handleDelete(item.id);
                  }}
                  color="red"
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noGoals: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  goalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goalDeadline: {
    fontSize: 14,
    color: 'gray',
  },
  goalSubGoals: {
    fontSize: 14,
    color: '#555',
  },
  goalStatus: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
  },
});
