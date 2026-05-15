import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Switch, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setGoal, resetOnboarding, GoalType, setPregnant, setLockEnabled } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type SettingRowProps = {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  color?: string;
};

function SettingRow({ icon, label, subtitle, onPress, rightElement, color }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={[styles.settingIcon, { backgroundColor: (color || Colors.primary) + '15' }]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />)}
    </TouchableOpacity>
  );
}

const GOALS: { key: GoalType; label: string; emoji: string }[] = [
  { key: 'track_cycle', label: 'Track my cycle', emoji: '🌸' },
  { key: 'get_pregnant', label: 'Get pregnant', emoji: '🤱' },
  { key: 'track_pregnancy', label: 'Track pregnancy', emoji: '👶' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { goal, cycleLength, periodLength, birthYear, isPregnant, isLockEnabled } = useSelector((s: RootState) => s.period);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset your onboarding data and you will need to set up the app again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => dispatch(resetOnboarding()),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Anonymous User</Text>
            <Text style={styles.profileSub}>Born {birthYear || 'Not set'} · {goal?.replace('_', ' ') || 'No goal set'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/edit-profile')}>
            <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Goal */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>My goal</Text>
          <View style={styles.card}>
            {GOALS.map((g, i) => {
              const isSelected = goal === g.key;
              return (
                <React.Fragment key={g.key}>
                  <TouchableOpacity
                    style={[styles.goalRow, isSelected && styles.goalRowSelected]}
                    onPress={() => dispatch(setGoal(g.key))}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.goalEmoji}>{g.emoji}</Text>
                    <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>{g.label}</Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
                  </TouchableOpacity>
                  {i < GOALS.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>Reminders & Plans</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/reminders')}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Daily Reminders</Text>
                <Text style={styles.settingSubtitle}>Set custom alarms for water, pills, etc.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Mode */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>App Mode</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>I am pregnant</Text>
                <Text style={styles.settingSubtitle}>Switch to pregnancy tracking</Text>
              </View>
              <Switch 
                value={isPregnant} 
                onValueChange={(val) => { dispatch(setPregnant(val)); }}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={isPregnant ? Colors.primary : Colors.borderDark}
              />
            </View>
          </View>
        </View>

        {/* Security & Privacy */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>Security & Privacy</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={[styles.settingIcon, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="lock-closed-outline" size={20} color="#0EA5E9" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>PIN Lock</Text>
                <Text style={styles.settingSubtitle}>Secure your data with a PIN</Text>
              </View>
              <Switch 
                value={isLockEnabled} 
                onValueChange={(val) => { dispatch(setLockEnabled(val)); if(val) Alert.alert("PIN Setup", "PIN lock will be enabled. Please remember your device's security PIN."); }}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={isLockEnabled ? Colors.primary : Colors.borderDark}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={[styles.settingIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="eye-off-outline" size={20} color="#16A34A" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Secret Mode</Text>
                <Text style={styles.settingSubtitle}>Calculator disguise for privacy</Text>
              </View>
              <Switch 
                value={isSecretModeEnabled} 
                onValueChange={(val) => dispatch(setSecretModeEnabled(val))}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={isSecretModeEnabled ? Colors.primary : Colors.borderDark}
              />
            </View>
          </View>
        </View>

        {/* Cycle Settings */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>Cycle settings</Text>
          <View style={styles.card}>
            <SettingRow
              icon={<Ionicons name="water-outline" size={20} color={Colors.primary} />}
              label="Cycle length"
              subtitle={`${cycleLength} days`}
              color={Colors.primary}
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<Ionicons name="calendar-outline" size={20} color={Colors.orange} />}
              label="Period length"
              subtitle={`${periodLength} days`}
              color={Colors.orange}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>Notifications</Text>
          <View style={styles.card}>
            <SettingRow
              icon={<Ionicons name="notifications-outline" size={20} color={Colors.blue} />}
              label="Push notifications"
              subtitle="Period and ovulation alerts"
              color={Colors.blue}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                  thumbColor={notificationsEnabled ? Colors.primary : Colors.borderDark}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<Ionicons name="alarm-outline" size={20} color={Colors.purple} />}
              label="Daily reminders"
              subtitle="Remind me to log my day"
              color={Colors.purple}
              rightElement={
                <Switch
                  value={remindersEnabled}
                  onValueChange={setRemindersEnabled}
                  trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                  thumbColor={remindersEnabled ? Colors.primary : Colors.borderDark}
                />
              }
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionGroupTitle}>App</Text>
          <View style={styles.card}>
            <SettingRow
              icon={<Ionicons name="notifications-outline" size={20} color={Colors.primary} />}
              label="Reminders & Notifications"
              color={Colors.primary}
              onPress={() => router.push('/reminders')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<Ionicons name="star-outline" size={20} color={Colors.orange} />}
              label="Rate the app"
              color={Colors.orange}
              onPress={() => {
                const pkg = "com.puneetkansal04.flo";
                const url = `https://play.google.com/store/apps/details?id=${pkg}`;
                require('react-native').Linking.openURL(url);
              }}
            />
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.sectionGroup}>
          <View style={styles.card}>
            <SettingRow
              icon={<Ionicons name="refresh-outline" size={20} color={Colors.primary} />}
              label="Reset onboarding"
              subtitle="Start over with setup"
              color={Colors.primary}
              onPress={handleResetOnboarding}
            />
          </View>
        </View>

        <Text style={styles.version}>Serene Cycle v1.0.0 · Made with ❤️</Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.base },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    padding: Spacing.base, marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  profileAvatarText: { color: Colors.white, fontSize: 22, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  profileSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  editBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sectionGroup: { marginBottom: Spacing.md },
  sectionGroupTitle: {
    fontSize: 13, fontWeight: '600', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: Spacing.sm, paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  settingSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 52 + Spacing.base * 2 },
  goalRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
  },
  goalRowSelected: { backgroundColor: Colors.primaryBg },
  goalEmoji: { fontSize: 20, width: 28 },
  goalLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  goalLabelSelected: { color: Colors.primary, fontWeight: '600' },
  version: {
    textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: Spacing.md,
  },
});
