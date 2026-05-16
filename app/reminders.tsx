import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Modal, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

interface Alarm {
  id: string;
  title: string;
  time: string; // "09:00"
  enabled: boolean;
  type: 'water' | 'pill' | 'exercise' | 'custom';
}

const DEFAULT_ALARMS: Alarm[] = [
  { id: '1', title: 'Morning Water', time: '08:00', enabled: true, type: 'water' },
  { id: '2', title: 'Take Pill', time: '09:00', enabled: true, type: 'pill' },
  { id: '3', title: 'Lunch Walk', time: '13:30', enabled: false, type: 'exercise' },
  { id: '4', title: 'Evening Hydration', time: '18:00', enabled: true, type: 'water' },
];

export default function AlarmsScreen() {
  const router = useRouter();
  const [alarms, setAlarms] = useState<Alarm[]>(DEFAULT_ALARMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleAlarm = async (id: string) => {
    const updated = alarms.map(a => {
      if (a.id === id) {
        const nextState = !a.enabled;
        if (nextState) scheduleNotification(a);
        else cancelNotification(a.id);
        return { ...a, enabled: nextState };
      }
      return a;
    });
    setAlarms(updated);
  };

  const scheduleNotification = async (alarm: Alarm) => {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: alarm.id,
        content: {
          title: alarm.title,
          body: `It's ${alarm.time}! Don't forget your task.`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
    } catch (e) {
      console.warn("Failed to schedule:", e);
    }
  };

  const cancelNotification = async (id: string) => {
    await Notifications.cancelScheduledNotificationAsync(id);
  };

  const addAlarm = () => {
    if (!newTitle) return;
    const timeStr = moment(newTime).format('HH:mm');
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      title: newTitle,
      time: timeStr,
      enabled: true,
      type: 'custom',
    };
    setAlarms([...alarms, newAlarm]);
    scheduleNotification(newAlarm);
    setModalVisible(false);
    setNewTitle('');
  };

  const getIcon = (type: Alarm['type']) => {
    switch (type) {
      case 'water': return { name: 'water', color: '#3B82F6' };
      case 'pill': return { name: 'medical', color: Colors.primary };
      case 'exercise': return { name: 'walk', color: '#10B981' };
      default: return { name: 'notifications', color: Colors.orange };
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Alarms</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
          <Ionicons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Ionicons name="alarm-outline" size={24} color={Colors.primary} />
          <Text style={styles.infoText}>Stay on track with your routine. Alarms help you maintain healthy habits throughout your cycle.</Text>
        </View>

        <Text style={styles.sectionLabel}>Your Schedule</Text>
        {alarms.sort((a,b) => a.time.localeCompare(b.time)).map(alarm => {
          const icon = getIcon(alarm.type);
          return (
            <View key={alarm.id} style={[styles.alarmCard, !alarm.enabled && styles.alarmCardDisabled]}>
              <View style={[styles.iconCircle, { backgroundColor: icon.color + '15' }]}>
                <Ionicons name={icon.name as any} size={22} color={icon.color} />
              </View>
              <View style={styles.alarmInfo}>
                <Text style={[styles.alarmTime, !alarm.enabled && styles.textDisabled]}>
                  {moment(alarm.time, 'HH:mm').format('hh:mm A')}
                </Text>
                <Text style={[styles.alarmTitle, !alarm.enabled && styles.textDisabled]}>{alarm.title}</Text>
              </View>
              <Switch
                value={alarm.enabled}
                onValueChange={() => toggleAlarm(alarm.id)}
                trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
                thumbColor={alarm.enabled ? Colors.primary : Colors.borderDark}
              />
            </View>
          );
        })}

        <TouchableOpacity 
          style={styles.quickAddBtn} 
          onPress={() => {
            setNewTitle('Hydration Check');
            setModalVisible(true);
          }}
        >
          <Ionicons name="flash-outline" size={20} color={Colors.white} />
          <Text style={styles.quickAddText}>Quick Add Alarm</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Alarm</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Task Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning Yoga"
                value={newTitle}
                onChangeText={setNewTitle}
                placeholderTextColor={Colors.textMuted}
                autoFocus={false}
              />
              
              <Text style={styles.inputLabel}>Reminder Time</Text>
              <TouchableOpacity 
                style={styles.timeSelector} 
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={Colors.primary} />
                <Text style={styles.timeSelectorValue}>{moment(newTime).format('hh:mm A')}</Text>
              </TouchableOpacity>
  
              {showTimePicker && (() => {
                try {
                  const DateTimePicker = require('@react-native-community/datetimepicker').default;
                  return (
                    <DateTimePicker
                      value={newTime}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      is24Hour={false}
                      onChange={(event, date) => {
                        setShowTimePicker(Platform.OS === 'ios');
                        if (date) setNewTime(date);
                      }}
                    />
                  );
                } catch (e) {
                  return <Text style={styles.errorText}>Time picker unavailable. Using current time.</Text>;
                }
              })()}
  
              <TouchableOpacity style={styles.saveBtn} onPress={addAlarm}>
                <Text style={styles.saveBtnText}>Activate Alarm</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.lg },
  infoBox: {
    backgroundColor: Colors.primaryBg, padding: Spacing.lg,
    borderRadius: BorderRadius.xl, flexDirection: 'row', gap: 12, marginBottom: Spacing.xl,
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.primary, lineHeight: 18, fontWeight: '500' },
  sectionLabel: { fontSize: 12, fontWeight: '800', color: Colors.textMuted, textTransform: 'uppercase', marginBottom: Spacing.md, letterSpacing: 1 },
  alarmCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.offWhite,
    padding: Spacing.lg, borderRadius: BorderRadius.xl, marginBottom: Spacing.md,
    ...Shadows.card,
  },
  alarmCardDisabled: { opacity: 0.6 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  alarmInfo: { flex: 1 },
  alarmTime: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  alarmTitle: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500', marginTop: 2 },
  textDisabled: { color: Colors.textMuted },
  quickAddBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.full,
    marginTop: Spacing.lg, gap: 8, ...Shadows.button,
  },
  quickAddText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: Spacing.xl, paddingBottom: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  modalTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  inputLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, fontSize: 16, color: Colors.textPrimary,
    marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.border,
  },
  timeSelector: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.offWhite, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.xl,
    borderWidth: 1, borderColor: Colors.border,
  },
  timeSelectorValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  saveBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.full, alignItems: 'center', marginTop: Spacing.md },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  errorText: { color: 'red', textAlign: 'center', marginVertical: 10, fontSize: 12 },
});
