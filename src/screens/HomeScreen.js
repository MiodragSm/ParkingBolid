import React, { useContext, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CityPicker from '../components/CityPicker';
import { ZoneDataContext } from '../contexts/ZoneDataContext';
import { VehicleContext } from '../contexts/VehicleContext';
import VehiclePicker from '../components/VehiclePicker';
const HeaderRight = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
    <Text style={styles.headerIcon}>⚙️</Text>
  </TouchableOpacity>
);


const HomeScreen = () => {
  const navigation = useNavigation();
  const { cityZones, selectedZone, setSelectedZone } = useContext(ZoneDataContext);
  const { vehicles, selectedVehicle, loading } = useContext(VehicleContext);
  const hasChecked = React.useRef(false);

  const renderHeaderRight = React.useCallback(
    () => <HeaderRight navigation={navigation} />,
    [navigation]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
      title: 'ParkingBolid',
    });
  }, [navigation, renderHeaderRight]);

  React.useEffect(() => {
    if (loading || hasChecked.current) {return;}
    hasChecked.current = true;

    const validVehicles = vehicles ? vehicles.filter(v => v.plate && v.plate.trim() !== '') : [];
    if (validVehicles.length === 0) {
      navigation.navigate('Settings');
    }
  }, [vehicles, navigation, loading]);

  const handlePayParking = () => {
    if (!selectedZone || !selectedVehicle) {
      Alert.alert('Molimo izaberite zonu i tablice pre nego što platite parking!');
      return;
    }
    const smsNumber = selectedZone.smsBroj;
    const plate = selectedVehicle.plate.replace(/\s|-/g, '');
    const smsUrl = `sms:${smsNumber}?body=${plate}`;
    Linking.openURL(smsUrl).catch(() => Alert.alert('Neuspešno otvaranje SMS aplikacije'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.cityRow}>
        <Text style={styles.cityLabel}>Izabrani grad:</Text>
        <CityPicker />
      </View>

      <ScrollView contentContainerStyle={styles.zoneList}>
        {cityZones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.zoneButton,
              selectedZone && selectedZone.id === zone.id && styles.selectedZoneButton,
            ]}
            onPress={() => setSelectedZone(zone)}>
            <View style={styles.zoneRow}>
              <View style={styles.zoneLeft}>
                <Text style={[
                  styles.zoneText,
                  selectedZone && selectedZone.id === zone.id && styles.selectedZoneText,
                ]}>
                  {zone.skraceniNaziv}
                </Text>
              </View>
              <View style={styles.zoneMiddle}>
                <Text style={[
                  styles.zoneText,
                  selectedZone && selectedZone.id === zone.id && styles.selectedZoneText,
                ]}>
                  {zone.naziv ? zone.naziv : 'Zone description'}
                </Text>
              </View>
              <View style={styles.zoneRight}>
                <Text style={[
                  styles.zoneText,
                  selectedZone && selectedZone.id === zone.id && styles.selectedZoneText,
                ]}>
                  {zone.smsBroj}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {vehicles && vehicles.length > 0 && (
        <View style={styles.cityRow}>
          <Text style={styles.cityLabel}>Reg. Tablica:</Text>
          <VehiclePicker />
        </View>
      )}

      <TouchableOpacity style={styles.payButton} onPress={handlePayParking}>
        <Text style={styles.payButtonText}>Plati Parking</Text>
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
    paddingTop: 10,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 10,
  },
  zoneList: {
    padding: 10,
    width: '100%',
    alignItems: 'stretch',
  },
  zoneButton: {
    backgroundColor: '#333',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zoneLeft: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneMiddle: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneRight: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedZoneButton: {
    backgroundColor: 'green',
    borderWidth: 1,
    borderColor: '#fff',
  },
  selectedZoneText: {
    color: 'black',
    fontWeight: 'bold',
  },
  zoneText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
  addButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    width: '90%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcon: {
    color: '#fff',
    fontSize: 18,
    marginRight: 15,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  cityLabel: {
    color: '#fff',
    fontSize: 20,
    marginRight: 10,
  },
  nearestCityText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
  },
});

export default HomeScreen;
