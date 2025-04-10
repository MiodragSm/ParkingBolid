/**
 * Object detection utilities for license plates and parking zone signs.
 *
 * This module uses a native module 'MlkitObjectDetectionModule' to perform on-device ML Kit detection.
 */

import { NativeModules } from 'react-native';
const { MlkitObjectDetectionModule } = NativeModules;

/**
 * Detect license plates and parking signs in an image.
 * @param {string} uri - Image URI.
 * @returns {Promise<Array<{x: number, y: number, width: number, height: number, label: string}>>}
 *          Array of bounding boxes with labels ('plate' or 'sign').
 */
export async function detectObjects(uri) {
  try {
    const results = await MlkitObjectDetectionModule.detectObjects(uri);
    // Expected format: [{ x, y, width, height, label, confidence }]
    // Sort by confidence descending
    return results.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  } catch (error) {
    console.warn('ML Kit object detection failed:', error);
    return [];
  }
}
