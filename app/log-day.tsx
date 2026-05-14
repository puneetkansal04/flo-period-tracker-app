import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logDay, logWeight, logWater } from '@/store/slices/periodSlice';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

import { FLOW_OPTIONS, MOODS, SYMPTOMS } from '@/constants/LogOptions';

type FlowType = 'spotting' | 'light' | 'medium' | 'heavy' | undefined;

function ChipButton({ label, emoji, selected, onPress }: {
  label: string; emoji?: string; selected: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {emoji ? `${emoji} ${label}` : label}
      </Text>
    </TouchableOpacity>
  );
}

export default function LogDayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const logDate = (params.date as string) || moment().format('YYYY-MM-DD');
  const { dailyLogs, weightLogs, waterLogs } = useSelector((s: RootState) => s.period);
  const existingLog = (dailyLogs || {})[logDate];
  const existingWeight = (weightLogs || {})[logDate];
  const existingWater = (waterLogs || {})[logDate];

  const [flow, setFlow] = useState<FlowType>(existingLog?.flow);
  const [moods, setMoods] = useState<string[]>(existingLog?.moods || []);
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptoms || []);
  const [weight, setWeight] = useState<string>(existingWeight ? existingWeight.toString() : '');
  const [water, setWater] = useState<number>(existingWater || 0);
  const [mucus, setMucus] = useState<string | undefined>(existingLog?.mucus);
  const [sex, setSex] = useState<boolean | undefined>(existingLog?.sex);
  const [pill, setPill] = useState<boolean | undefined>(existingLog?.pill);
  const [temp, setTemp] = useState<string>(existingLog?.temp || '');

  const toggleMood = (key: string) => {
    setMoods(prev => prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]);
  };
  const toggleSymptom = (key: string) => {
    setSymptoms(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const handleSave = () => {
    dispatch(logDay({ date: logDate, log: { flow, moods, symptoms, mucus, sex, pill, temp } }));
    if (weight) dispatch(logWeight({ date: logDate, weight: parseFloat(weight) }));
    dispatch(logWater({ date: logDate, water }));
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
            <View style={[styles.sectionIconBg, { backgroundColor: Colors.primaryBg }]}>
              <Ionicons name="water" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Period</Text>
          </View>
          <Text style={styles.sectionSubtitle}>How heavy is your flow today?</Text>
          <View style={styles.flowRow}>
            {FLOW_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.flowBtn,
                  flow === opt.key && { backgroundColor: Colors.primary, borderColor: Colors.primary },
                ]}
                onPress={() => setFlow(flow === opt.key ? undefined : opt.key as FlowType)}
                activeOpacity={0.8}
              >
                <Text style={styles.flowEmoji}>{opt.emoji}</Text>
                <Text style={[
                  styles.flowLabel, 
                  flow === opt.key && { color: Colors.white, fontWeight: '700' }
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Moods */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="happy" size={18} color="#8B5CF6" />
            </View>
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

        {/* Temperature */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="thermometer-outline" size={18} color="#EF4444" />
            </View>
            <Text style={styles.sectionTitle}>Temperature (BBT)</Text>
          </View>
          <View style={styles.weightInputRow}>
            <TextInput
              style={styles.weightInput}
              placeholder="36.5"
              keyboardType="numeric"
              value={temp}
              onChangeText={setTemp}
            />
            <Text style={styles.weightUnit}>°C</Text>
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFEDD5' }]}>
              <Ionicons name="flash" size={18} color="#F59E0B" />
            </View>
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

        {/* Weight */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="scale" size={18} color="#3B82F6" />
            </View>
            <Text style={styles.sectionTitle}>Weight</Text>
          </View>
          <View style={styles.weightInputRow}>
            <TextInput
              style={styles.weightInput}
              placeholder="0.0"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.weightUnit}>kg</Text>
          </View>
        </View>

        {/* Secretions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="color-wand-outline" size={18} color="#DB2777" />
            </View>
            <Text style={styles.sectionTitle}>Secretions</Text>
          </View>
          <View style={styles.chipsWrap}>
            {['Dry', 'Creamy', 'Watery', 'Eggwhite', 'Sticky'].map(type => (
              <ChipButton
                key={type}
                label={type}
                selected={mucus === type}
                onPress={() => setMucus(type)}
              />
            ))}
          </View>
        </View>

        {/* Sexual Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFE4E6' }]}>
              <Ionicons name="heart-outline" size={18} color="#E11D48" />
            </View>
            <Text style={styles.sectionTitle}>Sexual Activity</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.toggleBtn, sex === true && styles.toggleBtnActive]}
              onPress={() => setSex(true)}
            >
              <Text style={[styles.toggleBtnText, sex === true && styles.toggleBtnTextActive]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, sex === false && styles.toggleBtnActive]}
              onPress={() => setSex(false)}
            >
              <Text style={[styles.toggleBtnText, sex === false && styles.toggleBtnTextActive]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pills */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="medical-outline" size={18} color="#0284C7" />
            </View>
            <Text style={styles.sectionTitle}>Medication / Pill</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.toggleBtn, pill === true && styles.toggleBtnActive]}
              onPress={() => setPill(true)}
            >
              <Text style={[styles.toggleBtnText, pill === true && styles.toggleBtnTextActive]}>Taken</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, pill === false && styles.toggleBtnActive]}
              onPress={() => setPill(false)}
            >
              <Text style={[styles.toggleBtnText, pill === false && styles.toggleBtnTextActive]}>Not Taken</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Water */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="color-filter" size={18} color="#0EA5E9" />
            </View>
            <Text style={styles.sectionTitle}>Water</Text>
          </View>
          <View style={styles.waterHeader}>
            <Text style={styles.waterTotal}>{water} ml</Text>
            <TouchableOpacity onPress={() => setWater(0)}>
              <Text style={styles.waterReset}>Reset</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.waterRow}>
            {[250, 500].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.waterAddBtn}
                onPress={() => setWater(prev => prev + amount)}
              >
                <Ionicons name="add" size={20} color={Colors.primary} />
                <Text style={styles.waterAddText}>{amount}ml</Text>
              </TouchableOpacity>
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
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: 8 },
  sectionIconBg: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  chipTextSelected: { color: Colors.white, fontWeight: '700' },
  
  // Weight & Water
  weightInputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  weightInput: { 
    flex: 1, backgroundColor: Colors.white, padding: Spacing.md, 
    borderRadius: BorderRadius.lg, fontSize: 18, fontWeight: '600', color: Colors.textPrimary 
  },
  weightUnit: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600' },
  waterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  waterTotal: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  waterReset: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  waterRow: { flexDirection: 'row', gap: Spacing.md },
  waterAddBtn: { 
    flex: 1, flexDirection: 'row', backgroundColor: Colors.white, borderRadius: BorderRadius.lg, 
    padding: Spacing.md, alignItems: 'center', justifyContent: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.primary + '30'
  },
  waterAddText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  row: { flexDirection: 'row', gap: Spacing.md },
  toggleBtn: { 
    flex: 1, paddingVertical: 12, borderRadius: BorderRadius.lg, 
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  toggleBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  toggleBtnTextActive: { color: Colors.white },
});
