import React, { createContext, useState, useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
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
            for (const city of parkingZonesData) {
              if (city.lat && city.lng) {
                const dist = getDistance(latitude, longitude, city.lat, city.lng);
                if (dist < minDist) {
                  minDist = dist;
                  nearest = city;
                }
              }
            }
            if (nearest) {
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

    detectNearestCity();
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
