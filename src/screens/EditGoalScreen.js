import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateGoal, getGoalById } from '../database/db';

export default function EditGoalScreen({ route, navigation }) {
  const { goalId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeUnit, setTimeUnit] = useState(''); // Usa una cadena vacía como valor inicial
  const [timeAmount, setTimeAmount] = useState('');
  const [subGoals, setSubGoals] = useState([]);
  const [newSubGoal, setNewSubGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const goal = await getGoalById(goalId);
        console.log('Datos cargados:', goal); // Debugging
        setTitle(goal?.title || '');
        setDescription(goal?.description || '');
        setTimeUnit(goal?.timeUnit || ''); // Predeterminado a cadena vacía
        setTimeAmount(goal?.timeAmount?.toString() || ''); // Convertir cantidad a cadena
        setSubGoals(Array.isArray(goal?.subGoals) ? goal.subGoals : []);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el objetivo:', error);
        setLoading(false);
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
    if (!timeUnit || !timeAmount) {
      console.log('No se pudo calcular el deadline: Falta timeUnit o timeAmount');
      return null;
    }
    const currentDate = new Date();
    const finalDate = new Date(currentDate);

    const timeMapping = {
      weeks: () => finalDate.setDate(currentDate.getDate() + parseInt(timeAmount) * 7),
      months: () => finalDate.setMonth(currentDate.getMonth() + parseInt(timeAmount)),
      years: () => finalDate.setFullYear(currentDate.getFullYear() + parseInt(timeAmount)),
    };

    timeMapping[timeUnit]?.();
    console.log('Deadline calculado:', finalDate.toISOString()); // Debugging
    return finalDate.toISOString();
  };

  const saveChanges = async () => {
    console.log('Valores antes de guardar:', { title, description, timeUnit, timeAmount }); // Debugging

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
      timeUnit, // Incluye la unidad de tiempo seleccionada
      timeAmount: parseInt(timeAmount) || null, // Guarda la cantidad de tiempo como número
      subGoals,
    };

    console.log('Datos para actualizar:', updatedGoal); // Debugging

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
    width: '80%',
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
    width: '80%',
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
