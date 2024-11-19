import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { getGoals } from '../database/db';
import ProgressChart from '../componentes/ProgressChart';

// Agrupar objetivos por semanas
const groupGoalsByWeek = (goals) => {
    const weeks = {};
  
    goals.forEach((goal) => {
      const completedDate = new Date(goal.completedDate);
      if (isNaN(completedDate)) {
        console.warn(`Fecha inválida en objetivo: ${goal.id}`);
        return; // Ignorar fechas inválidas
      }
  
      const startOfWeek = new Date(
        completedDate.getFullYear(),
        completedDate.getMonth(),
        completedDate.getDate() - completedDate.getDay()
      ).toISOString();
  
      if (!weeks[startOfWeek]) {
        weeks[startOfWeek] = 0;
      }
      weeks[startOfWeek] += 1;
    });
  
    console.log('Semanas agrupadas:', weeks); // Verifica el resultado
    return weeks;
  };
  

// Comparar semanas consecutivas
const compareWeeks = (weeks) => {
    const sortedWeeks = Object.keys(weeks).sort();
    const comparisons = [];
  
    for (let i = 1; i < sortedWeeks.length; i++) {
      const currentWeek = weeks[sortedWeeks[i]];
      const previousWeek = weeks[sortedWeeks[i - 1]];
      const difference = ((currentWeek - previousWeek) / (previousWeek || 1)) * 100;
  
      comparisons.push({
        week: sortedWeeks[i],
        current: currentWeek,
        previous: previousWeek,
        difference: difference.toFixed(2),
      });
    }
  
    console.log('Comparaciones semanales:', comparisons); // Log para depurar
    return comparisons;
  };
  

export default function StatsScreen({ navigation }) {
  const [completedGoals, setCompletedGoals] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [comparisons, setComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    try {
      await getGoals((goals) => {
        console.log('Objetivos recuperados:', goals); // Verifica los datos recuperados
        const total = goals.length;
        const completed = goals.filter((goal) => goal.completedDate).length;
  
        setTotalGoals(total);
        setCompletedGoals(completed);
  
        const completedGoals = goals.filter((goal) => goal.completedDate);
        const groupedWeeks = groupGoalsByWeek(completedGoals);
        console.log('Semanas agrupadas:', groupedWeeks); // Verifica cómo se agrupan las semanas
        const weeklyComparisons = compareWeeks(groupedWeeks);
  
        setComparisons(weeklyComparisons);
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadStats);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      ) : totalGoals === 0 ? (
        <Text style={styles.noGoalsText}>Aún no tienes objetivos creados.</Text>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.header}>Progreso General</Text>
            <Text style={styles.stat}>Total de objetivos: {totalGoals}</Text>
            <Text style={styles.stat}>Objetivos completados: {completedGoals}</Text>
            <Text style={styles.stat}>
              Progreso: {(completedGoals / (totalGoals || 1) * 100).toFixed(2)}%
            </Text>
            <ProgressChart collapsable={undefined} completed={completedGoals} total={totalGoals} />
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Comparación Semanal</Text>
            {comparisons.length === 0 ? (
              <Text style={styles.noComparisonsText}>No hay suficientes datos para comparar semanas.</Text>
            ) : (
              <FlatList
                data={comparisons}
                keyExtractor={(item) => item.week}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Text style={styles.week}>
                      Semana: {new Date(item.week).toLocaleDateString()}
                    </Text>
                    <Text style={styles.stat}>
                      Esta semana: {item.current} objetivos
                    </Text>
                    <Text style={styles.stat}>
                      Semana anterior: {item.previous || 0} objetivos
                    </Text>
                    <Text style={styles.stat}>
                      Cambio: {item.difference}% {item.difference > 0 ? '↑' : '↓'}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  section: { marginBottom: 30 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  stat: { fontSize: 18, marginBottom: 10 },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 18 },
  noGoalsText: { textAlign: 'center', marginTop: 20, fontSize: 18 },
  card: { padding: 15, backgroundColor: '#fff', marginBottom: 10 },
  week: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
});
