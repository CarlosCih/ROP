import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Asegúrate de tener esta biblioteca instalada
import { insertGoal } from '../database/db';

export default function GoalScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeUnit, setTimeUnit] = useState(''); // Unidad de tiempo (semana, mes, año)
    const [timeAmount, setTimeAmount] = useState(''); // Cantidad de tiempo (1, 2, 3...)
    const [subGoals, setSubGoals] = useState([]); // Lista de subobjetivos
    const [newSubGoal, setNewSubGoal] = useState(''); // Nuevo subobjetivo a agregar

    const calculateDeadline = useCallback(() => {
        if (!timeUnit || !timeAmount) return null; // Si falta información, no calcula
        const currentDate = new Date();
        const finalDate = new Date(currentDate);

        const timeMapping = {
            days: () => finalDate.setDate(currentDate.getDate() + parseInt(timeAmount)), // Cálculo para días
            weeks: () => finalDate.setDate(currentDate.getDate() + parseInt(timeAmount) * 7),
            months: () => finalDate.setMonth(currentDate.getMonth() + parseInt(timeAmount)),
            years: () => finalDate.setFullYear(currentDate.getFullYear() + parseInt(timeAmount)),
        };

        timeMapping[timeUnit]?.(); // Aplica la transformación según la unidad seleccionada
        return finalDate;
    }, [timeUnit, timeAmount]);


    const addSubGoal = useCallback(() => {
        if (!newSubGoal.trim()) return; // Evita agregar subobjetivos vacíos
        setSubGoals((prev) => [...prev, { id: Date.now(), title: newSubGoal }]);
        setNewSubGoal('');
    }, [newSubGoal]);

    const removeSubGoal = useCallback(
        (id) => setSubGoals((prev) => prev.filter((subGoal) => subGoal.id !== id)),
        []
    );

    const saveGoal = useCallback(async () => {
        if (!title.trim() || !description.trim() || !timeUnit) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        const deadline = calculateDeadline();
        await insertGoal(
            title,
            description,
            deadline ? deadline.toISOString() : null, // Guarda la fecha límite en formato ISO
            subGoals
        );
        alert('¡Objetivo guardado con éxito!');
        navigation.goBack();
    }, [title, description, timeUnit, subGoals, calculateDeadline, navigation]);

    return (
        <View style={styles.container}>
            {/* Campo para el título del objetivo */}
            <InputField label="Título del Objetivo:" value={title} onChangeText={setTitle} placeholder="Ejemplo: Leer un libro" />

            {/* Campo para la descripción */}
            <InputField
                label="Descripción:"
                value={description}
                onChangeText={setDescription}
                placeholder="Ejemplo: Leer 50 páginas al día"
                multiline
            />

            {/* Campo para tiempo */}
            <Text style={styles.label}>Establecer Tiempo para Completar (Opcional):</Text>
            <View style={styles.timePickerContainer}>
                <TextInput
                    style={styles.timeInput}
                    value={timeAmount}
                    onChangeText={setTimeAmount}
                    keyboardType="numeric"
                    placeholder="Cantidad"
                />
                <RNPickerSelect
                    onValueChange={(value) => setTimeUnit(value)}
                    items={[
                        { label: 'Días', value: 'days' }, // Nueva opción
                        { label: 'Semanas', value: 'weeks' },
                        { label: 'Meses', value: 'months' },
                        { label: 'Años', value: 'years' },
                    ]}
                    placeholder={{ label: 'Seleccionar unidad', value: '' }}
                    value={timeUnit || ''}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                />

            </View>

            {/* Subobjetivos */}
            <InputField label="Subobjetivos:" value={newSubGoal} onChangeText={setNewSubGoal} placeholder="Ejemplo: Terminar capítulo 1" />
            <TouchableOpacity style={styles.addSubGoalButton} onPress={addSubGoal}>
                <Text style={styles.addSubGoalButtonText}>Añadir Subobjetivo</Text>
            </TouchableOpacity>
            <FlatList
                data={subGoals}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <SubGoalItem title={item.title} onDelete={() => removeSubGoal(item.id)} />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
                style={{ flexGrow: 0, width: '80%', marginBottom: 10 }}
            />

            {/* Botón para guardar */}
            <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
                <Text style={styles.saveButtonText}>Guardar Objetivo</Text>
            </TouchableOpacity>
        </View>
    );
}

// Componente reutilizable para entradas de texto
const InputField = ({ label, ...props }) => (
    <>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...props} />
    </>
);

// Componente reutilizable para mostrar subobjetivos
const SubGoalItem = React.memo(({ title, onDelete }) => (
    <View style={styles.subGoalItem}>
        <Text>{title}</Text>
        <TouchableOpacity onPress={onDelete}>
            <Text style={styles.removeSubGoalText}>Eliminar</Text>
        </TouchableOpacity>
    </View>
));

// Estilos
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
});

// Estilos específicos del selector
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
