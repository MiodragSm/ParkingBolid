import React, { createContext, useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import parkingZonesData from '../data/parkingZones.json';
import licensePlateCities from '../data/licensePlateCities.json';

export const ZoneDataContext = createContext();

/**
 * ZoneDataProvider context:
 * - Loads parking zones and cities from JSON
 * - Detects nearest city via geolocation on startup
 * - Sets nearest city as default if user hasn't chosen
 * - Provides city list, selected city, zones for city, and selected zone
 */
export const ZoneDataProvider = ({ children }) => {
  const [zones, setZones] = useState([]); // Full parking zones data
  const [cities, setCities] = useState([]); // List of city names
  const [selectedCity, setSelectedCity] = useState(null); // User-selected or auto-detected city
  const [detectingCity, setDetectingCity] = useState(true); // Geolocation in progress flag
  const [selectedZone, setSelectedZone] = useState(null); // User-selected parking zone

  useEffect(() => {
    console.log('Loaded parkingZonesData:', parkingZonesData);
    try {
      if (
        parkingZonesData &&
        Array.isArray(parkingZonesData)
      ) {
        const zonesMap = {};
        parkingZonesData.forEach(cityObj => {
          zonesMap[cityObj.grad] = cityObj.zone;
        });
        setZones(zonesMap);
      } else if (
        parkingZonesData &&
        typeof parkingZonesData === 'object'
      ) {
        setZones(parkingZonesData);
      } else {
        console.log('Unexpected parkingZonesData format:', parkingZonesData);
        setZones({});
      }
      setCities(licensePlateCities.map(item => item.grad));
    } catch (error) {
      console.log('Error enriching zones:', error);
      Alert.alert('Greška pri učitavanju podataka o zonama parkiranja');
    }
    // Helper: calculate distance between two lat/lng points (Haversine formula)
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const detectNearestCity = async () => {
      try {
        let hasPermission = true;
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        // iOS permissions handled in Info.plist
        if (!hasPermission) {
          console.log('Location permission denied');
          return;
        }

        Geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            let nearest = null;
            let minDist = Infinity;
            for (const city of licensePlateCities) {
              if (city.latitude && city.longitude) {
                const dist = getDistance(latitude, longitude, city.latitude, city.longitude);
                if (dist < minDist) {
                  minDist = dist;
                  nearest = city;
                }
              }
            }
            if (nearest) {
              // If selectedCity is empty, null, or invalid, set to detected city
              setSelectedCity({ grad: nearest.grad });
            }
          },
          (error) => {
            console.log('Geolocation error:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
      } catch (error) {
        console.log('Error detecting city:', error);
      }
    };

    detectNearestCity().finally(() => setDetectingCity(false));
  }, []);

  const cityZones = selectedCity
    ? zones[selectedCity.grad] || []
    : [];

  return (
    <ZoneDataContext.Provider
      value={{
        zones,
        cities,
        selectedCity,
        setSelectedCity,
        detectingCity,
        cityZones,
        selectedZone,
        setSelectedZone,
      }}>
      {children}
    </ZoneDataContext.Provider>
  );
};
