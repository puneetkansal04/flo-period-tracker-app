import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const suggestions = [
    'Period cramps', 'Ovulation signs', 'Weight tracking', 
    'Healthy diet', 'Exercise and cycle', 'Pregnancy chances'
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Search articles and health tips"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <View style={styles.tagGrid}>
          {suggestions.map((s, i) => (
            <TouchableOpacity 
              key={i} 
              style={styles.tag} 
              onPress={() => setQuery(s)}
            >
              <Text style={styles.tagText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {query.length > 0 && (
          <View style={styles.resultsEmpty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.lightGray} />
            <Text style={styles.emptyTitle}>Searching for "{query}"</Text>
            <Text style={styles.emptySub}>We are finding the best articles for you...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, gap: 8, height: 44,
  },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  scroll: { padding: Spacing.lg },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', marginBottom: Spacing.lg },
  tagGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: {
    backgroundColor: Colors.lightGray, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  tagText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  resultsEmpty: { alignItems: 'center', marginTop: 100, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
