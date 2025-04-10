import parkingZones from '../data/parkingZones.json';

/**
 * Check if a parking zone code is valid for a given city.
 * @param {string} cityName - e.g., "Beograd"
 * @param {string} zoneCode - e.g., "9111"
 * @returns {boolean}
 */
export function isValidZoneForCity(cityName, zoneCode) {
  if (!cityName || !zoneCode) {return false;}
  const zones = parkingZones[cityName];
  if (!zones) {return false;}
  return zones.includes(zoneCode);
}

/**
 * Get all known zone codes for a city.
 * @param {string} cityName
 * @returns {string[]}
 */
export function getZonesForCity(cityName) {
  return parkingZones[cityName] || [];
}
