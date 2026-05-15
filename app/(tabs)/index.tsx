import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import usePeriodTracker from '@/hooks/usePeriodTracker';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { isPremium } = useSelector((s: RootState) => s.period);
  const { 
    currentDay, 
    phase, 
    daysUntilNext, 
    pregnancyChance,
    statusMessage 
  } = usePeriodTracker();

  useEffect(() => {
    if (!isPremium) {
      router.push('/paywall');
    }
  }, [isPremium]);

  const getTip = () => {
    switch (phase) {
      case 'period': return { workout: 'Yoga & Stretching', nutrition: 'Iron & Magnesium', energy: 'Rest phase', icon: 'leaf' };
      case 'follicular': return { workout: 'Cardio & Strength', nutrition: 'Probiotics', energy: 'Rising energy', icon: 'flash' };
      case 'ovulation': return { workout: 'HIIT / Strength', nutrition: 'Anti-inflammatory', energy: 'Peak energy', icon: 'sunny' };
      default: return { workout: 'Pilates / Walking', nutrition: 'Complex Carbs', energy: 'Declining', icon: 'moon' };
    }
  };

  const tip = getTip();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.date}>{moment().format('dddd, MMMM D')}</Text>
          </View>
          <TouchableOpacity style={styles.premiumBadge} onPress={() => router.push('/paywall')}>
            <Ionicons name="sparkles" size={16} color={Colors.white} />
            <Text style={styles.premiumText}>{isPremium ? 'PREMIUM' : 'GO PREMIUM'}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Progress Circle */}
        <View style={styles.circleContainer}>
          <View style={[styles.mainCircle, { borderColor: phase === 'period' ? Colors.primary : Colors.primary + '20' }]}>
            <View style={[styles.innerCircle, { backgroundColor: Colors.primary + '08' }]}>
              <Text style={styles.statusLabel}>{statusMessage}</Text>
              <Text style={styles.dayText}>Day {currentDay}</Text>
              <View style={styles.daysBadge}>
                <Text style={styles.daysBadgeText}>{daysUntilNext} days left</Text>
              </View>
              <Text style={styles.chanceText}>Chance of pregnancy: {pregnancyChance}</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.logTodayBtn} onPress={() => router.push('/log-day')}>
          <Ionicons name="add" size={24} color={Colors.white} />
          <Text style={styles.logTodayText}>Log Today</Text>
        </TouchableOpacity>

        {/* Lifestyle Sync */}
        <TouchableOpacity 
          style={styles.lifestyleCard}
          onPress={() => router.push('/cycle-syncing')}
        >
          <View style={styles.cardHeader}>
            <Ionicons name={tip.icon as any} size={22} color={Colors.primary} />
            <Text style={styles.cardTitle}>Lifestyle Syncing</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
          </View>
          <Text style={styles.lifestyleSub}>Optimize your routine for the {phase} phase</Text>
          <View style={styles.tipGrid}>
            <View style={styles.tipItem}>
              <Text style={styles.tipLabel}>WORKOUT</Text>
              <Text style={styles.tipValue}>{tip.workout}</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipLabel}>NUTRITION</Text>
              <Text style={styles.tipValue}>{tip.nutrition}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Daily Insight */}
        <View style={styles.insightsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="bulb-outline" size={22} color={Colors.orange} />
            <Text style={styles.cardTitle}>Daily Insight</Text>
          </View>
          <Text style={styles.insightText}>
            {phase === 'ovulation' 
              ? 'Your energy is at its peak! Great time for social activities and intensive workouts.' 
              : 'Listen to your body today. Prioritize sleep and gentle movement if you feel tired.'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* PremiumModal removed in favor of /paywall screen */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  container: { padding: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  greeting: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  date: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full, gap: 4,
    ...Shadows.button,
  },
  premiumText: { color: Colors.white, fontSize: 11, fontWeight: '800' },
  circleContainer: { alignItems: 'center', marginVertical: Spacing.xl },
  mainCircle: {
    width: width * 0.75, height: width * 0.75, borderRadius: (width * 0.75) / 2,
    borderWidth: 15, alignItems: 'center', justifyContent: 'center',
  },
  innerCircle: {
    width: width * 0.6, height: width * 0.6, borderRadius: (width * 0.6) / 2,
    alignItems: 'center', justifyContent: 'center',
  },
  statusLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8 },
  dayText: { fontSize: 42, fontWeight: '800', color: Colors.textPrimary },
  daysBadge: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginVertical: 12 },
  daysBadgeText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  chanceText: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  logTodayBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.full,
    gap: 8, marginBottom: Spacing.xl, ...Shadows.button,
  },
  logTodayText: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  lifestyleCard: {
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  lifestyleSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16, fontWeight: '500' },
  tipGrid: { flexDirection: 'row', gap: Spacing.md },
  tipItem: { flex: 1 },
  tipLabel: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, marginBottom: 4 },
  tipValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  insightsCard: {
    backgroundColor: '#FFF7ED', borderRadius: BorderRadius.xl,
    padding: Spacing.lg, ...Shadows.card,
  },
  insightText: { fontSize: 14, color: '#9A3412', lineHeight: 20, fontWeight: '500' },
});
