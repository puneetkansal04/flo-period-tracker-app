import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setBirthYear, setName, setEmail, updatePeriodData } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { birthYear, name, email, cycleLength, periodLength } = useSelector((s: RootState) => s.period);

  const [formName, setFormName] = useState(name || '');
  const [formEmail, setFormEmail] = useState(email || '');
  const [formBirthYear, setFormBirthYear] = useState(birthYear?.toString() || '');
  const [formCycle, setFormCycle] = useState(cycleLength.toString());
  const [formPeriod, setFormPeriod] = useState(periodLength.toString());

  const handleSave = () => {
    const year = parseInt(formBirthYear);
    const cycle = parseInt(formCycle);
    const period = parseInt(formPeriod);

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      Alert.alert('Invalid Year', 'Please enter a valid birth year.');
      return;
    }

    if (isNaN(cycle) || cycle < 15 || cycle > 45) {
      Alert.alert('Invalid Cycle', 'Cycle length should be between 15 and 45 days.');
      return;
    }

    dispatch(updatePeriodData({
      name: formName,
      email: formEmail,
      birthYear: year,
      cycleLength: cycle,
      periodLength: period
    }));

    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formName}
            onChangeText={setFormName}
            placeholder="Your name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={formEmail}
            onChangeText={setFormEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Birth Year</Text>
          <TextInput
            style={styles.input}
            value={formBirthYear}
            onChangeText={setFormBirthYear}
            placeholder="YYYY"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>Cycle Length</Text>
            <TextInput
              style={styles.input}
              value={formCycle}
              onChangeText={setFormCycle}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>Period Length</Text>
            <TextInput
              style={styles.input}
              value={formPeriod}
              onChangeText={setFormPeriod}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        <Text style={styles.infoText}>
          Updating your cycle data will recalculate your predictions and fertile window.
        </Text>
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
  section: { marginBottom: Spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  input: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: 'row', gap: Spacing.md },
  infoText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 18,
  },
});
