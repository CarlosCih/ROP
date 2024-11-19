import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateGoal, getGoalById } from '../database/db';

export default function EditGoalScreen({ route, navigation }) {
  const { goalId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeUnit, setTimeUnit] = useState('');
  const [timeAmount, setTimeAmount] = useState('');
  const [subGoals, setSubGoals] = useState([]);
  const [newSubGoal, setNewSubGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const goal = await getGoalById(goalId);
        setTitle(goal?.title || '');
        setDescription(goal?.description || '');
        setSubGoals(Array.isArray(goal?.subGoals) ? goal.subGoals : []);

        if (goal?.timeUnit && goal?.timeAmount) {
          setTimeUnit(goal.timeUnit);
          setTimeAmount(goal.timeAmount.toString());
        } else if (goal?.deadline) {
          calculateTimeFromDeadline(new Date(goal.deadline));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el objetivo:', error);
        setLoading(false);
      }
    };

    const calculateTimeFromDeadline = (deadlineDate) => {
      const currentDate = new Date();
      const diffInMilliseconds = deadlineDate - currentDate;

      if (diffInMilliseconds > 0) {
        const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
        if (diffInDays % 7 === 0) {
          setTimeUnit('weeks');
          setTimeAmount((diffInDays / 7).toString());
        } else if (diffInDays % 30 === 0) {
          setTimeUnit('months');
          setTimeAmount((diffInDays / 30).toString());
        } else if (diffInDays % 365 === 0) {
          setTimeUnit('years');
          setTimeAmount((diffInDays / 365).toString());
        } else {
          setTimeUnit('');
          setTimeAmount(diffInDays.toString());
        }
      }
    };

    loadGoal();
  }, [goalId]);

  const addSubGoal = () => {
    if (!newSubGoal.trim()) return;
    setSubGoals((prev) => [...prev, { id: Date.now(), title: newSubGoal }]);
    setNewSubGoal('');
  };

  const removeSubGoal = (id) => {
    setSubGoals((prev) => prev.filter((subGoal) => subGoal.id !== id));
  };

  const calculateDeadline = () => {
    if (!timeUnit || !timeAmount) return null;
    const currentDate = new Date();
    const finalDate = new Date(currentDate);

    const timeMapping = {
      days: () => finalDate.setDate(currentDate.getDate() + parseInt(timeAmount)), // Cálculo para días
      weeks: () => finalDate.setDate(currentDate.getDate() + parseInt(timeAmount) * 7),
      months: () => finalDate.setMonth(currentDate.getMonth() + parseInt(timeAmount)),
      years: () => finalDate.setFullYear(currentDate.getFullYear() + parseInt(timeAmount)),
    };

    timeMapping[timeUnit]?.();
    return finalDate.toISOString();
  };


  const saveChanges = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const deadline = calculateDeadline();

    const updatedGoal = {
      id: goalId,
      title,
      description,
      deadline,
      timeUnit,
      timeAmount: parseInt(timeAmount) || null,
      subGoals,
    };

    await updateGoal(updatedGoal);
    alert('¡Objetivo actualizado con éxito!');
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título del Objetivo:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ejemplo: Leer un libro"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ejemplo: Leer 50 páginas al día"
        multiline
      />

      <Text style={styles.label}>Establecer Tiempo para Completar (Opcional):</Text>
      <View style={styles.timePickerContainer}>
        <TextInput
          style={styles.timeInput}
          value={timeAmount}
          onChangeText={setTimeAmount}
          keyboardType="numeric"
          placeholder="Cantidad"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={timeUnit}
            onValueChange={(itemValue) => setTimeUnit(itemValue)}
          >
            <Picker.Item label="Seleccionar unidad" value="" />
            <Picker.Item label="Días" value="days" />
            <Picker.Item label="Semanas" value="weeks" />
            <Picker.Item label="Meses" value="months" />
            <Picker.Item label="Años" value="years" />
          </Picker>
        </View>
      </View>

      <Text style={styles.label}>Subobjetivos:</Text>
      <TextInput
        style={styles.input}
        value={newSubGoal}
        onChangeText={setNewSubGoal}
        placeholder="Ejemplo: Terminar capítulo 1"
      />
      <TouchableOpacity style={styles.addSubGoalButton} onPress={addSubGoal}>
        <Text style={styles.addSubGoalButtonText}>Añadir Subobjetivo</Text>
      </TouchableOpacity>

      <FlatList
        data={Array.isArray(subGoals) ? subGoals : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.subGoalItem}>
            <Text>{item.title}</Text>
            <TouchableOpacity onPress={() => removeSubGoal(item.id)}>
              <Text style={styles.removeSubGoalText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ flexGrow: 0, width: '80%', marginBottom: 10 }}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#333',
    marginLeft: '10%',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 15,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '80%',
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginRight: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  addSubGoalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    width: '60%',
    marginBottom: 15,
  },
  addSubGoalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: '60%',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subGoalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    marginBottom: 8,
  },
  removeSubGoalText: {
    color: 'red',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
});
