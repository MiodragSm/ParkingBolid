import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import licensePlateCities from '../data/licensePlateCities.json';
import { extractLicensePlate, extractParkingZone } from '../utils/ocrUtils';
import PhotoManipulator from 'react-native-photo-manipulator';
import TextRecognition from 'react-native-text-recognition';
import CameraCapture from '../components/CameraCapture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { findCityByPlate } from '../utils/cityUtils';
import { isValidZoneForCity, getZonesForCity } from '../utils/zoneUtils';


const OcrScanScreen = ({ navigation, route }) => {
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
  // If navigated with imageUri param, start OCR immediately
  useEffect(() => {
    if (route?.params?.imageUri && !imageUri) {
      handleImageCaptured(route.params.imageUri);
    }
  }, [route, imageUri]);


  const handleImageCaptured = async (uri) => {
    console.log('handleImageCaptured called with URI:', uri);
    try {
      setImageUri(uri);
      console.log('Starting simplified OCR pipeline...');

      const lines = await TextRecognition.recognize(uri);
      const recognizedText = lines.join('\n');
      console.log('OCR result:', recognizedText);

      if (!recognizedText || recognizedText.trim() === '') {
        throw new Error('Empty OCR result');
      }

      setOcrText(recognizedText);

      const plateCandidates = extractLicensePlate(recognizedText);
      const zoneCandidates = extractParkingZone(recognizedText);

      console.log('Extracted plate candidates:', plateCandidates);
      console.log('Extracted zone candidates:', zoneCandidates);

      setLicensePlate(plateCandidates.length > 0 ? plateCandidates[0] : '');
      setParkingZone(zoneCandidates.length > 0 ? zoneCandidates[0] : '');

      setPlateCandidates(plateCandidates);
      setZoneCandidates(zoneCandidates);

      const firstPlate = plateCandidates.length > 0 ? plateCandidates[0] : '';
      const firstZone = zoneCandidates.length > 0 ? zoneCandidates[0] : '';

      const city = findCityByPlate(firstPlate);
      console.log('Detected city:', city);
      setDetectedCity(city);

      if (city && firstZone) {
        const valid = isValidZoneForCity(city.grad, firstZone);
        console.log('Zone valid for city:', valid);
        setZoneValid(valid);
      } else {
        setZoneValid(null);
      }

      setShowResult(true);
    } catch (error) {
      console.warn('OCR failed or empty, redirecting to edit:', error);
      alert('Neuspešno prepoznavanje teksta. Pokušajte da uredite sliku.');
      setShowResult(false);
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
      const lines = await TextRecognition.recognize(imageUri);
      const result = { text: lines.join('\n') };
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
