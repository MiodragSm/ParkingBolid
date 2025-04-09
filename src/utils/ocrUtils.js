/**
 * Simulate OCR result parsing for license plates and parking zones.
 * In real implementation, pass ML Kit OCR results here.
 */

export function extractLicensePlate(text) {
  // Example regex for Serbian license plates: BG123AB, NS456CD, etc.
  const plateRegex = /\b[A-ZČĆŽŠĐ]{1,2}\s?\d{2,4}\s?[A-ZČĆŽŠĐ]{1,2}\b/gi;
  const matches = text.match(plateRegex);
  return matches ? matches[0] : null;
}

export function extractParkingZone(text) {
  // Example: Zone A, Zone 1, Zona 2, etc.
  const zoneRegex = /\b(Zona|Zone)\s?[A-Z0-9]+\b/gi;
  const matches = text.match(zoneRegex);
  return matches ? matches[0] : null;
}