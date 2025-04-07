import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import parkingZonesData from '../data/parkingZones.json';

export const ZoneDataContext = createContext();

export const ZoneDataProvider = ({ children }) => {
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    try {
      setZones(parkingZonesData);
      setCities(parkingZonesData.map(item => item.grad));
    } catch (error) {
      Alert.alert('Error loading parking zones data');
    }
  }, []);

  const cityZones = selectedCity
    ? zones.find((z) => z.grad === selectedCity.grad)?.zone || []
    : [];

  return (
    <ZoneDataContext.Provider
      value={{
        zones,
        cities,
        selectedCity,
        setSelectedCity,
        cityZones,
        selectedZone,
        setSelectedZone,
      }}>
      {children}
    </ZoneDataContext.Provider>
  );
};
