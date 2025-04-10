/**
 * Simulate OCR result parsing for license plates and parking zones.
 * In real implementation, pass ML Kit OCR results here.
 */

/**
 * Correct common OCR errors in license plates.
 * @param {string} text
 * @returns {string}
 */
function correctPlateErrors(text) {
  return text
    .replace(/[\s]/g, '') // remove spaces
    .replace(/0/g, 'O')   // zero to letter O
    .replace(/1/g, 'I')   // one to letter I
    .replace(/5/g, 'S')   // five to letter S
    .replace(/[^A-Z0-9ČĆŽŠĐ-]/gi, ''); // remove unwanted chars
}

/**
 * Extract and validate Serbian license plate from text.
 * @param {string} text
 * @returns {string|null}
 */
export function extractLicensePlate(text) {
  const cleaned = correctPlateErrors(text.toUpperCase());
  const plateRegex = /\b[A-ZČĆŽŠĐ]{1,2}-?\d{2,4}-?[A-ZČĆŽŠĐ]{1,2}\b/gi;
  const matches = cleaned.match(plateRegex);
  if (!matches) return [];

  // Rank candidates: prefer longer and more complete matches
  return matches.sort((a, b) => b.length - a.length);
}

/**
 * Extract and validate parking zone code from text.
 * @param {string} text
 * @returns {string|null}
 */
export function extractParkingZone(text) {
  const cleaned = text.replace(/\s+/g, '');
  const zoneRegex = /\b9\d{2,3}\b/g;
  const matches = cleaned.match(zoneRegex);
  if (!matches) return [];

  // Rank zones: prefer longer codes (4 digits over 3)
  return matches.sort((a, b) => b.length - a.length);
}
