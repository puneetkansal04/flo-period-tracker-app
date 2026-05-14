import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setGoal } from '@/store/slices/periodSlice';
import { Ionicons } from '@expo/vector-icons';

export default function GoalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#AAAAAA' : '#666666';
  const primaryColor = '#FF5A76';

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    { id: 'track', title: 'Track my cycle', icon: 'calendar-outline' },
    { id: 'pregnant', title: 'Get pregnant', icon: 'heart-outline' },
    { id: 'pregnancy', title: 'Track pregnancy', icon: 'analytics-outline' }, // Or something related to pregnancy
  ];

  const dispatch = useDispatch();
  const handleNext = () => {
    if (selectedGoal) {
      dispatch(setGoal(selectedGoal));
      router.push('/onboarding/cycle-length');
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.content, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>What is your main goal?</ThemedText>
        
        <ThemedView style={styles.optionsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity 
              key={goal.id}
              style={[
                styles.goalItem, 
                { 
                  backgroundColor: cardBgColor,
                  borderColor: selectedGoal === goal.id ? primaryColor : (isDark ? '#333' : '#E0E0E0'),
                  borderWidth: selectedGoal === goal.id ? 2 : 1
                }
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <Ionicons name={goal.icon as any} size={28} color={primaryColor} style={styles.icon} />
              <ThemedText style={[styles.goalText, { color: textColor }]}>{goal.title}</ThemedText>
              {selectedGoal === goal.id && (
                <Ionicons name="checkmark-circle" size={24} color={primaryColor} />
              )}
            </TouchableOpacity>
          ))}
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: selectedGoal ? primaryColor : subTextColor }]} 
            onPress={handleNext}
            disabled={!selectedGoal}
          >
            <ThemedText style={[styles.buttonText, { color: '#FFFFFF' }]}>Next</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 15,
    flex: 1,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 20,
  },
  button: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
