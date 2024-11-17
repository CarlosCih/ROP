import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateGoal, getGoalById } from '../database/db';

export default function EditGoalScreen({ route, navigation }) {
  const { goalId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeUnit, setTimeUnit] = useState(null);
  const [timeAmount, setTimeAmount] = useState('');
  const [subGoals, setSubGoals] = useState([]);
  const [newSubGoal, setNewSubGoal] = useState('');

  // Cargar datos del objetivo
  useEffect(() => {
    const loadGoal = async () => {
      const goal = await getGoalById(goalId);
      setTitle(goal.title);
      setDescription(goal.description);
      setTimeUnit(goal.timeUnit);
      setTimeAmount(goal.timeAmount?.toString());
      setSubGoals(goal.subGoals || []);
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

  const saveChanges = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const updatedGoal = {
      id: goalId,
      title,
      description,
      timeUnit,
      timeAmount: parseInt(timeAmount) || null,
      subGoals,
    };

    await updateGoal(updatedGoal);
    alert('¡Objetivo actualizado con éxito!');
    navigation.goBack();
  };

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
          <Picker selectedValue={timeUnit} onValueChange={(itemValue) => setTimeUnit(itemValue)}>
            <Picker.Item label="Seleccionar unidad" value={null} />
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
                data={subGoals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SubGoalItem title={item.title} onDelete={() => removeSubGoal(item.id)} />
                )}
                contentContainerStyle={{
                    paddingBottom: 20, // Espacio adicional si se necesita
                }}
                style={{
                    flexGrow: 0, // Evita que ocupe espacio adicional
                    width: '80%', // Ajusta al ancho necesario
                    marginBottom: 10, // Espaciado debajo de la lista
                }}
            />

      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Permite que el contenido crezca dinámicamente
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
    addSubGoalButton: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      borderRadius: 6,
      alignItems: 'center',
      width: '20%',
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
      width: '20%',
      marginTop: 20, // Ajusta el espacio superior
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
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
  });
  

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
});
