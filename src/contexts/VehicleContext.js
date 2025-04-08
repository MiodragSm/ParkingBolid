import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const stored = await AsyncStorage.getItem('vehicles');
        if (stored) {
          const parsed = JSON.parse(stored);
          setVehicles(parsed);
          if (parsed.length > 0) {setSelectedVehicle(parsed[0]);}
        }
      } catch (error) {
        Alert.alert('Greška pri učitavanju registarskih oznaka');
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  const saveVehicles = async (newVehicles) => {
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(newVehicles));
    } catch (error) {
      Alert.alert('Greška pri snimanju registarskih oznaka');
    }
  };

  const addVehicle = (vehicle) => {
    const updated = [...vehicles, vehicle];
    setVehicles(updated);
    saveVehicles(updated);
  };

  const updateVehicle = (index, updatedVehicle) => {
    const updated = vehicles.map((v, i) => (i === index ? updatedVehicle : v));
    setVehicles(updated);
    saveVehicles(updated);
  };

  const deleteVehicle = (index) => {
    const updated = vehicles.filter((_, i) => i !== index);
    setVehicles(updated);
    saveVehicles(updated);
    if (selectedVehicle && vehicles[index] === selectedVehicle) {
      setSelectedVehicle(updated[0] || null);
    }
  };
  const clearVehicles = async () => {
    try {
      setVehicles([]);
      setSelectedVehicle(null);
      await AsyncStorage.setItem('vehicles', JSON.stringify([]));
    } catch (error) {
      Alert.alert('Greška pri brisanju registrarskih oznaka');
    }
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicle,
        setSelectedVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        clearVehicles,
        loading,
      }}>
      {children}
    </VehicleContext.Provider>
  );
};
