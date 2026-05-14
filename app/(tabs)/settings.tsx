import React from 'react';
import { StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const cardBgColor = isDark ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const subTextColor = isDark ? '#AAAAAA' : '#666666';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.header, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Settings</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.content, { backgroundColor }]}>
        {/* Profile Section */}
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Ionicons name="person-circle" size={40} color="#FF5A76" />
          <ThemedView style={styles.cardTextContainer}>
            <ThemedText type="subtitle" style={{ color: textColor }}>Profile</ThemedText>
            <ThemedText style={{ color: subTextColor }}>Manage your account</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Ionicons name="notifications" size={30} color="#FF9800" style={styles.icon} />
          <ThemedView style={styles.cardTextContainer}>
            <ThemedText type="subtitle" style={{ color: textColor }}>Notifications</ThemedText>
            <ThemedText style={{ color: subTextColor }}>Reminders and alerts</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Ionicons name="lock-closed" size={30} color="#4CAF50" style={styles.icon} />
          <ThemedView style={styles.cardTextContainer}>
            <ThemedText type="subtitle" style={{ color: textColor }}>Privacy & Security</ThemedText>
            <ThemedText style={{ color: subTextColor }}>Passcode, data export</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity style={[styles.card, { backgroundColor: cardBgColor }]}>
          <Ionicons name="information-circle" size={30} color="#00BCD4" style={styles.icon} />
          <ThemedView style={styles.cardTextContainer}>
            <ThemedText type="subtitle" style={{ color: textColor }}>About</ThemedText>
            <ThemedText style={{ color: subTextColor }}>Version 1.0.0</ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={20} color={subTextColor} />
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
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
  icon: {
    marginRight: 10,
    width: 30,
    textAlign: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
});
