import React from 'react';
import { StyleSheet, ScrollView, useColorScheme, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Calendar } from 'react-native-calendars';
import { usePeriodTracker } from '@/hooks/usePeriodTracker';
import moment from 'moment';

export default function CalendarScreen() {
  const { data, calculations } = usePeriodTracker();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const primaryColor = '#f4a7b9'; // Serene Cycle Pink
  const secondaryColor = '#ad8b91'; // Mauve
  const backgroundColor = isDark ? '#121212' : '#faf9f6';
  const cardBgColor = isDark ? '#1E1E1E' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#2d2d2d';

  // Generate marked dates
  const markedDates: any = {};
  
  // Mark period days
  const lastPeriod = moment(data.lastPeriodDate);
  for (let i = 0; i < data.periodLength; i++) {
    const dateStr = lastPeriod.clone().add(i, 'days').format('YYYY-MM-DD');
    markedDates[dateStr] = { selected: true, selectedColor: primaryColor, textColor: '#ffffff' };
  }

  // Mark predicted period days
  const nextPeriod = moment(calculations.nextPeriodDate);
  for (let i = 0; i < data.periodLength; i++) {
    const dateStr = nextPeriod.clone().add(i, 'days').format('YYYY-MM-DD');
    markedDates[dateStr] = { selected: true, selectedColor: '#FFE5E9', textColor: primaryColor };
  }

  // Mark ovulation day
  const ovulation = moment(calculations.ovulationDate);
  markedDates[ovulation.format('YYYY-MM-DD')] = { ...markedDates[ovulation.format('YYYY-MM-DD')], marked: true, dotColor: '#8A56AC' };

  // Mark fertile window
  const fertileStart = moment(calculations.fertileWindowStart);
  const fertileEnd = moment(calculations.fertileWindowEnd);
  let curr = fertileStart.clone();
  while (curr.isBefore(fertileEnd) || curr.isSame(fertileEnd)) {
    const dateStr = curr.format('YYYY-MM-DD');
    if (!markedDates[dateStr]) {
      markedDates[dateStr] = { selected: true, selectedColor: '#E8F0FE', textColor: '#1A73E8' };
    }
    curr.add(1, 'days');
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.header, { backgroundColor }]}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>Calendar</ThemedText>
      </ThemedView>
      
      <ThemedView style={[styles.calendarContainer, { backgroundColor: cardBgColor }]}>
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: cardBgColor,
            calendarBackground: cardBgColor,
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: primaryColor,
            selectedDayTextColor: '#ffffff',
            todayTextColor: primaryColor,
            dayTextColor: textColor,
            textDisabledColor: isDark ? '#444' : '#d9e1e8',
            dotColor: primaryColor,
            selectedDotColor: '#ffffff',
            arrowColor: primaryColor,
            monthTextColor: textColor,
            indicatorColor: primaryColor,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />
      </ThemedView>

      {/* Legend */}
      <ThemedView style={[styles.legendContainer, { backgroundColor }]}>
        <ThemedText type="subtitle" style={{ color: textColor, marginBottom: 10 }}>Legend</ThemedText>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.colorBox, { backgroundColor: primaryColor }]} />
          <ThemedText style={{ color: textColor }}>Period</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.colorBox, { backgroundColor: '#FFE5E9' }]} />
          <ThemedText style={{ color: textColor }}>Predicted Period</ThemedText>
        </ThemedView>
        <ThemedView style={styles.legendItem}>
          <ThemedView style={[styles.colorBox, { backgroundColor: '#E8F0FE' }]} />
          <ThemedText style={{ color: textColor }}>Fertile Window</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  calendarContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legendContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
});
