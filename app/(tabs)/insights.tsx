import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function InsightsScreen() {
  const router = useRouter();
  const { cycleLength, periodLength, dailyLogs, lastPeriodDate, periodHistory } = useSelector(
    (s: RootState) => s.period
  );

  const today = moment().startOf('day');
  const lastPeriod = moment(lastPeriodDate || new Date()).startOf('day');
  const daysPassed = today.diff(lastPeriod, 'days') || 0;
  const currentDay = ((daysPassed % (cycleLength || 28)) + 1) || 1;

  // Symptom frequency from all logs
  const allLogs = Object.values(dailyLogs || {});
  const moodCounts: Record<string, number> = {};
  const symptomCounts: Record<string, number> = {};

  allLogs.forEach(log => {
    if (!log) return;
    (log.moods || []).forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
    (log.symptoms || []).forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; });
  });

  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const logCount = allLogs.length;

  const cyclePhasePercent = (currentDay / cycleLength) * 100;

  // Mock cycle history data if not enough history exists
  const cycleData = periodHistory && periodHistory.length > 2 
    ? periodHistory.map(h => moment(h.end).diff(moment(h.start), 'days'))
    : [28, 29, 27, 30, 28, cycleLength];
  
  const cycleLabels = periodHistory && periodHistory.length > 2
    ? periodHistory.map(h => moment(h.start).format('MMM'))
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const articles = [
    { emoji: '🧠', title: 'How hormones affect your mood', category: 'Science', color: Colors.purpleLight },
    { emoji: '🏃‍♀️', title: 'Syncing workouts to your cycle', category: 'Fitness', color: Colors.blueLight },
    { emoji: '🍵', title: 'Herbal teas for period cramps', category: 'Wellness', color: Colors.greenLight },
    { emoji: '💤', title: 'Sleep and your menstrual cycle', category: 'Health', color: Colors.orangeLight },
  ];

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientTo: Colors.white,
    color: (opacity = 1) => `rgba(255, 107, 129, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    propsForLabels: {
      fontSize: 10,
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Cycle Overview Card */}
        <View style={styles.cycleCard}>
          <Text style={styles.cycleCardTitle}>Your cycle at a glance</Text>
          <View style={styles.cycleStats}>
            <View style={styles.cycleStat}>
              <Text style={styles.cycleStatValue}>{currentDay}</Text>
              <Text style={styles.cycleStatLabel}>Day in cycle</Text>
            </View>
            <View style={styles.cycleStatDivider} />
            <View style={styles.cycleStat}>
              <Text style={styles.cycleStatValue}>{cycleLength}</Text>
              <Text style={styles.cycleStatLabel}>Cycle length</Text>
            </View>
            <View style={styles.cycleStatDivider} />
            <View style={styles.cycleStat}>
              <Text style={styles.cycleStatValue}>{periodLength}</Text>
              <Text style={styles.cycleStatLabel}>Period length</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${cyclePhasePercent}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Day 1</Text>
              <Text style={styles.progressLabel}>Day {cycleLength}</Text>
            </View>
          </View>
        </View>

        {/* Cycle Length Variation Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cycle length variation</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: cycleLabels,
                datasets: [
                  {
                    data: cycleData,
                    color: (opacity = 1) => `rgba(255, 107, 129, ${opacity})`,
                    strokeWidth: 3
                  }
                ]
              }}
              width={screenWidth - Spacing.base * 2 - 20} // width padding
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
            />
          </View>
        </View>

        {/* Logging streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>{logCount} days logged</Text>
              <Text style={styles.streakSubtitle}>Keep tracking for better insights</Text>
            </View>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>{logCount}</Text>
          </View>
        </View>

        {/* Top moods & symptoms Chart (Bar) */}
        {(topMoods.length > 0 || topSymptoms.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most logged</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: [...topMoods.map(m => m[0].split('_')[1] || m[0]), ...topSymptoms.map(s => s[0].split('_')[1] || s[0])].slice(0, 4),
                  datasets: [
                    {
                      data: [...topMoods.map(m => m[1]), ...topSymptoms.map(s => s[1])].slice(0, 4)
                    }
                  ]
                }}
                width={screenWidth - Spacing.base * 2 - 20}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(165, 94, 234, ${opacity})`, // Purple bars
                }}
                showValuesOnTopOfBars={true}
                fromZero={true}
                withInnerLines={false}
              />
            </View>
          </View>
        )}

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learn more</Text>
          <View style={styles.articleGrid}>
            {articles.map((a, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.articleCard, { backgroundColor: a.color }]} 
                activeOpacity={0.85}
                onPress={() => router.push(`/article?title=${encodeURIComponent(a.title)}&category=${encodeURIComponent(a.category)}&emoji=${a.emoji}`)}
              >
                <Text style={styles.articleEmoji}>{a.emoji}</Text>
                <Text style={styles.articleCategory}>{a.category}</Text>
                <Text style={styles.articleTitle}>{a.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Premium Upsell */}
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumEmoji}>✨</Text>
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Unlock deeper insights</Text>
            <Text style={styles.premiumSubtitle}>Hormonal trends, AI predictions & more</Text>
          </View>
          <TouchableOpacity style={styles.premiumBtn} onPress={() => router.push('/paywall')}>
            <Text style={styles.premiumBtnText}>Premium</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.base },
  cycleCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cycleCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.base },
  cycleStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.lg },
  cycleStat: { alignItems: 'center' },
  cycleStatValue: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  cycleStatLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cycleStatDivider: { width: 1, backgroundColor: Colors.border, alignSelf: 'stretch', marginVertical: 4 },
  progressWrap: { gap: 6 },
  progressTrack: {
    height: 8, backgroundColor: Colors.lightGray, borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 11, color: Colors.textMuted },
  streakCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.base, marginBottom: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  streakEmoji: { fontSize: 28 },
  streakTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  streakSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  streakBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryBg, alignItems: 'center', justifyContent: 'center',
  },
  streakBadgeText: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    alignItems: 'center',
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  insightTag: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  insightTagText: { fontSize: 14, fontWeight: '600' },
  articleGrid: { gap: Spacing.sm },
  articleCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.base,
  },
  articleEmoji: { fontSize: 28, marginBottom: 6 },
  articleCategory: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
  articleTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, lineHeight: 22 },
  premiumBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.textPrimary, borderRadius: BorderRadius.xl,
    padding: Spacing.base, gap: Spacing.md, marginBottom: Spacing.md,
  },
  premiumEmoji: { fontSize: 28 },
  premiumText: { flex: 1 },
  premiumTitle: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  premiumSubtitle: { color: Colors.white + 'AA', fontSize: 12, marginTop: 2 },
  premiumBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base, paddingVertical: 8,
  },
  premiumBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
});
