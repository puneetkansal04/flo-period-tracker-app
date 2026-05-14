import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
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

  const { dailyLogs, isPremium } = useSelector((state: RootState) => state.period);
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.dateText}>{moment().format('MMMM D')}</Text>
          <Text style={styles.cycleDay}>Cycle day {currentDay}</Text>
        </View>
        <View style={styles.topRight}>
          {!isPremium && (
            <TouchableOpacity style={styles.premiumHeaderBtn} onPress={() => router.push('/paywall')}>
              <Ionicons name="ribbon" size={22} color={Colors.orange} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/reminders')}>
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push('/settings')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Main Circle */}
        <View style={styles.circleSection}>
          <View style={styles.circleContainer}>
            {/* Outer glow ring */}
            <View style={[styles.glowRing, { borderColor: circleColor + '25' }]} />
            <PulsingCircle color={circleColor} progress={progressFraction} />
            
            {/* Content overlay */}
            <View style={styles.circleOverlay}>
              <Text style={styles.circleDayNumber}>{currentDay}</Text>
              <Text style={styles.circleDayText}>Cycle Day</Text>
              <Text style={[styles.statusLabel, { color: circleColor }]}>{statusLabel}</Text>
              <View style={[styles.phaseBadge, { backgroundColor: circleColor + '20' }]}>
                <View style={[styles.phaseDot, { backgroundColor: circleColor }]} />
                <Text style={[styles.phaseText, { color: circleColor }]}>
                  {phase === 'period' ? 'Menstruation' :
                   phase === 'fertile' ? 'Fertile window' :
                   phase === 'ovulation' ? 'Ovulation' :
                   phase === 'follicular' ? 'Follicular phase' : 'Luteal phase'}
                </Text>
              </View>
              <Text style={styles.healthTipText}>{calcs.healthTip}</Text>
            </View>
          </View>

          {/* Log today button */}
          <TouchableOpacity
            style={[styles.logTodayBtn, { backgroundColor: circleColor }]}
            onPress={() => {
              console.log('Tapped Log Today');
              router.push('/log-day');
            }}
            activeOpacity={0.85}
          >
            <Ionicons name={todayLog ? 'checkmark' : 'add'} size={18} color={Colors.white} />
            <Text style={styles.logTodayText}>
              {todayLog ? "Update today's log" : 'Log today'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Prediction Cards */}
        <View style={styles.predictionRow}>
          <View style={[styles.predictionCard, { backgroundColor: Colors.primary + '12' }]}>
            <Ionicons name="water" size={20} color={Colors.primary} />
            <Text style={styles.predCardLabel}>Next period</Text>
            <Text style={[styles.predCardValue, { color: Colors.primary }]}>
              {daysUntilPeriod === 0 ? 'Today' : `in ${daysUntilPeriod}d`}
            </Text>
            <Text style={styles.predCardDate}>{nextPeriodDate.format('MMM D')}</Text>
          </View>

          <View style={[styles.predictionCard, { backgroundColor: Colors.orange + '12' }]}>
            <Ionicons name="sunny-outline" size={20} color={Colors.orange} />
            <Text style={styles.predCardLabel}>Ovulation</Text>
            <Text style={[styles.predCardValue, { color: Colors.orange }]}>
              {daysUntilOvulation === 0 ? 'Today' :
               daysUntilOvulation < 0 ? 'Passed' : `in ${daysUntilOvulation}d`}
            </Text>
            <Text style={styles.predCardDate}>{ovulationDate.format('MMM D')}</Text>
          </View>

          <View style={[styles.predictionCard, { backgroundColor: Colors.green + '12' }]}>
            <Ionicons name="heart" size={20} color={Colors.green} />
            <Text style={styles.predCardLabel}>Cycle day</Text>
            <Text style={[styles.predCardValue, { color: Colors.green }]}>
              {currentDay}
            </Text>
            <Text style={styles.predCardDate}>of {cycleLength}</Text>
          </View>
        </View>

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

        {/* Fertility Banner */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.fertilityBanner} activeOpacity={0.85} onPress={() => router.push('/paywall')}>
            <View>
              <Text style={styles.fertilityTitle}>Supercharge your health</Text>
              <Text style={styles.fertilitySubtitle}>with Premium insights →</Text>
            </View>
            <Text style={styles.fertilityEmoji}>✨</Text>
          </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dateText: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  cycleDay: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  premiumHeaderBtn: {
    padding: 6,
    backgroundColor: Colors.orange + '15',
    borderRadius: 10,
  },
  notifBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  avatarBtn: {},
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  scroll: { paddingBottom: Spacing['5xl'] },

  // Circle
  circleSection: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  circleContainer: {
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  glowRing: {
    position: 'absolute',
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    borderRadius: (CIRCLE_SIZE + 40) / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  outerRing: {
    width: CIRCLE_SIZE + 16,
    height: CIRCLE_SIZE + 16,
    borderRadius: (CIRCLE_SIZE + 16) / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOverlay: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  circleWrap: {},
  circleOuter: { borderWidth: 2 },
  circleInner: { borderWidth: 1 },
  circleCore: {},
  statusLabel: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  circleDayNumber: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 0,
  },
  circleDayText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  healthTipText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseText: { fontSize: 13, fontWeight: '600' },
  logTodayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logTodayText: { color: Colors.white, fontSize: 15, fontWeight: '600' },

  // Prediction cards
  predictionRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  predictionCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  predCardLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500', marginTop: 2 },
  predCardValue: { fontSize: 18, fontWeight: '700' },
  predCardDate: { fontSize: 11, color: Colors.textMuted },

  // Sections
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
});
