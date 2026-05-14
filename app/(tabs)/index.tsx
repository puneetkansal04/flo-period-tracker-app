import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
import { registerForPushNotificationsAsync, scheduleCycleNotifications } from '@/utils/notifications';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import RatingPrompt from '@/components/RatingPrompt';
import PremiumModal from '@/components/PremiumModal';
import { setPremium } from '@/store/slices/periodSlice';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.72;

function useCycleCalculations() {
  const { lastPeriodDate, cycleLength, periodLength } = useSelector(
    (state: RootState) => state.period
  );

  const lastPeriod = moment(lastPeriodDate).startOf('day');
  const today = moment().startOf('day');
  const daysPassed = today.diff(lastPeriod, 'days');
  const currentDay = (daysPassed % cycleLength) + 1;

  // Next period
  const cyclesSince = Math.floor(daysPassed / cycleLength);
  const nextPeriodDate = lastPeriod.clone().add((cyclesSince + 1) * cycleLength, 'days');
  const daysUntilPeriod = nextPeriodDate.diff(today, 'days');

  // Ovulation (~14 days before next period)
  const ovulationDate = nextPeriodDate.clone().subtract(14, 'days');
  const daysUntilOvulation = ovulationDate.diff(today, 'days');

  // Fertile window (ovulation - 5 to ovulation + 1)
  const fertileStart = ovulationDate.clone().subtract(5, 'days');
  const fertileEnd = ovulationDate.clone().add(1, 'day');
  const isInPeriod = daysPassed % cycleLength < periodLength;
  const isInFertile = today.isBetween(fertileStart, fertileEnd, 'day', '[]');
  const isOvulationDay = today.isSame(ovulationDate, 'day');

  let phase: 'period' | 'fertile' | 'ovulation' | 'follicular' | 'luteal';
  let statusLabel: string;
  let statusColor: string;
  let circleColor: string;
  let healthTip: string;

  if (isInPeriod) {
    phase = 'period';
    statusLabel = 'Period';
    statusColor = Colors.primary;
    circleColor = Colors.primary;
    healthTip = 'Stay hydrated and get plenty of rest.';
  } else if (isOvulationDay) {
    phase = 'ovulation';
    statusLabel = 'Ovulation day';
    statusColor = Colors.orange;
    circleColor = Colors.orange;
    healthTip = 'Highest chance of pregnancy today.';
  } else if (isInFertile) {
    phase = 'fertile';
    statusLabel = 'Fertile window';
    statusColor = Colors.green;
    circleColor = Colors.green;
    healthTip = 'High chance of pregnancy.';
  } else if (currentDay < cycleLength / 2) {
    phase = 'follicular';
    statusLabel = `${daysUntilPeriod} days until period`;
    statusColor = Colors.blue;
    circleColor = Colors.blue;
    healthTip = 'Energy levels may be rising.';
  } else {
    phase = 'luteal';
    statusLabel = `${daysUntilPeriod} days until period`;
    statusColor = Colors.purple;
    circleColor = Colors.purple;
    healthTip = 'You might feel more sensitive now.';
  }

  const progressFraction = currentDay / cycleLength;
  return {
    currentDay,
    cycleLength,
    daysUntilPeriod,
    daysUntilOvulation,
    ovulationDate,
    nextPeriodDate,
    phase,
    statusLabel,
    statusColor,
    circleColor,
    progressFraction,
    isInFertile,
    isOvulationDay,
    isInPeriod,
    healthTip,
    daysPassed,
    title: statusLabel,
    subtitle: phase.charAt(0).toUpperCase() + phase.slice(1),
  };
}

function PulsingCircle({ color, progress }: { color: string; progress: number }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulseContainer}>
      <Animated.View 
        style={[
          styles.pulseCircle, 
          { 
            backgroundColor: color,
            opacity: 0.1,
            transform: [{ scale: pulse }]
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.pulseCircle, 
          { 
            backgroundColor: color,
            opacity: 0.05,
            transform: [{ scale: Animated.multiply(pulse, 1.2) }]
          }
        ]} 
      />
    </View>
  );
}

export default function TodayScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const calcs = useCycleCalculations();
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(() => {
      const daysUntilPeriod = calcs.nextPeriodDate.diff(moment(), 'days');
      scheduleCycleNotifications(daysUntilPeriod);
    });
  }, []);

  const { dailyLogs, isPremium, isPregnant, lastPeriodDate, name } = useSelector((state: RootState) => state.period);
  const today = moment().format('YYYY-MM-DD');
  const todayLog = (dailyLogs || {})[today];

  const [paywallVisible, setPaywallVisible] = useState(false);

  useEffect(() => {
    // Auto-open log if not filled today
    if (!todayLog) {
      setTimeout(() => {
        router.push('/log-day');
      }, 1500);
    } else if (!isPremium) {
      // Show paywall if not premium and logged today
      setTimeout(() => {
        setPaywallVisible(true);
      }, 2000);
    }
  }, []);

  const articles = [
    {
      id: 1,
      emoji: '🌺',
      title: 'Understanding your cycle phases',
      tag: 'Health',
      readTime: '3 min',
      color: '#FFF0F3',
    },
    {
      id: 2,
      emoji: '🧘',
      title: 'Best exercises during your period',
      tag: 'Fitness',
      readTime: '5 min',
      color: '#F0F3FF',
    },
    {
      id: 3,
      emoji: '🥗',
      title: 'Foods that ease cramps naturally',
      tag: 'Nutrition',
      readTime: '4 min',
      color: '#F0FFF4',
    },
  ];

  const { circleColor, statusLabel, currentDay, cycleLength, phase,
    daysUntilPeriod, daysUntilOvulation, nextPeriodDate, ovulationDate, progressFraction } = calcs;

  // Pregnancy calculations
  const pregWeeks = Math.floor(calcs.daysPassed / 7);
  const pregDays = calcs.daysPassed % 7;
  const babySize = pregWeeks < 4 ? 'Poppy Seed' : pregWeeks < 8 ? 'Raspberry' : pregWeeks < 12 ? 'Lime' : pregWeeks < 16 ? 'Avocado' : 'Mango';
  const babyEmoji = pregWeeks < 4 ? '🌱' : pregWeeks < 8 ? '🍓' : pregWeeks < 12 ? '🍋' : pregWeeks < 16 ? '🥑' : '🥭';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerDate}>{moment().format('MMMM D')}</Text>
          <Text style={styles.headerCycleDay}>Cycle day {currentDay}</Text>
        </View>
        <View style={styles.headerRight}>
          {!isPremium && (
            <TouchableOpacity onPress={() => setPaywallVisible(true)} style={styles.headerIcon}>
              <Ionicons name="ribbon-outline" size={22} color={Colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/reminders')} style={styles.headerIcon}>
            <Ionicons name="alarm-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.profileBtn}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name?.charAt(0) || 'U'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.mainCircleContainer}>
          <View style={[styles.circleOuter, { borderColor: isPregnant ? '#4ADE80' : calcs.circleColor + '40', borderStyle: 'dashed' }]}>
            <View style={styles.circleInner}>
              <View style={styles.circleCore}>
                {isPregnant ? (
                  <>
                    <Text style={[styles.circleTitle, { color: '#16A34A' }]}>Week {pregWeeks}</Text>
                    <Text style={styles.pregDaysText}>Day {pregDays}</Text>
                    <View style={styles.babyBadge}>
                      <Text style={styles.babyEmoji}>{babyEmoji}</Text>
                      <Text style={styles.babySizeText}>Size of a {babySize}</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={[styles.circleTitle, { color: calcs.circleColor }]}>{calcs.title}</Text>
                    <View style={[styles.phaseBadge, { backgroundColor: calcs.circleColor + '20' }]}>
                      <View style={[styles.phaseDot, { backgroundColor: calcs.circleColor }]} />
                      <Text style={[styles.phaseBadgeText, { color: calcs.circleColor }]}>{calcs.subtitle}</Text>
                    </View>
                    <View style={styles.pregnancyChanceContainer}>
                      <Text style={styles.pregnancyChanceLabel}>Pregnancy chance</Text>
                      <Text style={[styles.pregnancyChanceValue, { color: calcs.circleColor }]}>
                        {calcs.phase === 'ovulation' ? 'Peak' : calcs.isInFertile ? 'High' : 'Low'}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.logTodayBtn}
            onPress={() => router.push(`/log-day?date=${moment().format('YYYY-MM-DD')}`)}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={styles.logTodayBtnText}>Log today</Text>
          </TouchableOpacity>
        </View>

        {/* Prediction Cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.predCard, { backgroundColor: Colors.primaryBg }]}>
            <Ionicons name="water" size={20} color={Colors.primary} />
            <Text style={styles.predCardLabel}>Next period</Text>
            <Text style={[styles.predCardValue, { color: Colors.primary }]}>in {calcs.daysUntilPeriod}d</Text>
            <Text style={styles.predCardDate}>{moment().add(calcs.daysUntilPeriod, 'days').format('MMM D')}</Text>
          </View>
          <View style={[styles.predCard, { backgroundColor: '#FFF9E6' }]}>
            <Ionicons name="sunny" size={20} color={Colors.orange} />
            <Text style={styles.predCardLabel}>Ovulation</Text>
            <Text style={[styles.predCardValue, { color: Colors.orange }]}>in {calcs.daysUntilOvulation}d</Text>
            <Text style={styles.predCardDate}>{moment().add(calcs.daysUntilOvulation, 'days').format('MMM D')}</Text>
          </View>
          <View style={[styles.predCard, { backgroundColor: '#E6F7F9' }]}>
            <Ionicons name="heart" size={20} color={Colors.green} />
            <Text style={styles.predCardLabel}>Cycle day</Text>
            <Text style={[styles.predCardValue, { color: Colors.green }]}>{currentDay}</Text>
            <Text style={styles.predCardDate}>of {cycleLength}</Text>
          </View>
        </View>

        {/* Health Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={[styles.insightIcon, { backgroundColor: calcs.circleColor + '20' }]}>
              <Ionicons name="bulb-outline" size={20} color={calcs.circleColor} />
            </View>
            <Text style={styles.insightTitle}>Health Insight</Text>
          </View>
          <Text style={styles.insightText}>{calcs.healthTip}</Text>
        </View>

        {/* Daily Reminders / Plans Card */}
        <TouchableOpacity 
          style={styles.remindersBanner}
          onPress={() => router.push('/reminders')}
        >
          <View style={styles.remindersIconBg}>
            <Ionicons name="alarm" size={24} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.remindersTitle}>Your Daily Plan</Text>
            <Text style={styles.remindersSubtitle}>Set alarms for water, pills & vitamins</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Today's Log Summary */}
        {todayLog && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s log</Text>
            <View style={styles.logSummaryCard}>
              {todayLog.flow && (
                <View style={styles.logTag}>
                  <Text style={styles.logTagText}>💧 {todayLog.flow} flow</Text>
                </View>
              )}
              {todayLog.moods?.map(m => (
                <View key={m} style={styles.logTag}>
                  <Text style={styles.logTagText}>😊 {m}</Text>
                </View>
              ))}
              {todayLog.symptoms?.map(s => (
                <View key={s} style={styles.logTag}>
                  <Text style={styles.logTagText}>⚡ {s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Daily Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily insights</Text>
            <TouchableOpacity onPress={() => router.push('/insights')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {articles.map((article) => (
            <TouchableOpacity 
              key={article.id} 
              style={[styles.articleCard, { backgroundColor: article.color }]} 
              activeOpacity={0.85}
              onPress={() => router.push(`/article?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.tag)}&emoji=${article.emoji}`)}
            >
              <Text style={styles.articleEmoji}>{article.emoji}</Text>
              <View style={styles.articleContent}>
                <View style={styles.articleMeta}>
                  <View style={styles.articleTag}>
                    <Text style={styles.articleTagText}>{article.tag}</Text>
                  </View>
                  <Text style={styles.articleReadTime}>{article.readTime} read</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
      <RatingPrompt />
      <PremiumModal 
        visible={paywallVisible} 
        onClose={() => setPaywallVisible(false)}
        onSubscribe={() => {
          dispatch(setPremium(true));
          setPaywallVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerDate: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  headerCycleDay: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  scroll: { paddingBottom: Spacing['5xl'] },

  mainCircleContainer: { alignItems: 'center', paddingVertical: 40, position: 'relative' },
  circleOuter: { width: 280, height: 280, borderRadius: 140, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  circleInner: { width: 260, height: 260, borderRadius: 130, alignItems: 'center', justifyContent: 'center' },
  circleCore: { alignItems: 'center', justifyContent: 'center' },
  circleTitle: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
  phaseBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: BorderRadius.full 
  },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseBadgeText: { fontSize: 14, fontWeight: '700' },
  pregnancyChanceContainer: { alignItems: 'center', marginTop: 12 },
  pregnancyChanceLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600', textTransform: 'uppercase' },
  pregnancyChanceValue: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  pregDaysText: { fontSize: 18, fontWeight: '600', color: Colors.textSecondary, marginTop: -8 },
  babyBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full },
  babyEmoji: { fontSize: 20 },
  babySizeText: { fontSize: 13, fontWeight: '700', color: '#16A34A' },
  logTodayBtn: { 
    position: 'absolute', bottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: BorderRadius.full, elevation: 5,
  },
  logTodayBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },


  insightCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    ...Shadows.card,
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  insightIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  insightText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },

  cardsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl, paddingHorizontal: Spacing.base },
  predCard: { 
    flex: 1, padding: Spacing.md, borderRadius: BorderRadius.lg, 
    alignItems: 'center', gap: 4,
  },
  predCardLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  predCardValue: { fontSize: 16, fontWeight: '800' },
  predCardDate: { fontSize: 10, color: Colors.textMuted },

  section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  // Log summary
  logSummaryCard: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm,
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: Spacing.base,
  },
  logTag: {
    backgroundColor: Colors.primaryBg, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 6,
  },
  logTagText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },

  // Articles
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  articleEmoji: { fontSize: 32 },
  articleContent: { flex: 1 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  articleTag: {
    backgroundColor: Colors.white + 'CC', borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  articleTagText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  articleReadTime: { fontSize: 11, color: Colors.textMuted },
  articleTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },

  // Fertility banner
  fertilityBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  fertilityTitle: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  fertilitySubtitle: { color: Colors.white + 'CC', fontSize: 13, marginTop: 2 },
  fertilityEmoji: { fontSize: 32 },
  pulseContainer: {
    position: 'absolute',
    width: CIRCLE_SIZE + 80,
    height: CIRCLE_SIZE + 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  pulseCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  remindersBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, marginHorizontal: Spacing.base,
    padding: Spacing.lg, borderRadius: BorderRadius.xl, marginTop: Spacing.lg,
    elevation: 3,
  },
  remindersIconBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  remindersTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  remindersSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
});
