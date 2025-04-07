import React, { useContext, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CityPicker from '../components/CityPicker';
import { ZoneDataContext } from '../contexts/ZoneDataContext';
import { VehicleContext } from '../contexts/VehicleContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { selectedCity, cityZones, selectedZone, setSelectedZone } = useContext(ZoneDataContext);
  const { vehicles, selectedVehicle, setSelectedVehicle } = useContext(VehicleContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={{ color: '#fff', fontSize: 18, marginRight: 15 }}>⚙️</Text>
        </TouchableOpacity>
      ),
      title: 'ParkingBolid',
    });
  }, [navigation]);

  const handlePayParking = () => {
    if (!selectedZone || !selectedVehicle) {
      Alert.alert('Please select a zone and a vehicle');
      return;
    }
    const smsNumber = selectedZone.smsBroj;
    const plate = selectedVehicle.plate.replace(/\s|-/g, '');
    const smsUrl = `sms:${smsNumber}?body=${plate}`;
    Linking.openURL(smsUrl).catch(() => Alert.alert('Failed to open SMS app'));
  };

  return (
    <View style={styles.container}>
      <CityPicker />
      <Text style={styles.text}>
        {selectedCity ? `Selected city: ${selectedCity.grad}` : 'No city selected'}
      </Text>

      <ScrollView contentContainerStyle={styles.zoneList}>
        {cityZones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneButton,
              selectedZone && selectedZone.id === zone.id && styles.selectedZoneButton,
            ]}
            onPress={() => setSelectedZone(zone)}>
            <Text style={styles.zoneText}>{zone.skraceniNaziv}</Text>
            <Text style={styles.zoneText}>{zone.smsBroj}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.text}>Select Vehicle:</Text>
      <ScrollView contentContainerStyle={styles.vehicleList}>
        {vehicles.map((vehicle, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.vehicleButton,
              selectedVehicle === vehicle && styles.selectedVehicleButton,
            ]}
            onPress={() => setSelectedVehicle(vehicle)}>
            <Text style={styles.vehicleText}>
              {vehicle.nickname ? `${vehicle.nickname} (${vehicle.plate})` : vehicle.plate}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.payButton} onPress={handlePayParking}>
        <Text style={styles.payButtonText}>Pay Parking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 10,
  },
  zoneList: {
    padding: 10,
    alignItems: 'center',
  },
  zoneButton: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  selectedZoneButton: {
    backgroundColor: '#555',
    borderWidth: 1,
    borderColor: '#fff',
  },
  zoneText: {
    color: '#fff',
    fontSize: 16,
  },
  vehicleList: {
    padding: 10,
    alignItems: 'center',
  },
  vehicleButton: {
    backgroundColor: '#333',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
  },
  selectedVehicleButton: {
    backgroundColor: '#555',
    borderWidth: 1,
    borderColor: '#fff',
  },
  vehicleText: {
    color: '#fff',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    width: '90%',
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
