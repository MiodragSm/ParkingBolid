import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { VehicleContext } from '../contexts/VehicleContext';

import { Modal } from 'react-native';

const SettingsScreen = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, clearVehicles } = useContext(VehicleContext);
  // Removed clearAllVehicles function

  const showSavedVehicles = async () => {
    try {
      const stored = await require('@react-native-async-storage/async-storage').default.getItem('vehicles');
      if (stored) {
        const parsed = JSON.parse(stored);
        const list = parsed.map(
          (v, idx) => `${idx + 1}. ${v.nickname ? v.nickname + ' (' + v.plate + ')' : v.plate}`
        ).join('\n');
        Alert.alert('Sačuvane tablice', list || 'Nema sačuvanih tablica');
      } else {
        Alert.alert('Sačuvane tablice', 'Nema sačuvanih tablica');
      }
    } catch (error) {
      Alert.alert('Greška', 'Neuspešno učitavanje sačuvanih tablica');
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
      Alert.alert('Tablica je obavezna');
      return;
    }
    if (trimmedPlate.length < 7 || trimmedPlate.length > 8) {
      Alert.alert(
        'Neispravno ime tablice',
        'Tablica mora imati najmanje 7 i najviše 8 karaktera, koristeći samo velika slova, brojeve i srpska slova (Č, Ć, Š, Ž, Đ).'
      );
      return;
    }
    if (nickname.trim().length > 12) {
      Alert.alert(
        'Neispravan nadimak',
        'Nadimak ne sme biti duži od 12 karaktera.'
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
        <Text style={styles.title}>Upravljanje Reg. Tablicama</Text>

        {vehicles
          .filter(v => v.plate && v.plate.trim() !== '')
          .map((v, idx) => (
            <View key={idx} style={styles.vehicleItem}>
              <Text style={styles.vehicleText}>
                {v.nickname ? `${v.plate} (${v.nickname})` : v.plate}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleEdit(idx)} style={styles.editButton}>
                  <Text style={styles.editText}>Izmeni</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteVehicle(idx)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Obriši</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        <TextInput
          style={styles.input}
          placeholder="Tablica"
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
          placeholder="Nadimak (opciono)"
          placeholderTextColor="#888"
          value={nickname}
          onChangeText={setNickname}
        />
        <TouchableOpacity style={[styles.addButton, { marginTop: 30 }]} onPress={handleSave}>
          <Text style={styles.addButtonText}>
            {editIndex === null ? 'Dodaj tablicu' : 'Ažuriraj tablicu'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#007AFF' }]} onPress={showSavedVehicles}>
          <Text style={styles.addButtonText}>Prikaži sačuvane tablice</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Removed Obriši sve tablice button */}

      <Modal
        visible={firstPlateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFirstPlateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Unesite ovde vašu prvu tablicu</Text>
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
