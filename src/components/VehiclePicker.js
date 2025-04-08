import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { VehicleContext } from '../contexts/VehicleContext';

const VehiclePicker = () => {
  const { vehicles, selectedVehicle, setSelectedVehicle } = useContext(VehicleContext);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.dropdownButton, { backgroundColor: 'green' }]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownButtonText}>
          {selectedVehicle
            ? (selectedVehicle.nickname
                ? `${selectedVehicle.plate} (${selectedVehicle.nickname})`
                : selectedVehicle.plate)
            : (vehicles.length > 0
                ? (vehicles[vehicles.length - 1].nickname
                    ? `${vehicles[vehicles.length - 1].plate} (${vehicles[vehicles.length - 1].nickname})`
                    : vehicles[vehicles.length - 1].plate)
                : 'Add licence plate')}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <ScrollView>
              {vehicles.map((vehicle, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => handleSelect(vehicle)}>
                  <Text style={styles.modalItemText}>
                    {vehicle.nickname
                      ? `${vehicle.nickname} (${vehicle.plate})`
                      : vehicle.plate}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  dropdownButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 18,
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
    maxHeight: '60%',
    width: '80%',
    paddingVertical: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  modalItemText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default VehiclePicker;
