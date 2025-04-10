import cities from '../data/licensePlateCities.json';

/**
 * Find city info by license plate prefix.
 * @param {string} plateText - Recognized license plate text.
 * @returns {{grad: string, registracijaPrefix: string, latitude: number, longitude: number} | null}
 */
export function findCityByPlate(plateText) {
  if (!plateText) {return null;}
  const prefixMatch = plateText.match(/^([A-ZČĆŽŠĐ]{1,2})/);
  if (!prefixMatch) {return null;}
  const prefix = prefixMatch[1].toUpperCase();

  return cities.find(c => c.registracijaPrefix.toUpperCase() === prefix) || null;
}
