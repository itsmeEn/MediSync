import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Dimensions, Platform, Easing } from 'react-native';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#286660';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RoleSelectionScreen() {
  // Animated rotation for the logo
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleRoleSelect = () => {
    router.replace('/auth/signup');
  };

  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.logoRow}>
        <Animated.Image
          source={require('../../assets/images/logo.png')}
          style={[styles.logo, { transform: [{ rotate }] }]}
        />
        <Text style={styles.logoText}>MediSync</Text>
      </View>
      {/* Question */}
      <Text style={styles.question}>Which role best describes you?</Text>
      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.roleButton} onPress={handleRoleSelect}>
          <Text style={styles.roleButtonText}>Physician</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={handleRoleSelect}>
          <Text style={styles.roleButtonText}>Nurse</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.roleButton, styles.patientButton]} onPress={handleRoleSelect}>
        <Text style={styles.roleButtonText}>Patient</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 48,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 32,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    fontFamily: Platform.OS === 'web' ? undefined : 'System',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#18304a',
    marginTop: 40,
    marginBottom: 36,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  roleButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 36,
    marginHorizontal: 12,
    marginBottom: 0,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  patientButton: {
    alignSelf: 'center',
    marginTop: 18,
    minWidth: 220,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? undefined : 'System',
  },
});
