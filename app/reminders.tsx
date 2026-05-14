import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

interface CustomReminder {
  id: string;
  title: string;
  time: Date;
  enabled: boolean;
  days: string[]; // ['Mon', 'Tue', ...]
}

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<CustomReminder[]>([
    { id: '1', title: 'Drink Water', time: new Date(new Date().setHours(9, 0, 0)), enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    { id: '2', title: 'Birth Control Pill', time: new Date(new Date().setHours(21, 0, 0)), enabled: true, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addReminder = async () => {
    if (!newTitle) return;
    const nr: CustomReminder = {
      id: Date.now().toString(),
      title: newTitle,
      time: newTime,
      enabled: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };
    setReminders([...reminders, nr]);
    setModalVisible(false);
    setNewTitle('');

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: nr.title,
        body: "It's time! Don't forget your task.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: nr.time.getHours(),
        minute: nr.time.getMinutes(),
        repeats: true,
      },
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders & Plans</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Your Daily Plan</Text>
        {reminders.map(r => (
          <View key={r.id} style={styles.reminderCard}>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>{r.title}</Text>
              <Text style={styles.reminderTime}>{moment(r.time).format('hh:mm A')}</Text>
              <Text style={styles.reminderDays}>{r.days.join(', ')}</Text>
            </View>
            <Switch
              value={r.enabled}
              onValueChange={() => toggleReminder(r.id)}
              trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
              thumbColor={r.enabled ? Colors.primary : Colors.borderDark}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.suggestedCard} onPress={() => {
          setNewTitle('Walk 10,000 steps');
          setModalVisible(true);
        }}>
          <View style={styles.suggestedIcon}>
            <Ionicons name="walk" size={24} color={Colors.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.suggestedTitle}>Add Exercise Goal</Text>
            <Text style={styles.suggestedSub}>Stay active during your cycle</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Reminder</Text>
            <TextInput
              style={styles.input}
              placeholder="What should we remind you about?"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor={Colors.textMuted}
            />
            
            <TouchableOpacity 
              style={styles.timeSelector} 
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeSelectorLabel}>Time</Text>
              <Text style={styles.timeSelectorValue}>{moment(newTime).format('hh:mm A')}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newTime}
                mode="time"
                is24Hour={false}
                onChange={(event, date) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (date) setNewTime(date);
                }}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addReminder}>
                <Text style={styles.saveBtnText}>Save Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.base },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', marginBottom: Spacing.lg, letterSpacing: 0.5 },
  reminderCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    padding: Spacing.lg, borderRadius: BorderRadius.xl, marginBottom: Spacing.md,
    ...Shadows.card,
  },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  reminderTime: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  reminderDays: { fontSize: 12, color: Colors.textMuted },
  suggestedCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED',
    padding: Spacing.lg, borderRadius: BorderRadius.xl, marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  suggestedIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  suggestedTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  suggestedSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: Spacing.xl, paddingBottom: 50 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.xl, textAlign: 'center' },
  input: {
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, fontSize: 16, color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  timeSelector: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing['2xl'],
  },
  timeSelectorLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  timeSelectorValue: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  modalActions: { flexDirection: 'row', gap: Spacing.md },
  cancelBtn: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: Colors.textMuted },
  saveBtn: { flex: 2, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.full, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
