import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setGoal, GoalType } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

const GOALS = [
  {
    key: 'track_cycle' as GoalType,
    icon: '🌸',
    title: 'Track my cycle',
    description: 'Get period predictions & insights',
  },
  {
    key: 'get_pregnant' as GoalType,
    icon: '🤱',
    title: 'Get pregnant',
    description: 'Maximize your fertility window',
  },
  {
    key: 'track_pregnancy' as GoalType,
    icon: '👶',
    title: 'Track pregnancy',
    description: 'Week-by-week pregnancy guide',
  },
];

export default function GoalScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<GoalType>(null);

  const handleNext = () => {
    console.log('Goal selected:', selected);
    if (selected) {
      console.log('Pushing route directly...');
      // dispatch(setGoal(selected));
      router.push('/onboarding/birth-year');
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
          <View style={[styles.progressFill, { width: '8%' }]} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <Text style={styles.title}>What would you like to use Serene for?</Text>
        <Text style={styles.subtitle}>You can always change this later</Text>

        <View style={styles.optionsContainer}>
          {GOALS.map((goal) => {
            const isSelected = selected === goal.key;
            return (
              <TouchableOpacity
                key={goal.key}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => {
                console.log('Tapped goal:', goal.key);
                setSelected(goal.key);
              }}
                activeOpacity={0.8}
              >
                <Text style={styles.optionIcon}>{goal.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                    {goal.title}
                  </Text>
                  <Text style={styles.optionDesc}>{goal.description}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
          onPress={() => {
            console.log('Next button pressed');
            handleNext();
          }}
          activeOpacity={selected ? 0.85 : 1}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing['2xl'],
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  optionIcon: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: Colors.primary,
  },
  optionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: Colors.primary,
  },
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
  nextBtnDisabled: {
    backgroundColor: Colors.borderDark,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
