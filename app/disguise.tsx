import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useDispatch } from 'react-redux';
import { unlockSession } from '@/store/slices/periodSlice';
import { Colors } from '@/constants/FloColors';

const { width } = Dimensions.get('window');

export default function DisguiseScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [display, setDisplay] = useState('0');
  const [pin, setPin] = useState('');

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setPin('');
      return;
    }

    if (val === '=') {
      // Secret PIN check
      if (pin === '1234') {
        dispatch(unlockSession());
        router.replace('/(tabs)');
      } else {
        setDisplay('Error');
        setPin('');
      }
      return;
    }

    const nextPin = pin + val;
    setPin(nextPin);
    setDisplay(val); // Just show the last digit like a real calc sometimes does or keep showing total
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['C', '0', '=', '+'],
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.keypad}>
        {buttons.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity 
                key={btn} 
                style={[
                  styles.button, 
                  ['/', '*', '-', '+', '='].includes(btn) && styles.opButton,
                  btn === 'C' && styles.cButton
                ]}
                onPress={() => handlePress(btn)}
              >
                <Text style={styles.buttonText}>{btn}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E', justifyContent: 'flex-end' },
  displayContainer: { padding: 40, alignItems: 'flex-end' },
  displayText: { color: 'white', fontSize: 80, fontWeight: '300' },
  keypad: { paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  button: {
    width: width / 5,
    height: width / 5,
    borderRadius: width / 10,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 30, fontWeight: '500' },
  opButton: { backgroundColor: '#FF9F0A' },
  cButton: { backgroundColor: '#A5A5A5' },
});
