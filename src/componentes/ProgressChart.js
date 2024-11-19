import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'react-native-progress';

const ProgressChart = ({ completed, total }) => {
  const progress = total > 0 ? completed / total : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progreso General</Text>
      <Circle
        size={150}
        progress={progress}
        showsText
        textStyle={styles.progressText}
        thickness={10}
        color="#4caf50"
        unfilledColor="#e0e0e0"
        borderWidth={0}
      />
      <Text style={styles.description}>
        {completed} de {total} objetivos completados
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default ProgressChart;
