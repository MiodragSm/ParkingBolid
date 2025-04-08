
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ZoneDataContext } from '../contexts/ZoneDataContext';

const CityPicker = () => {
  const { cities, selectedCity, setSelectedCity, detectingCity, detectedCity } = useContext(ZoneDataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (detectedCity && !selectedCity) {
      setSelectedCity(detectedCity);
    }
  }, [detectedCity, selectedCity, setSelectedCity]);

  const handleSelect = (cityName) => {
    setSelectedCity({ grad: cityName });
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          selectedCity && selectedCity.grad && selectedCity.grad.trim() !== ''
            ? styles.dropdownButtonSelected
            : null,
        ]}
        onPress={() => setModalVisible(true)}>
        <Text
          style={[
            styles.dropdownButtonText,
            selectedCity && selectedCity.grad && selectedCity.grad.trim() !== ''
              ? styles.dropdownButtonTextSelected
              : null,
          ]}>
          {detectingCity
            ? 'Detecting city...'
            : selectedCity && selectedCity.grad && selectedCity.grad.trim() !== ''
            ? selectedCity.grad
            : 'Select City'}
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
            <TextInput
              style={styles.searchInput}
              placeholder="Pretraži grad..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView>
              {cities
                .filter((cityName) =>
                  cityName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((cityName) => (
                  <TouchableOpacity
                    key={cityName}
                    style={styles.modalItem}
                    onPress={() => handleSelect(cityName)}>
                    <Text style={styles.modalItemText}>{cityName}</Text>
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
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 10,
    fontSize: 16,
  },
  dropdownButtonSelected: {
    backgroundColor: 'green',
  },
  dropdownButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CityPicker;
