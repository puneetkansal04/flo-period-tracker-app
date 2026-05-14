import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Mock data for now
  const cycleDay = 5;
  const cycleLength = 28;
  const statusText = "Period: Day 5";
  const predictionText = "Ovulation in 9 days";

  // Premium colors
  const primaryColor = '#FF5A76'; // Soft pink
  const secondaryColor = '#8A56AC'; // Purple
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#AAAAAA' : '#666666';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor }]}>
        <ThemedView style={styles.headerLeft}>
          <ThemedText type="title" style={styles.title}>May 14</ThemedText>
          <ThemedText style={[styles.subtitle, { color: subTextColor }]}>Cycle Day {cycleDay}</ThemedText>
        </ThemedView>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color={primaryColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* Main Circular Status */}
      <ThemedView style={[styles.statusContainer, { backgroundColor }]}>
        <ThemedView style={[styles.outerCircle, { borderColor: isDark ? '#333' : '#E0E0E0' }]}>
          <ThemedView style={[styles.innerCircle, { backgroundColor: cardBgColor }]}>
            <ThemedText style={[styles.circleText, { color: primaryColor }]}>{statusText}</ThemedText>
            <ThemedText style={[styles.circleSubText, { color: subTextColor }]}>{predictionText}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Action Cards */}
      <ThemedView style={[styles.actionsContainer, { backgroundColor }]}>
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]}>
          <ThemedView style={[styles.iconContainer, { backgroundColor: '#FFE5E9' }]}>
            <Ionicons name="water" size={24} color={primaryColor} />
          </ThemedView>
          <ThemedView style={styles.cardTextContainer}>
            <ThemedText type="subtitle" style={{ color: textColor }}>Log Symptoms</ThemedText>
            <ThemedText style={{ color: subTextColor }}>Mood, flow, pain...</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]}>
          <ThemedView style={[styles.iconContainer, { backgroundColor: '#E8F0FE' }]}>
            <Ionicons name="calendar" size={24} color="#1A73E8" />
          </ThemedView>
          <ThemedView style={styles.cardTextContainer}>
            <ThemedText type="subtitle" style={{ color: textColor }}>Edit Period</ThemedText>
            <ThemedText style={{ color: subTextColor }}>Adjust dates</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* Insights Section */}
      <ThemedView style={[styles.insightsContainer, { backgroundColor }]}>
        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>Daily Insights</ThemedText>
        <ThemedView style={[styles.insightCard, { backgroundColor: cardBgColor }]}>
          <ThemedText style={[styles.insightTitle, { color: primaryColor }]}>Chances of getting pregnant</ThemedText>
          <ThemedText style={[styles.insightValue, { color: textColor }]}>Low</ThemedText>
          <ThemedText style={[styles.insightDescription, { color: subTextColor }]}>
            Based on your cycle history, today is not a fertile day.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  profileButton: {
    padding: 5,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  outerCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  innerCircle: {
    width: width * 0.62,
    height: width * 0.62,
    borderRadius: (width * 0.62) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  circleSubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  insightCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
