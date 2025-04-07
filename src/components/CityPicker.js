import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ZoneDataContext } from '../contexts/ZoneDataContext';

const CityPicker = () => {
  const { cities, selectedCity, setSelectedCity } = useContext(ZoneDataContext);

  return (
    <View style={styles.container}>
      {cities.map((cityName) => (
        <TouchableOpacity
          key={cityName}
          style={[
            styles.cityButton,
            selectedCity && selectedCity.grad === cityName && styles.selectedCityButton,
          ]}
          onPress={() => {
            setSelectedCity(
              (prev) => (prev && prev.grad === cityName ? prev : { grad: cityName })
            );
          }}>
          <Text style={styles.cityText}>{cityName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  cityButton: {
    backgroundColor: '#333',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedCityButton: {
    backgroundColor: '#555',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cityText: {
    color: '#fff',
  },
});

export default CityPicker;
