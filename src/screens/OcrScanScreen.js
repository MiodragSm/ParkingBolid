import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { extractLicensePlate, extractParkingZone } from '../utils/ocrUtils';
import PhotoManipulator from 'react-native-photo-manipulator';
import MlkitOcr from 'react-native-mlkit-ocr';
import CameraCapture from '../components/CameraCapture';


const OcrScanScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [parkingZone, setParkingZone] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleImageCaptured = async (uri) => {
    setImageUri(uri);
    try {
      const result = await MlkitOcr.recognize(uri);
      const recognizedText = result.text;
      console.log('OCR result:', recognizedText);
      if (!recognizedText || recognizedText.trim() === '') {
        throw new Error('Empty OCR result');
      }

      setOcrText(recognizedText);

      const plate = extractLicensePlate(recognizedText);
      const zone = extractParkingZone(recognizedText);

      setLicensePlate(plate || '');
      setParkingZone(zone || '');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Skeniranje tablice ili znaka</Text>
      {imageUri && !showResult && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Text style={styles.buttonText}>Uredi sliku</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleOcr}>
            <Text style={styles.buttonText}>Gotovo</Text>
          </TouchableOpacity>
        </>
      )}
      {showResult && (
        <>
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
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Potvrdi</Text>
          </TouchableOpacity>
        </>
      )}
      {!imageUri && !showResult && (
        <View style={{ flex: 1, width: '100%' }}>
          <CameraCapture onCapture={handleImageCaptured} />
        </View>
      )}
    </ScrollView>
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
