import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';

const { width } = Dimensions.get('window');

type DayInfo = {
  date: string;
  inCurrentMonth: boolean;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isToday: boolean;
  hasLog: boolean;
  chance: 'Low' | 'Medium' | 'High';
};

const DEFAULT_SETTINGS = {
  showOvulation: true,
  showFertile: true,
  showPregnancyChance: true,
  firstDayMonday: false,
};

export default function CalendarScreen() {
  const router = useRouter();
  const [viewMonth, setViewMonth] = useState(moment().startOf('month'));
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  
  const period = useSelector((s: RootState) => s.period);
  const { lastPeriodDate, cycleLength = 28, periodLength = 5, dailyLogs = {}, calendarSettings } = period || {};
  const safeSettings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...calendarSettings }), [calendarSettings]);

  const days = useMemo(() => {
    const start = viewMonth.clone().startOf('month');
    const startDay = start.day();
    const targetStart = safeSettings.firstDayMonday ? 1 : 0;
    const daysToSubtract = (startDay - targetStart + 7) % 7;
    start.subtract(daysToSubtract, 'days');

    const end = viewMonth.clone().endOf('month');
    const endDay = end.day();
    const targetEnd = safeSettings.firstDayMonday ? 0 : 6;
    const daysToAdd = (targetEnd - endDay + 7) % 7;
    end.add(daysToAdd, 'days');
    const today = moment().startOf('day');

    const result: DayInfo[] = [];
    let cursor = start.clone();

    while (cursor.isSameOrBefore(end)) {
      const date = cursor.format('YYYY-MM-DD');
      const lastPeriod = moment(lastPeriodDate || new Date()).startOf('day');
      const diffDays = cursor.diff(lastPeriod, 'days') || 0;

      let cycleDay = 0;
      if (diffDays >= 0) {
        cycleDay = (diffDays % cycleLength) + 1;
      } else {
        const cycleDiff = (-diffDays - 1) % cycleLength;
        cycleDay = cycleLength - cycleDiff;
      }

      const isPeriod = cycleDay >= 1 && cycleDay <= periodLength;
      const ovulationDay = cycleLength - 14;
      const isOvulation = cycleDay === ovulationDay;
      const isFertile = cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1;
      
      let chance: 'Low' | 'Medium' | 'High' = 'Low';
      if (isOvulation) chance = 'High';
      else if (isFertile) chance = 'High';
      else if (cycleDay >= ovulationDay - 7 && cycleDay <= ovulationDay + 2) chance = 'Medium';

      result.push({
        date,
        inCurrentMonth: cursor.month() === viewMonth.month(),
        isPeriod,
        isFertile: isFertile && !isPeriod,
        isOvulation: isOvulation && !isPeriod,
        isToday: cursor.isSame(today, 'day'),
        hasLog: !!(dailyLogs && dailyLogs[date]),
        chance,
      });

      cursor.add(1, 'day');
    }
    return result;
  }, [viewMonth, lastPeriodDate, cycleLength, periodLength, safeSettings, dailyLogs]);

  const selectedLog = dailyLogs[selectedDate] || null;
  const selectedDayInfo = days.find(d => d.date === selectedDate);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.premiumBadge} onPress={() => router.push('/paywall')}>
            <Ionicons name="sparkles" size={14} color={Colors.white} />
            <Text style={styles.premiumText}>UPGRADE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/calendar-settings')} style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.monthNav}>
          <TouchableOpacity
            style={styles.monthNavBtn}
            onPress={() => setViewMonth(m => m.clone().subtract(1, 'month'))}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{viewMonth.format('MMMM YYYY')}</Text>
          <TouchableOpacity
            style={styles.monthNavBtn}
            onPress={() => setViewMonth(m => m.clone().add(1, 'month'))}
          >
            <Ionicons name="chevron-forward" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Period</Text>
          </View>
          {safeSettings.showFertile && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.green }]} />
              <Text style={styles.legendText}>Fertile</Text>
            </View>
          )}
          {safeSettings.showOvulation && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.orange }]} />
              <Text style={styles.legendText}>Ovulation</Text>
            </View>
          )}
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.weekRow}>
            {(safeSettings.firstDayMonday 
              ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
              : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(d => (
              <Text key={d} style={styles.weekday}>{d}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day) => {
              const isSelected = day.date === selectedDate;
              
              let bgColor = 'transparent';
              if (day.isToday) bgColor = Colors.primary;
              else if (day.isPeriod) bgColor = Colors.primary + '30';
              else if (safeSettings.showOvulation && day.isOvulation) bgColor = Colors.orange + '40';
              else if (safeSettings.showFertile && day.isFertile) bgColor = Colors.green + '30';
              else if (isSelected) bgColor = Colors.lightGray;

              let textColor = Colors.textPrimary;
              if (day.isToday) textColor = Colors.white;
              else if (day.isPeriod) textColor = Colors.primaryDark;
              else if (safeSettings.showOvulation && day.isOvulation) textColor = Colors.orange;
              else if (safeSettings.showFertile && day.isFertile) textColor = Colors.green;
              else if (!day.inCurrentMonth) textColor = Colors.textMuted;

              return (
                <TouchableOpacity
                  key={day.date}
                  style={[styles.dayCell, { backgroundColor: bgColor }, isSelected && styles.selectedCell]}
                  onPress={() => setSelectedDate(day.date)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayText, { color: textColor, fontWeight: isSelected ? '800' : '500' }]}>
                    {moment(day.date).date()}
                  </Text>
                  {day.hasLog && !day.isPeriod && !day.isToday && (
                    <View style={styles.logDot} />
                  )}
                  {safeSettings.showOvulation && day.isOvulation && (
                    <View style={[styles.indicator, { backgroundColor: Colors.orange }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.selectedDaySection}>
          <Text style={styles.selectedDayTitle}>{moment(selectedDate).format('dddd, MMMM D')}</Text>
          
          <View style={styles.phaseInfo}>
            {selectedDayInfo?.isPeriod && (
              <View style={[styles.phaseChip, { backgroundColor: Colors.primaryBg }]}>
                <Text style={[styles.phaseChipText, { color: Colors.primary }]}>🌸 Period Day</Text>
              </View>
            )}
            {selectedDayInfo?.isOvulation && (
              <View style={[styles.phaseChip, { backgroundColor: Colors.orangeLight }]}>
                <Text style={[styles.phaseChipText, { color: Colors.orange }]}>☀️ Ovulation Day</Text>
              </View>
            )}
            {selectedDayInfo?.isFertile && !selectedDayInfo?.isOvulation && (
              <View style={[styles.phaseChip, { backgroundColor: Colors.greenLight }]}>
                <Text style={[styles.phaseChipText, { color: Colors.green }]}>🌿 Fertile Window</Text>
              </View>
            )}
            {safeSettings.showPregnancyChance && (
              <View style={[styles.phaseChip, { backgroundColor: Colors.offWhite, borderWidth: 1, borderColor: Colors.border }]}>
                <Text style={[styles.phaseChipText, { color: Colors.textSecondary }]}>
                  Pregnancy Chance: <Text style={{ fontWeight: '800', color: selectedDayInfo?.chance === 'High' ? Colors.green : Colors.textPrimary }}>{selectedDayInfo?.chance}</Text>
                </Text>
              </View>
            )}
          </View>

          {selectedLog ? (
            <View style={styles.logCard}>
              <View style={styles.logCardHeader}>
                <Text style={styles.logCardTitle}>Daily Log</Text>
                <TouchableOpacity onPress={() => router.push(`/log-day?date=${selectedDate}`)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              {selectedLog.flow && (
                <View style={styles.logRow}>
                  <Ionicons name="water" size={16} color={Colors.primary} />
                  <Text style={styles.logRowValue}>Flow: {selectedLog.flow}</Text>
                </View>
              )}
              {(selectedLog.moods || []).length > 0 && (
                <View style={styles.logRow}>
                  <Ionicons name="happy" size={16} color={Colors.orange} />
                  <Text style={styles.logRowValue}>Mood: {selectedLog.moods?.join(', ')}</Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.noLogBtn} onPress={() => router.push(`/log-day?date=${selectedDate}`)}>
              <Ionicons name="add-circle-outline" size={24} color={Colors.textMuted} />
              <Text style={styles.noLogText}>Add log for this day</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  premiumBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full, gap: 4,
    ...Shadows.button,
  },
  premiumText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  settingsBtn: { padding: 4 },
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  monthNavBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  legend: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  calendarContainer: { paddingHorizontal: Spacing.sm },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: Colors.textMuted, paddingVertical: 8 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, position: 'relative', marginVertical: 2,
  },
  selectedCell: { borderWidth: 2, borderColor: Colors.primary },
  dayText: { fontSize: 15, fontWeight: '500' },
  logDot: { position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.blue },
  indicator: { position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: 3 },
  selectedDaySection: { padding: Spacing.lg, marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  selectedDayTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.md },
  phaseInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg },
  phaseChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
  phaseChipText: { fontSize: 13, fontWeight: '700' },
  logCard: { backgroundColor: Colors.offWhite, borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadows.card },
  logCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  editLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  logRowValue: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  noLogBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 20, backgroundColor: Colors.offWhite, borderRadius: BorderRadius.xl,
    borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.borderDark,
  },
  noLogText: { fontSize: 15, color: Colors.textMuted, fontWeight: '600' },
});
