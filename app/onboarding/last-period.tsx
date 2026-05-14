import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setLastPeriodDate } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const OPTIONS = [
  { key: 'today', label: 'Today', getDays: () => 0 },
  { key: 'yesterday', label: 'Yesterday', getDays: () => 1 },
  { key: '2days', label: '2 days ago', getDays: () => 2 },
  { key: '3days', label: '3 days ago', getDays: () => 3 },
  { key: '4days', label: '4 days ago', getDays: () => 4 },
  { key: '5days', label: '5 days ago', getDays: () => 5 },
  { key: '6days', label: '6 days ago', getDays: () => 6 },
  { key: '1week', label: '1 week ago', getDays: () => 7 },
  { key: '2weeks', label: '2 weeks ago', getDays: () => 14 },
  { key: '3weeks', label: '3 weeks ago', getDays: () => 21 },
  { key: '4weeks', label: '4 weeks ago', getDays: () => 28 },
];

export default function LastPeriodScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      const opt = OPTIONS.find(o => o.key === selected)!;
      const date = moment().subtract(opt.getDays(), 'days').startOf('day').toISOString();
      dispatch(setLastPeriodDate(date));
      router.push('/onboarding/cycle-length');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '24%' }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>📅</Text>
        </View>
        <Text style={styles.title}>When did your last period start?</Text>
        <Text style={styles.subtitle}>This helps us predict your next period</Text>

        <View style={styles.optionsList}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => setSelected(opt.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opt.label}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
          onPress={handleNext}
          activeOpacity={selected ? 0.85 : 1}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  progressBar: {
    flex: 1, height: 4, backgroundColor: Colors.lightGray, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  container: { padding: Spacing.lg, paddingBottom: Spacing['4xl'] },
  iconWrap: { alignItems: 'center', marginBottom: Spacing.base },
  icon: { fontSize: 48 },
  title: {
    fontSize: 26, fontWeight: '700', color: Colors.textPrimary,
    marginBottom: Spacing.sm, lineHeight: 34,
  },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing['2xl'] },
  optionsList: { gap: Spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    backgroundColor: Colors.white,
  },
  optionSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryBg },
  optionText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
  optionTextSelected: { color: Colors.primary, fontWeight: '600' },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  nextBtnDisabled: { backgroundColor: Colors.borderDark, shadowOpacity: 0, elevation: 0 },
  nextBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
