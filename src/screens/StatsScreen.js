import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getGoals } from '../database/db';
import ProgressChart from '../componentes/ProgressChart';

export default function StatsScreen({ navigation }) {
  const [completedGoals, setCompletedGoals] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Carga las estadísticas cada vez que la pantalla recibe foco
      loadStats();
    });

    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      await getGoals((goals) => {
        const total = goals.length;

        // Determina los objetivos completados según las fechas
        const now = new Date();
        const completed = goals.filter((goal) => {
          const deadline = new Date(goal.deadline);
          return deadline <= now;
        }).length;

        setTotalGoals(total);
        setCompletedGoals(completed);
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      ) : totalGoals === 0 ? (
        <Text style={styles.noGoalsText}>Aún no tienes objetivos creados.</Text>
      ) : (
        <>
          <Text style={styles.header}>Estadísticas Básicas</Text>
          <Text style={styles.stat}>Total de objetivos: {totalGoals}</Text>
          <Text style={styles.stat}>Objetivos completados: {completedGoals}</Text>
          <Text style={styles.stat}>
            Progreso: {(completedGoals / (totalGoals || 1) * 100).toFixed(2)}%
          </Text>
          <ProgressChart completed={completedGoals} total={totalGoals} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  stat: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
  },
  noGoalsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});
