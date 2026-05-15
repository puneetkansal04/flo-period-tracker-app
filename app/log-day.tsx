import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { logDay, logWeight, logWater } from '@/store/slices/periodSlice';
import { RootState } from '@/store';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/FloColors';
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
  const existingLog = dailyLogs ? dailyLogs[logDate] : null;
  const existingWeight = weightLogs ? weightLogs[logDate] : null;
  const existingWater = waterLogs ? waterLogs[logDate] : 0;

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
    dispatch(logDay({ 
      date: logDate, 
      log: { flow, moods, symptoms, mucus, sex, pill, temp } 
    }));
    if (weight) dispatch(logWeight({ date: logDate, weight: parseFloat(weight) }));
    dispatch(logWater({ date: logDate, water }));
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
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
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: Colors.primaryBg }]}>
              <Ionicons name="water" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Period Flow</Text>
          </View>
          <View style={styles.flowRow}>
            {FLOW_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.flowBtn, flow === opt.key && styles.flowBtnActive]}
                onPress={() => setFlow(flow === opt.key ? undefined : opt.key as FlowType)}
              >
                <Text style={styles.flowEmoji}>{opt.emoji}</Text>
                <Text style={[styles.flowLabel, flow === opt.key && styles.flowLabelActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="happy" size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Mood</Text>
          </View>
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

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#FFEDD5' }]}>
              <Ionicons name="flash" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.sectionTitle}>Symptoms</Text>
          </View>
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
                onPress={() => setMucus(mucus === type ? undefined : type)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconBg, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="scale" size={18} color="#3B82F6" />
            </View>
            <Text style={styles.sectionTitle}>Weight</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="0.0"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.unit}>kg</Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
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
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  saveBtn: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: BorderRadius.full },
  saveBtnText: { color: Colors.white, fontWeight: '700' },
  scroll: { padding: Spacing.lg },
  section: { backgroundColor: Colors.offWhite, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, ...Shadows.card },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  sectionIconBg: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  flowRow: { flexDirection: 'row', gap: 10 },
  flowBtn: { flex: 1, alignItems: 'center', padding: 12, borderRadius: BorderRadius.lg, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  flowBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  flowEmoji: { fontSize: 24, marginBottom: 4 },
  flowLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  flowLabelActive: { color: Colors.white },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.full, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  chipTextSelected: { color: Colors.white, fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textInput: { flex: 1, backgroundColor: Colors.white, padding: 12, borderRadius: BorderRadius.lg, fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  unit: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
});
