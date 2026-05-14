import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#AAAAAA' : '#666666';
  const primaryColor = '#FF5A76';

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeHealth, setAgreeHealth] = useState(false);
  const [agreeTracking, setAgreeTracking] = useState(false);

  const canProceed = agreeTerms && agreeHealth;

  const handleNext = () => {
    if (canProceed) {
      router.push('/onboarding/birth-year');
    }
  };

  const handleAcceptAll = () => {
    setAgreeTerms(true);
    setAgreeHealth(true);
    setAgreeTracking(true);
    // Auto proceed or let user click next? Let's just set state and let them click next or auto proceed.
    // In target app, clicking "Accept all" enabled "Next". Let's do that.
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.content, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Privacy first</ThemedText>
        
        <ThemedView style={styles.optionsContainer}>
          {/* Option 1 */}
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <Ionicons 
              name={agreeTerms ? "checkbox" : "square-outline"} 
              size={24} 
              color={agreeTerms ? primaryColor : subTextColor} 
            />
            <ThemedText style={[styles.optionText, { color: textColor }]}>
              I agree to Privacy Policy and Terms of Use.
            </ThemedText>
          </TouchableOpacity>

          {/* Option 2 */}
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => setAgreeHealth(!agreeHealth)}
          >
            <Ionicons 
              name={agreeHealth ? "checkbox" : "square-outline"} 
              size={24} 
              color={agreeHealth ? primaryColor : subTextColor} 
            />
            <ThemedText style={[styles.optionText, { color: textColor }]}>
              I agree to processing of my personal health data for providing me app functions.
            </ThemedText>
          </TouchableOpacity>

          {/* Option 3 */}
          <TouchableOpacity 
            style={styles.optionRow} 
            onPress={() => setAgreeTracking(!agreeTracking)}
          >
            <Ionicons 
              name={agreeTracking ? "checkbox" : "square-outline"} 
              size={24} 
              color={agreeTracking ? primaryColor : subTextColor} 
            />
            <ThemedText style={[styles.optionText, { color: textColor }]}>
              I agree to tracking my app activity to improve performance and promote services. (Optional)
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: cardBgColor, borderWidth: 1, borderColor: primaryColor }]} 
            onPress={handleAcceptAll}
          >
            <ThemedText style={[styles.buttonText, { color: primaryColor }]}>Accept all</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: canProceed ? primaryColor : subTextColor }]} 
            onPress={handleNext}
            disabled={!canProceed}
          >
            <ThemedText style={[styles.buttonText, { color: '#FFFFFF' }]}>Next</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
    marginBottom: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 40,
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
