import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logDay } from '@/store/slices/periodSlice';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

const FLOW_OPTIONS = [
  { key: 'spotting', label: 'Spotting', emoji: '🔴', color: '#FECACA' },
  { key: 'light', label: 'Light', emoji: '💧', color: '#FCA5A5' },
  { key: 'medium', label: 'Medium', emoji: '💧💧', color: '#F87171' },
  { key: 'heavy', label: 'Heavy', emoji: '💧💧💧', color: '#EF4444' },
];

const MOODS = [
  { key: 'happy', label: 'Happy', emoji: '😊' },
  { key: 'calm', label: 'Calm', emoji: '😌' },
  { key: 'sensitive', label: 'Sensitive', emoji: '🥺' },
  { key: 'anxious', label: 'Anxious', emoji: '😰' },
  { key: 'sad', label: 'Sad', emoji: '😢' },
  { key: 'irritated', label: 'Irritated', emoji: '😤' },
  { key: 'energetic', label: 'Energetic', emoji: '⚡' },
  { key: 'tired', label: 'Tired', emoji: '😴' },
  { key: 'mood_swings', label: 'Mood swings', emoji: '🌊' },
];

const SYMPTOMS = [
  { key: 'cramps', label: 'Cramps', emoji: '⚡' },
  { key: 'headache', label: 'Headache', emoji: '🤕' },
  { key: 'backache', label: 'Backache', emoji: '🔙' },
  { key: 'bloating', label: 'Bloating', emoji: '🫧' },
  { key: 'breast_tenderness', label: 'Breast tenderness', emoji: '💔' },
  { key: 'nausea', label: 'Nausea', emoji: '🤢' },
  { key: 'fatigue', label: 'Fatigue', emoji: '💤' },
  { key: 'acne', label: 'Acne', emoji: '😶' },
];

type FlowType = 'spotting' | 'light' | 'medium' | 'heavy' | undefined;

function ChipButton({ label, emoji, selected, onPress }: {
  label: string; emoji: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.chipEmoji}>{emoji}</Text>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LogDayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const logDate = (params.date as string) || moment().format('YYYY-MM-DD');
  const existingLog = useSelector((s: RootState) => s.period.dailyLogs[logDate]);

  const [flow, setFlow] = useState<FlowType>(existingLog?.flow);
  const [moods, setMoods] = useState<string[]>(existingLog?.moods || []);
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptoms || []);

  const toggleMood = (key: string) => {
    setMoods(prev => prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]);
  };
  const toggleSymptom = (key: string) => {
    setSymptoms(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const handleSave = () => {
    dispatch(logDay({ date: logDate, log: { flow, moods, symptoms } }));
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{moment(logDate).format('MMMM D')}</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Period Flow */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>💧</Text>
            <Text style={styles.sectionTitle}>Period</Text>
          </View>
          <Text style={styles.sectionSubtitle}>How heavy is your flow today?</Text>
          <View style={styles.flowRow}>
            {FLOW_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.flowBtn,
                  flow === opt.key && { backgroundColor: opt.color, borderColor: Colors.primary },
                ]}
                onPress={() => setFlow(flow === opt.key ? undefined : opt.key as FlowType)}
                activeOpacity={0.8}
              >
                <Text style={styles.flowEmoji}>{opt.emoji}</Text>
                <Text style={[styles.flowLabel, flow === opt.key && styles.flowLabelSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Moods */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>😊</Text>
            <Text style={styles.sectionTitle}>Mood</Text>
          </View>
          <Text style={styles.sectionSubtitle}>How are you feeling today?</Text>
          <View style={styles.chipsWrap}>
            {MOODS.map(m => (
              <ChipButton
                key={m.key}
                label={m.label}
                emoji={m.emoji}
                selected={moods.includes(m.key)}
                onPress={() => toggleMood(m.key)}
              />
            ))}
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>⚡</Text>
            <Text style={styles.sectionTitle}>Symptoms</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Any physical symptoms?</Text>
          <View style={styles.chipsWrap}>
            {SYMPTOMS.map(s => (
              <ChipButton
                key={s.key}
                label={s.label}
                emoji={s.emoji}
                selected={symptoms.includes(s.key)}
                onPress={() => toggleSymptom(s.key)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: Colors.textPrimary },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  saveBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  scroll: { padding: Spacing.base },
  section: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  sectionIcon: { fontSize: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  sectionSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: Spacing.md },
  flowRow: { flexDirection: 'row', gap: Spacing.sm },
  flowBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 4,
  },
  flowEmoji: { fontSize: 20 },
  flowLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  flowLabelSelected: { color: Colors.primary, fontWeight: '700' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },
  chipEmoji: { fontSize: 16 },
  chipLabel: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  chipLabelSelected: { color: Colors.primary, fontWeight: '600' },
});
