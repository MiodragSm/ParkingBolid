import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & Instructions</Text>
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
