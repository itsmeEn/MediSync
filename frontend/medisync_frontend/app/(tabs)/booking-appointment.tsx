// app/(main)/(tabs)/booking-appointment.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookingAppointmentScreen() { // Changed component name
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Your Appointment</Text> {/* Changed text */}
      {/* Your booking content will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});