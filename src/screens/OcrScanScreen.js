import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import licensePlateCities from '../data/licensePlateCities.json';
import { extractLicensePlate, extractParkingZone } from '../utils/ocrUtils';
import PhotoManipulator from 'react-native-photo-manipulator';
import MlkitOcr from 'react-native-mlkit-ocr';
import CameraCapture from '../components/CameraCapture';
import { detectObjects } from '../utils/objectDetection';
import { preprocessImage } from '../utils/imagePreprocessing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { findCityByPlate } from '../utils/cityUtils';
import { isValidZoneForCity, getZonesForCity } from '../utils/zoneUtils';


const OcrScanScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [parkingZone, setParkingZone] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [detections, setDetections] = useState([]); // bounding boxes
  const [detectedCity, setDetectedCity] = useState(null);

  const [plateCandidates, setPlateCandidates] = useState([]);
  const [zoneCandidates, setZoneCandidates] = useState([]);
  const [zoneValid, setZoneValid] = useState(null); // true, false, or null

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const savedCity = await AsyncStorage.getItem('lastCity');
        const savedZone = await AsyncStorage.getItem('lastZone');
        if (savedCity) {
          const cityObj = licensePlateCities.find(c => c.grad === savedCity);
          if (cityObj) {setDetectedCity(cityObj);}
        }
        if (savedZone) {
          setParkingZone(savedZone);
        }
      } catch (e) {
        console.warn('Failed to load saved preferences', e);
      }
    };
    loadPrefs();
  }, []);

  useEffect(() => {
    const savePrefs = async () => {
      try {
        if (detectedCity?.grad) {
          await AsyncStorage.setItem('lastCity', detectedCity.grad);
        }
        if (parkingZone) {
          await AsyncStorage.setItem('lastZone', parkingZone);
        }
      } catch (e) {
        console.warn('Failed to save preferences', e);
      }
    };
    savePrefs();
  }, [detectedCity, parkingZone]);

  const handleImageCaptured = async (uri) => {
    setImageUri(uri);
    try {
      // Preprocess the image before detection and OCR
      const processedUri = await preprocessImage(uri);
      setImageUri(processedUri);

      // Detect license plates and signs
      const detectedBoxes = await detectObjects(processedUri);
      setDetections(detectedBoxes);

      let licensePlateText = '';
      let parkingZoneText = '';

      if (detectedBoxes.length > 0) {
        for (const det of detectedBoxes) {
          try {
            const croppedUri = await PhotoManipulator.crop(processedUri, {
              x: det.x,
              y: det.y,
              width: det.width,
              height: det.height,
            });

            const result = await MlkitOcr.recognize(croppedUri);

            if (det.label && det.label.toLowerCase().includes('plate')) {
              licensePlateText += ' ' + result.text;
            } else if (det.label && (det.label.toLowerCase().includes('sign') || det.label.toLowerCase().includes('zone'))) {
              parkingZoneText += ' ' + result.text;
            } else {
              // Unknown label, include in both
              licensePlateText += ' ' + result.text;
              parkingZoneText += ' ' + result.text;
            }
          } catch (cropOrOcrError) {
            console.warn('Error processing detection region:', cropOrOcrError);
          }
        }
      } else {
        // Fallback: run OCR on the full preprocessed image
        const result = await MlkitOcr.recognize(processedUri);
        licensePlateText = result.text;
        parkingZoneText = result.text;
      }

      console.log('OCR license plate text:', licensePlateText);
      console.log('OCR parking zone text:', parkingZoneText);

      if ((!licensePlateText || licensePlateText.trim() === '') && (!parkingZoneText || parkingZoneText.trim() === '')) {
        throw new Error('Empty OCR result');
      }

      const newPlateCandidates = extractLicensePlate(licensePlateText);
      const newZoneCandidates = extractParkingZone(parkingZoneText);

      setOcrText(`${licensePlateText}\n${parkingZoneText}`);

      setLicensePlate(newPlateCandidates.length > 0 ? newPlateCandidates[0] : '');
      setParkingZone(newZoneCandidates.length > 0 ? newZoneCandidates[0] : '');

      setPlateCandidates(newPlateCandidates);
      setZoneCandidates(newZoneCandidates);

      // Find city by license plate prefix
      const firstPlate = newPlateCandidates.length > 0 ? newPlateCandidates[0] : '';
      const firstZone = newZoneCandidates.length > 0 ? newZoneCandidates[0] : '';

      const city = findCityByPlate(firstPlate);
      setDetectedCity(city);

      // Validate parking zone for detected city
      if (city && firstZone) {
        const valid = isValidZoneForCity(city.grad, firstZone);
        setZoneValid(valid);
      } else {
        setZoneValid(null);
      }

      setShowResult(true);
    } catch (error) {
      console.warn('OCR failed or empty, redirecting to edit:', error);
      alert('Neuspešno prepoznavanje teksta. Pokušajte da uredite sliku.');
      setShowResult(false);
      // The UI will show the image with edit and retry buttons
    }
  };

  const handleEdit = async () => {
    if (!imageUri) {
      alert('Nema slike za obradu');
      return;
    }
    try {
      const editedUri = await PhotoManipulator.crop(imageUri, { x: 0, y: 0, width: 300, height: 300 });
      setImageUri(editedUri);
    } catch (error) {
      console.warn('Edit error:', error);
      alert('Greška pri obradi slike');
    }
  };

  const handleOcr = async () => {
    if (!imageUri) {
      alert('No image captured');
      return;
    }

    try {
      const result = await MlkitOcr.recognize(imageUri);
      const recognizedText = result.text;
      setOcrText(recognizedText);

      const plate = extractLicensePlate(recognizedText);
      const zone = extractParkingZone(recognizedText);

      setLicensePlate(plate || '');
      setParkingZone(zone || '');
      setShowResult(true);
    } catch (error) {
      console.error('OCR error:', error);
      alert('Failed to perform OCR');
    }
  };

  const handleConfirm = () => {
    alert(`Tablica: ${licensePlate}\nZona: ${parkingZone}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skeniranje tablice ili znaka</Text>
      {imageUri && !showResult && (
        <>
          <View style={{ position: 'relative' }}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            {detections.map((det, idx) => (
              <View
                key={idx}
                style={{
                  position: 'absolute',
                  left: det.x,
                  top: det.y,
                  width: det.width,
                  height: det.height,
                  borderWidth: 2,
                  borderColor: det.label === 'plate' ? 'yellow' : 'cyan',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                pointerEvents="none"
              >
                <Text style={{ color: '#fff', fontSize: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 2 }}>
                  {det.label} {det.confidence ? (det.confidence * 100).toFixed(1) + '%' : ''}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Uredi sliku</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleOcr}>
            <Text style={styles.buttonText}>Gotovo</Text>
          </TouchableOpacity>
        </>
      )}
      {showResult && (
          <View>
          <Text style={{ color: '#fff', marginTop: 10 }}>Izaberite registarski broj:</Text>
          <View>
            {plateCandidates.map((candidate, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setLicensePlate(candidate)}
                style={{
                  padding: 8,
                  marginVertical: 4,
                  backgroundColor: candidate === licensePlate ? '#4CAF50' : '#DDD',
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: '#000' }}>{candidate}</Text>
              </TouchableOpacity>
            ))}

            <Text style={{ color: '#fff', marginTop: 10 }}>Izaberite zonu:</Text>
            {zoneCandidates.map((candidate, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setParkingZone(candidate)}
                style={{
                  padding: 8,
                  marginVertical: 4,
                  backgroundColor: candidate === parkingZone ? '#4CAF50' : '#DDD',
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: '#000' }}>{candidate}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.title}>Prepoznati tekst</Text>
          <ScrollView style={{ maxHeight: 200, marginBottom: 20 }}>
            <Text style={{ color: '#fff' }}>{ocrText}</Text>
          </ScrollView>
          <TextInput
            style={styles.input}
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="Tablica"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            value={parkingZone}
            onChangeText={setParkingZone}
            placeholder="Zona"
            placeholderTextColor="#888"
          />
          <Text style={{ color: '#0f0', marginVertical: 10 }}>
            Izaberite grad:
          </Text>
          <Picker
            selectedValue={detectedCity?.grad || ''}
            style={{ backgroundColor: '#222', color: '#fff', width: '80%', marginVertical: 5 }}
            onValueChange={(itemValue) => {
              const cityObj = licensePlateCities.find(c => c.grad === itemValue);
              setDetectedCity(cityObj || null);
              // Revalidate zone
              if (cityObj && parkingZone) {
                const valid = isValidZoneForCity(cityObj.grad, parkingZone);
                setZoneValid(valid);
              } else {
                setZoneValid(null);
              }
            }}>
            <Picker.Item label="Izaberite grad" value="" />
            {licensePlateCities.map((city) => (
              <Picker.Item key={city.grad} label={city.grad} value={city.grad} />
            ))}
          </Picker>

          <Text style={{ color: '#0f0', marginVertical: 10 }}>
            Izaberite zonu:
          </Text>
          <Picker
            selectedValue={parkingZone}
            style={{ backgroundColor: '#222', color: '#fff', width: '80%', marginVertical: 5 }}
            onValueChange={(itemValue) => {
              setParkingZone(itemValue);
              if (detectedCity) {
                const valid = isValidZoneForCity(detectedCity.grad, itemValue);
                setZoneValid(valid);
              } else {
                setZoneValid(null);
              }
            }}>
            <Picker.Item label="Izaberite zonu" value="" />
            {(detectedCity ? getZonesForCity(detectedCity.grad) : []).map((zone) => (
              <Picker.Item key={zone} label={zone} value={zone} />
            ))}
          </Picker>

          {zoneValid === true && (
            <Text style={{ color: '#0f0', marginVertical: 5 }}>
              Zona je validna za {detectedCity?.grad}
            </Text>
          )}
          {zoneValid === false && (
            <Text style={{ color: 'orange', marginVertical: 5 }}>
              Upozorenje: Zona nije pronađena za {detectedCity?.grad}. Proverite ili izaberite ručno.
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Potvrdi</Text>
          </TouchableOpacity>
          </View>
      )}
      {!imageUri && !showResult && (
        <View style={{ flex: 1, width: '100%' }}>
          <CameraCapture onCapture={handleImageCaptured} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#fff', fontSize: 20, marginBottom: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginBottom: 20 },
  placeholder: { width: 300, height: 300, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  placeholderText: { color: '#fff' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, marginVertical: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  input: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 5, marginVertical: 10, width: '80%' },
});

export default OcrScanScreen;
