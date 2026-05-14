import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';

type DayInfo = {
  date: string;
  inCurrentMonth: boolean;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  isToday: boolean;
  hasLog: boolean;
};

function useCalendarDays(viewMonth: moment.Moment) {
  const { lastPeriodDate, cycleLength, periodLength, dailyLogs } = useSelector(
    (s: RootState) => s.period
  );

  const start = viewMonth.clone().startOf('month').startOf('week');
  const end = viewMonth.clone().endOf('month').endOf('week');
  const today = moment().startOf('day');

  const days: DayInfo[] = [];
  let cursor = start.clone();

  while (cursor.isSameOrBefore(end)) {
    const date = cursor.format('YYYY-MM-DD');
    const lastPeriod = moment(lastPeriodDate).startOf('day');
    const diffDays = cursor.diff(lastPeriod, 'days');

    // Calculate cycle position
    let cycleDay = 0;
    if (diffDays >= 0) {
      cycleDay = (diffDays % cycleLength) + 1;
    } else {
      // Past cycles
      const cycleDiff = (-diffDays - 1) % cycleLength;
      cycleDay = cycleLength - cycleDiff;
    }

    const isPeriod = cycleDay >= 1 && cycleDay <= periodLength;

    // Ovulation ~day 14 from period start (cycle - 14)
    const ovulationDay = cycleLength - 14;
    const isOvulation = cycleDay === ovulationDay;
    const isFertile = cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1 && !isPeriod;

    days.push({
      date,
      inCurrentMonth: cursor.month() === viewMonth.month(),
      isPeriod,
      isFertile,
      isOvulation,
      isToday: cursor.isSame(today, 'day'),
      hasLog: !!dailyLogs[date],
    });

    cursor.add(1, 'day');
  }

  return days;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const router = useRouter();
  const [viewMonth, setViewMonth] = useState(moment().startOf('month'));
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const days = useCalendarDays(viewMonth);
  const { dailyLogs } = useSelector((s: RootState) => s.period);

  const selectedLog = dailyLogs[selectedDate];
  const selectedDayInfo = days.find(d => d.date === selectedDate);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity onPress={() => router.push('/calendar-settings')}>
          <Ionicons name="options-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Navigator */}
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

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.green }]} />
            <Text style={styles.legendText}>Fertile</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.orange }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.blue, borderRadius: 2 }]} />
            <Text style={styles.legendText}>Logged</Text>
          </View>
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarContainer}>
          {/* Weekday headers */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map(d => (
              <Text key={d} style={styles.weekday}>{d}</Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={styles.daysGrid}>
            {days.map((day) => {
              const isSelected = day.date === selectedDate;
              const bgColor = day.isToday ? Colors.primary :
                             day.isPeriod ? Colors.primary + 'CC' :
                             day.isOvulation ? Colors.orange :
                             day.isFertile ? Colors.green + 'CC' :
                             isSelected ? Colors.primaryBg : 'transparent';
              const textColor = (day.isToday || day.isPeriod || day.isOvulation || day.isFertile)
                ? Colors.white
                : isSelected ? Colors.primary
                : day.inCurrentMonth ? Colors.textPrimary : Colors.textMuted;

              return (
                <TouchableOpacity
                  key={day.date}
                  style={[styles.dayCell, { backgroundColor: bgColor }, isSelected && !day.isPeriod && !day.isOvulation && !day.isFertile && !day.isToday && styles.dayCellSelected]}
                  onPress={() => setSelectedDate(day.date)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayText, { color: textColor }, !day.inCurrentMonth && styles.dayTextFaded]}>
                    {moment(day.date).date()}
                  </Text>
                  {day.hasLog && !day.isPeriod && !day.isFertile && !day.isOvulation && !day.isToday && (
                    <View style={styles.logDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected day info */}
        <View style={styles.selectedDaySection}>
          <Text style={styles.selectedDayTitle}>{moment(selectedDate).format('dddd, MMMM D')}</Text>

          {selectedDayInfo && (
            <View style={styles.phaseInfo}>
              {selectedDayInfo.isPeriod && (
                <View style={[styles.phaseChip, { backgroundColor: Colors.primaryBg }]}>
                  <Text style={[styles.phaseChipText, { color: Colors.primary }]}>🌸 Period day</Text>
                </View>
              )}
              {selectedDayInfo.isOvulation && (
                <View style={[styles.phaseChip, { backgroundColor: Colors.orangeLight }]}>
                  <Text style={[styles.phaseChipText, { color: Colors.orange }]}>☀️ Ovulation day</Text>
                </View>
              )}
              {selectedDayInfo.isFertile && !selectedDayInfo.isOvulation && (
                <View style={[styles.phaseChip, { backgroundColor: Colors.greenLight }]}>
                  <Text style={[styles.phaseChipText, { color: Colors.green }]}>🌿 Fertile window</Text>
                </View>
              )}
              {!selectedDayInfo.isPeriod && !selectedDayInfo.isFertile && !selectedDayInfo.isOvulation && (
                <View style={[styles.phaseChip, { backgroundColor: Colors.blueLight }]}>
                  <Text style={[styles.phaseChipText, { color: Colors.blue }]}>📅 Regular day</Text>
                </View>
              )}
            </View>
          )}

          {selectedLog ? (
            <View style={styles.logCard}>
              <Text style={styles.logCardTitle}>Your log</Text>
              {selectedLog.flow && (
                <View style={styles.logRow}>
                  <Text style={styles.logRowLabel}>Flow:</Text>
                  <Text style={styles.logRowValue}>💧 {selectedLog.flow}</Text>
                </View>
              )}
              {(selectedLog.moods || []).length > 0 && (
                <View style={styles.logRow}>
                  <Text style={styles.logRowLabel}>Mood:</Text>
                  <Text style={styles.logRowValue}>{(selectedLog.moods || []).join(', ')}</Text>
                </View>
              )}
              {(selectedLog.symptoms || []).length > 0 && (
                <View style={styles.logRow}>
                  <Text style={styles.logRowLabel}>Symptoms:</Text>
                  <Text style={styles.logRowValue}>{(selectedLog.symptoms || []).join(', ')}</Text>
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.noLogCard} onPress={() => router.push(`/log-day?date=${selectedDate}`)}>
              <Ionicons name="add-circle-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.noLogText}>No log for this day. Tap to add</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 80 }} />
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
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
  },
  monthNavBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  monthLabel: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  legend: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: Colors.textSecondary },
  calendarContainer: { paddingHorizontal: Spacing.sm },
  weekRow: { flexDirection: 'row' },
  weekday: {
    flex: 1, textAlign: 'center', fontSize: 12,
    fontWeight: '600', color: Colors.textMuted,
    paddingVertical: Spacing.sm,
  },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    position: 'relative',
  },
  dayCellSelected: { borderWidth: 1.5, borderColor: Colors.primary },
  dayText: { fontSize: 14, fontWeight: '500' },
  dayTextFaded: { opacity: 0.3 },
  logDot: {
    position: 'absolute',
    bottom: 4,
    width: 4, height: 4,
    borderRadius: 2,
    backgroundColor: Colors.blue,
  },
  selectedDaySection: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectedDayTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  phaseInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  phaseChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  phaseChipText: { fontSize: 13, fontWeight: '600' },
  logCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  logCardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  logRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  logRowLabel: { fontSize: 13, color: Colors.textSecondary, width: 80 },
  logRowValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500', flex: 1 },
  noLogCard: {
    alignItems: 'center', padding: Spacing['2xl'],
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.lg, gap: Spacing.sm,
  },
  noLogText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  noLogHint: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});
