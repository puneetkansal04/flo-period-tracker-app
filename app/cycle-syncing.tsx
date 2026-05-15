import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

const PHASES = [
  {
    key: 'period',
    title: 'Menstrual Phase',
    days: 'Day 1-5',
    description: 'Focus on rest and recovery. Your hormones are at their lowest.',
    workout: 'Yoga, stretching, gentle walking',
    nutrition: 'Iron-rich foods, magnesium, warm herbal teas',
    icon: 'leaf',
    color: Colors.primary,
  },
  {
    key: 'follicular',
    title: 'Follicular Phase',
    days: 'Day 6-12',
    description: 'Energy levels are rising. Good time for new projects and learning.',
    workout: 'Cardio, strength training, dance',
    nutrition: 'Fermented foods, vibrant vegetables, light salads',
    icon: 'flash',
    color: '#8B5CF6',
  },
  {
    key: 'ovulation',
    title: 'Ovulatory Phase',
    days: 'Day 13-15',
    description: 'You are at your most social and energetic peak. Fertility is high.',
    workout: 'HIIT, intensive strength training, social sports',
    nutrition: 'Anti-inflammatory foods, fiber, zinc-rich seeds',
    icon: 'sunny',
    color: Colors.orange,
  },
  {
    key: 'luteal',
    title: 'Luteal Phase',
    days: 'Day 16-28',
    description: 'Turn inward. You may feel more creative but less social.',
    workout: 'Pilates, moderate walking, steady cardio',
    nutrition: 'Complex carbs, leafy greens, healthy fats',
    icon: 'moon',
    color: '#3B82F6',
  },
];

export default function CycleSyncingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle Syncing Guide</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Learn how to sync your lifestyle, diet, and exercise with your cycle phases for optimal health.</Text>
        
        {PHASES.map((phase) => (
          <View key={phase.key} style={styles.phaseCard}>
            <View style={[styles.phaseHeader, { backgroundColor: phase.color + '10' }]}>
              <View style={[styles.iconCircle, { backgroundColor: phase.color }]}>
                <Ionicons name={phase.icon as any} size={24} color={Colors.white} />
              </View>
              <View>
                <Text style={[styles.phaseTitle, { color: phase.color }]}>{phase.title}</Text>
                <Text style={styles.phaseDays}>{phase.days}</Text>
              </View>
            </View>
            
            <View style={styles.phaseContent}>
              <Text style={styles.phaseDesc}>{phase.description}</Text>
              
              <View style={styles.detailRow}>
                <Ionicons name="fitness-outline" size={18} color={Colors.textSecondary} />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>WORKOUT</Text>
                  <Text style={styles.detailValue}>{phase.workout}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="restaurant-outline" size={18} color={Colors.textSecondary} />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>NUTRITION</Text>
                  <Text style={styles.detailValue}>{phase.nutrition}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.lg },
  intro: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl },
  phaseCard: {
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl, overflow: 'hidden', ...Shadows.card,
  },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.lg },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  phaseTitle: { fontSize: 18, fontWeight: '800' },
  phaseDays: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  phaseContent: { padding: Spacing.lg, gap: Spacing.md },
  phaseDesc: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20, marginBottom: 4 },
  detailRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
});
