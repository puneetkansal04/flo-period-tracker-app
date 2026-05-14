import React from 'react';
import { StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#F9F9F9';
  const textColor = isDark ? '#FFFFFF' : '#333333';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.header, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Calendar</ThemedText>
      </ThemedView>
      <ThemedView style={[styles.content, { backgroundColor }]}>
        <ThemedText style={{ color: textColor }}>Calendar view will be here.</ThemedText>
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
  },
});
