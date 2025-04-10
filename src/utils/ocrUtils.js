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
    .replace(/[\s]/g, '') // remove spaces, as plates don't contain spaces
    // Correct common OCR misrecognitions:
    .replace(/0/g, 'O')   // zero often mistaken for letter O
    .replace(/1/g, 'I')   // one often mistaken for letter I
    .replace(/5/g, 'S')   // five often mistaken for letter S
    // Remove any characters not valid in Serbian plates (letters, digits, dash)
    .replace(/[^A-Z0-9ČĆŽŠĐ-]/gi, '');
}

/**
 * Extract and validate Serbian license plate from text.
 * @param {string} text
 * @returns {string|null}
 */
export function extractLicensePlate(text) {
  const cleaned = correctPlateErrors(text.toUpperCase());
  // Serbian license plate format: 1-2 letters, 2-4 digits, 1-2 letters, with optional dashes
  const plateRegex = /\b[A-ZČĆŽŠĐ]{1,2}-?\d{2,4}-?[A-ZČĆŽŠĐ]{1,2}\b/gi;
  const matches = cleaned.match(plateRegex);
  if (!matches) {return [];}

  // Rank candidates: prefer longer and more complete matches (more likely to be valid plates)
  return matches.sort((a, b) => b.length - a.length);
  // The UI can suggest the top candidate or allow user to pick from this list
}

/**
 * Extract and validate parking zone code from text.
 * @param {string} text
 * @returns {string|null}
 */
export function extractParkingZone(text) {
  const cleaned = text.replace(/\s+/g, '');
  // Serbian parking zone codes typically start with '9' and have 3-4 digits
  const zoneRegex = /\b9\d{2,3}\b/g;
  const matches = cleaned.match(zoneRegex);
  if (!matches) {return [];}

  // Rank zones: prefer longer codes (4 digits over 3), as they are more specific
  return matches.sort((a, b) => b.length - a.length);
  // The UI can suggest the top candidate or allow user to pick from this list
}
