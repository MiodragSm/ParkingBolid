import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';

const HelpScreen = ({ navigation }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Kratko uputstvo</Text>
        <Text style={styles.text}>
          - Izaberite svoj grad i zonu parkiranja.{'\n\n'}
          - Dodajte registarke tablice u Podešavanjima.{'\n\n'}
          - Izaberite tablice i zonu, zatim pritisnite "Plati parking" da otvorite SMS aplikaciju.{'\n\n'}
          - Potvrdite i pošaljite SMS ručno.{'\n\n'}
          - Boje označavaju različite parking zone.{'\n\n'}
          - Registarske tablice su sačuvane lokalno na vašem uređaju.{'\n\n'}
          - Program automtski detektuje vašu lokaciju i najbliži grad.{'\n\n'}
          - Kompletna detekcija lokacije (Zonefensing) je opciona i još uvek nije implementirana.{'\n\n'}
          Uživajte u korištenju ParkingBolid-a :)!
        </Text>
      </ScrollView>
      {navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack() && (
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
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
  closeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 32,
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: '#000',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default HelpScreen;
