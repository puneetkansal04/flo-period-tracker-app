import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setCycleLength } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

const MIN = 21;
const MAX = 45;

export default function CycleLengthScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [value, setValue] = useState(28);

  const handleNext = () => {
    dispatch(setCycleLength(value));
    router.push('/onboarding/period-length');
  };

  const description =
    value < 24 ? 'Short cycle' :
    value <= 35 ? 'Typical cycle' :
    'Long cycle';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '32%' }]} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>How long is your cycle?</Text>
        <Text style={styles.subtitle}>Count from the first day of one period to the first day of the next</Text>

        {/* Big number display */}
        <View style={styles.valueContainer}>
          <Text style={styles.valueNumber}>{value}</Text>
          <Text style={styles.valueDays}>days</Text>
          <View style={styles.descBadge}>
            <Text style={styles.descText}>{description}</Text>
          </View>
        </View>

        {/* Slider-style number line */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, value <= MIN && styles.controlBtnDisabled]}
            onPress={() => setValue(v => Math.max(MIN, v - 1))}
          >
            <Ionicons name="remove" size={24} color={value <= MIN ? Colors.borderDark : Colors.white} />
          </TouchableOpacity>

          <View style={styles.sliderRow}>
            {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map(n => {
              const active = n <= value;
              const selected = n === value;
              return (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.tick,
                    active && styles.tickActive,
                    selected && styles.tickSelected,
                  ]}
                  onPress={() => setValue(n)}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.controlBtn, value >= MAX && styles.controlBtnDisabled]}
            onPress={() => setValue(v => Math.min(MAX, v + 1))}
          >
            <Ionicons name="add" size={24} color={value >= MAX ? Colors.borderDark : Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.rangeHint}>{MIN} – {MAX} days</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>Next</Text>
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
  valueContainer: { alignItems: 'center', marginBottom: Spacing['3xl'] },
  valueNumber: { fontSize: 80, fontWeight: '700', color: Colors.primary, lineHeight: 90 },
  valueDays: { fontSize: 18, color: Colors.textSecondary, marginBottom: Spacing.md },
  descBadge: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  descText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  controlBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnDisabled: { backgroundColor: Colors.lightGray },
  sliderRow: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', height: 32,
  },
  tick: {
    flex: 1, height: 4, borderRadius: 2,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 1,
  },
  tickActive: { backgroundColor: Colors.primaryLight },
  tickSelected: { backgroundColor: Colors.primary, height: 14, borderRadius: 4 },
  rangeHint: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: Spacing.md },
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
