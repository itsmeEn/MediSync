import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const handleSignup = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // TODO: Handle signup logic
      alert('Signup successful!');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Sign Up</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
      <Button title="Sign Up" onPress={handleSignup} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 8,
    marginBottom: 4,
  },
}); 