import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { VehicleContext } from '../contexts/VehicleContext';

const SettingsScreen = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useContext(VehicleContext);
  const [plate, setPlate] = useState('');
  const [nickname, setNickname] = useState('');

  const handleAdd = () => {
    if (!plate.trim()) {
      Alert.alert('Plate is required');
      return;
    }
    addVehicle({ plate: plate.trim(), nickname: nickname.trim() });
    setPlate('');
    setNickname('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Vehicles</Text>

      {vehicles.map((v, idx) => (
        <View key={idx} style={styles.vehicleItem}>
          <Text style={styles.vehicleText}>
            {v.nickname ? `${v.nickname} (${v.plate})` : v.plate}
          </Text>
          <TouchableOpacity onPress={() => deleteVehicle(idx)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Plate"
        placeholderTextColor="#888"
        value={plate}
        onChangeText={setPlate}
      />
      <TextInput
        style={styles.input}
        placeholder="Nickname (optional)"
        placeholderTextColor="#888"
        value={nickname}
        onChangeText={setNickname}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add Vehicle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  vehicleText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#900',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;