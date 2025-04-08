import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & Instructions</Text>
      <Text style={styles.text}>
        - Select your city and parking zone.{'\n\n'}
        - Add your vehicle(s) in Settings.{'\n\n'}
        - Select a vehicle and zone, then tap "Pay Parking" to open SMS app.{'\n\n'}
        - Confirm and send the SMS manually.{'\n\n'}
        - Colors indicate different parking zones.{'\n\n'}
        - Your vehicles are saved locally on your device.{'\n\n'}
        - Location detection is optional and not yet implemented.{'\n\n'}
        Enjoy using ParkingBolid!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HelpScreen;
