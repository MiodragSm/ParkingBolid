import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { VehicleContext } from '../contexts/VehicleContext';

import { Modal } from 'react-native';

const SettingsScreen = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, clearVehicles } = useContext(VehicleContext);
  const clearAllVehicles = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to clear all licence plates? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, clear all',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearVehicles();
              Alert.alert('All licence plates cleared');
            } catch (error) {
              Alert.alert('Error clearing licence plates');
            }
          },
        },
      ]
    );
  };

  const showSavedVehicles = async () => {
    try {
      const stored = await require('@react-native-async-storage/async-storage').default.getItem('vehicles');
      if (stored) {
        const parsed = JSON.parse(stored);
        const list = parsed.map(
          (v, idx) => `${idx + 1}. ${v.nickname ? v.nickname + ' (' + v.plate + ')' : v.plate}`
        ).join('\n');
        Alert.alert('Saved Licence Plates', list || 'No licence plates saved');
      } else {
        Alert.alert('Saved Licence Plates', 'No licence plates saved');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load saved licence plates');
    }
  };
  const [plate, setPlate] = useState('');
  const [nickname, setNickname] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [firstPlateModalVisible, setFirstPlateModalVisible] = useState(false);

  React.useEffect(() => {
    const validVehicles = vehicles.filter(v => v.plate && v.plate.trim() !== '');
    if (validVehicles.length === 0) {
      setFirstPlateModalVisible(true);
    } else {
      setFirstPlateModalVisible(false);
    }
  }, [vehicles]);

  const handleSave = () => {
    const trimmedPlate = plate.trim();
    if (!trimmedPlate) {
      Alert.alert('Plate is required');
      return;
    }
    if (trimmedPlate.length < 7 || trimmedPlate.length > 8) {
      Alert.alert(
        'Invalid license plate',
        'License plate must have at least 7 and no more than 8 characters, using only capital letters, numbers, and Serbian letters (Č, Ć, Š, Ž, Đ).'
      );
      return;
    }
    if (nickname.trim().length > 12) {
      Alert.alert(
        'Invalid nickname',
        'Nickname must be no longer than 12 characters.'
      );
      return;
    }

    const vehicleData = { plate: plate.trim(), nickname: nickname.trim() };
    if (editIndex === null) {
      addVehicle(vehicleData);
    } else {
      updateVehicle(editIndex, vehicleData);
    }
    setPlate('');
    setNickname('');
    setEditIndex(null);
  };

  const handleEdit = (idx) => {
    const v = vehicles[idx];
    setPlate(v.plate);
    setNickname(v.nickname || '');
    setEditIndex(idx);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Manage Vehicles</Text>

        {vehicles
          .filter(v => v.plate && v.plate.trim() !== '')
          .map((v, idx) => (
            <View key={idx} style={styles.vehicleItem}>
              <Text style={styles.vehicleText}>
                {v.nickname ? `${v.plate} (${v.nickname})` : v.plate}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleEdit(idx)} style={styles.editButton}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteVehicle(idx)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        <TextInput
          style={styles.input}
          placeholder="Plate"
          placeholderTextColor="#888"
          value={plate}
          onChangeText={(text) => {
            const filtered = text
              .toUpperCase()
              .replace(/[^A-Z0-9ČĆŠŽĐ]/gi, '');
            setPlate(filtered);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Nickname (optional)"
          placeholderTextColor="#888"
          value={nickname}
          onChangeText={setNickname}
        />
        <TouchableOpacity style={[styles.addButton, { marginTop: 30 }]} onPress={handleSave}>
          <Text style={styles.addButtonText}>
            {editIndex === null ? 'ADD licence plate' : 'Update Vehicle'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#007AFF' }]} onPress={showSavedVehicles}>
          <Text style={styles.addButtonText}>Show saved licence plates</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: 'red', marginTop: 0 }]} onPress={clearAllVehicles}>
          <Text style={styles.addButtonText}>Clear all licence plates</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={firstPlateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFirstPlateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Please, enter here your first licence plate</Text>
            <TouchableOpacity
              style={[styles.addButton, { marginTop: 20 }]}
              onPress={() => setFirstPlateModalVisible(false)}>
              <Text style={styles.addButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  editButton: {
    backgroundColor: '#555',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  editText: {
    color: '#fff',
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
  bottomButtonContainer: {
    padding: 15,
    backgroundColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SettingsScreen;
