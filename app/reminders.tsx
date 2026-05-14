import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleCycleNotifications } from '@/utils/notifications';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import moment from 'moment';

export default function RemindersScreen() {
  const router = useRouter();
  const { lastPeriodDate, cycleLength } = useSelector((s: RootState) => s.period);
  
  const [dailyReminder, setDailyReminder] = useState(true);
  const [periodApproaching, setPeriodApproaching] = useState(true);
  const [ovulationReminder, setOvulationReminder] = useState(true);

  const handleToggle = async (type: string, value: boolean) => {
    if (type === 'daily') setDailyReminder(value);
    if (type === 'period') setPeriodApproaching(value);
    if (type === 'ovulation') setOvulationReminder(value);

    // Re-calculate and schedule notifications
    const nextPeriodDate = lastPeriodDate 
      ? moment(lastPeriodDate).add(cycleLength, 'days') 
      : moment().add(14, 'days');
    const daysUntilPeriod = nextPeriodDate.diff(moment().startOf('day'), 'days');
    
    if (value) {
      await scheduleCycleNotifications(daysUntilPeriod);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Daily Log Reminder</Text>
              <Text style={styles.subtitle}>Get reminded to log your symptoms at 8 PM</Text>
            </View>
            <Switch 
              value={dailyReminder} 
              onValueChange={(val) => handleToggle('daily', val)} 
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Period Approaching</Text>
              <Text style={styles.subtitle}>Alert me 3 days before my period starts</Text>
            </View>
            <Switch 
              value={periodApproaching} 
              onValueChange={(val) => handleToggle('period', val)} 
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Ovulation Window</Text>
              <Text style={styles.subtitle}>Alert me when fertility is high</Text>
            </View>
            <Switch 
              value={ovulationReminder} 
              onValueChange={(val) => handleToggle('ovulation', val)} 
              trackColor={{ false: Colors.border, true: Colors.primary }}
            />
          </View>
        </View>

        <Text style={styles.footerText}>
          Notifications are locally scheduled based on your cycle data. We do not store your health data on our servers.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  iconBtn: { padding: Spacing.sm },
  scroll: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  textContainer: { flex: 1, paddingRight: Spacing.md },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  footerText: { marginTop: Spacing.lg, fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: Spacing.md, lineHeight: 18 }
});
