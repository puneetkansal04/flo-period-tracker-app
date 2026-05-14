import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

import { updateCalendarSettings } from '@/store/slices/periodSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function CalendarSettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { calendarSettings } = useSelector((state: RootState) => state.period);

  const toggleSetting = (key: keyof typeof calendarSettings) => {
    dispatch(updateCalendarSettings({ [key]: !calendarSettings[key] }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar Options</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Settings</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Show Ovulation</Text>
                <Text style={styles.rowSub}>Mark predicted ovulation day</Text>
              </View>
              <Switch 
                value={calendarSettings.showOvulation} 
                onValueChange={() => toggleSetting('showOvulation')}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={calendarSettings.showOvulation ? Colors.primary : Colors.borderDark}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Show Fertile Window</Text>
                <Text style={styles.rowSub}>Highlight high-fertility days</Text>
              </View>
              <Switch 
                value={calendarSettings.showFertile} 
                onValueChange={() => toggleSetting('showFertile')}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={calendarSettings.showFertile ? Colors.primary : Colors.borderDark}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Pregnancy Chance</Text>
                <Text style={styles.rowSub}>Show daily health tips</Text>
              </View>
              <Switch 
                value={calendarSettings.showPregnancyChance} 
                onValueChange={() => toggleSetting('showPregnancyChance')}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={calendarSettings.showPregnancyChance ? Colors.primary : Colors.borderDark}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>Week Starts on Monday</Text>
              </View>
              <Switch 
                value={calendarSettings.firstDayMonday} 
                onValueChange={() => toggleSetting('firstDayMonday')}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={calendarSettings.firstDayMonday ? Colors.primary : Colors.borderDark}
              />
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          These settings only affect the calendar view. Your cycle data remains unchanged.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.base },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { 
    fontSize: 13, fontWeight: '600', color: Colors.textSecondary, 
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg,
  },
  rowInfo: { flex: 1, marginRight: Spacing.md },
  rowLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  rowSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.base },
  footerText: {
    fontSize: 13, color: Colors.textMuted, textAlign: 'center',
    paddingHorizontal: Spacing.xl, lineHeight: 18, marginTop: Spacing.md,
  },
});
