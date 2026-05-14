import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setPeriodLength, setOnboardingComplete } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

const MIN = 2;
const MAX = 10;

export default function PeriodLengthScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [value, setValue] = useState(5);

  const handleNext = () => {
    dispatch(setPeriodLength(value));
    dispatch(setOnboardingComplete(true));
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '40%' }]} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>How long does your period last?</Text>
        <Text style={styles.subtitle}>Count from day 1 to your last day of bleeding</Text>

        {/* Big number display */}
        <View style={styles.valueContainer}>
          <Text style={styles.valueNumber}>{value}</Text>
          <Text style={styles.valueDays}>days</Text>
        </View>

        {/* Day blocks visual */}
        <View style={styles.dayBlocks}>
          {Array.from({ length: MAX }, (_, i) => i + 1).map(n => {
            const isActive = n <= value;
            const isCurrent = n === value;
            return (
              <TouchableOpacity
                key={n}
                style={[
                  styles.dayBlock,
                  isActive && styles.dayBlockActive,
                  isCurrent && styles.dayBlockCurrent,
                ]}
                onPress={() => setValue(n)}
              >
                <Text style={[styles.dayBlockText, isActive && styles.dayBlockTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tap hint */}
        <Text style={styles.hint}>Tap a day or use the +/- buttons</Text>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, value <= MIN && styles.controlBtnDisabled]}
            onPress={() => setValue(v => Math.max(MIN, v - 1))}
          >
            <Ionicons name="remove" size={24} color={value <= MIN ? Colors.borderDark : Colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.controlBtn, value >= MAX && styles.controlBtnDisabled]}
            onPress={() => setValue(v => Math.min(MAX, v + 1))}
          >
            <Ionicons name="add" size={24} color={value >= MAX ? Colors.borderDark : Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  progressBar: { flex: 1, height: 4, backgroundColor: Colors.lightGray, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, lineHeight: 34 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing['3xl'], lineHeight: 20 },
  valueContainer: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  valueNumber: { fontSize: 80, fontWeight: '700', color: Colors.primary, lineHeight: 90 },
  valueDays: { fontSize: 18, color: Colors.textSecondary },
  dayBlocks: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.xl,
  },
  dayBlock: {
    width: 52, height: 52, borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray,
    alignItems: 'center', justifyContent: 'center',
  },
  dayBlockActive: { backgroundColor: Colors.primaryLight },
  dayBlockCurrent: { backgroundColor: Colors.primary },
  dayBlockText: { fontSize: 16, fontWeight: '600', color: Colors.textMuted },
  dayBlockTextActive: { color: Colors.white },
  hint: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.xl },
  controls: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl },
  controlBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnDisabled: { backgroundColor: Colors.lightGray },
  footer: {
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
    paddingTop: Spacing.md, backgroundColor: Colors.white,
  },
  nextBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    height: 52, alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  nextBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
