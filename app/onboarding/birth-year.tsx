import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function BirthYearScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#AAAAAA' : '#666666';
  const primaryColor = '#FF5A76';

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Generate years from 1950 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

  const handleNext = () => {
    if (selectedYear) {
      // Save to state or context later
      router.push('/(tabs)'); // Go to main app for now, or next onboarding screen
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.content, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>When were you born?</ThemedText>
        <ThemedText style={[styles.subtitle, { color: subTextColor }]}>
          Your cycle can change with age. Knowing it helps us make better predictions.
        </ThemedText>

        <FlatList
          data={years}
          keyExtractor={(item) => item.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.yearItem, 
                { 
                  backgroundColor: selectedYear === item ? primaryColor : cardBgColor,
                  borderColor: selectedYear === item ? primaryColor : (isDark ? '#333' : '#E0E0E0')
                }
              ]}
              onPress={() => setSelectedYear(item)}
            >
              <ThemedText style={[
                styles.yearText, 
                { color: selectedYear === item ? '#FFFFFF' : textColor }
              ]}>
                {item}
              </ThemedText>
            </TouchableOpacity>
          )}
        />

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: selectedYear ? primaryColor : subTextColor }]} 
            onPress={handleNext}
            disabled={!selectedYear}
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  yearItem: {
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
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
