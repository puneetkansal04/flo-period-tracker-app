import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function CycleLengthScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#AAAAAA' : '#666666';
  const primaryColor = '#FF5A76';

  const [selectedLength, setSelectedLength] = useState<number>(28);

  // Generate cycle lengths from 20 to 45
  const lengths = Array.from({ length: 45 - 20 + 1 }, (_, i) => 20 + i);

  const handleNext = () => {
    router.push('/onboarding/period-length');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.content, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>How long is your cycle?</ThemedText>
        <ThemedText style={[styles.subtitle, { color: subTextColor }]}>
          The number of days between the first day of one period and the first day of the next.
        </ThemedText>

        <FlatList
          data={lengths}
          keyExtractor={(item) => item.toString()}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.item, 
                { 
                  backgroundColor: selectedLength === item ? primaryColor : cardBgColor,
                  borderColor: selectedLength === item ? primaryColor : (isDark ? '#333' : '#E0E0E0')
                }
              ]}
              onPress={() => setSelectedLength(item)}
            >
              <ThemedText style={[
                styles.itemText, 
                { color: selectedLength === item ? '#FFFFFF' : textColor }
              ]}>
                {item} days
              </ThemedText>
            </TouchableOpacity>
          )}
        />

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: primaryColor }]} 
            onPress={handleNext}
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
  item: {
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
  itemText: {
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
