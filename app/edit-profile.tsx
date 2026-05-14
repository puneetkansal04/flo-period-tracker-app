import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setGoal } from '@/store/slices/periodSlice';

export default function EditProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { birthYear, goal } = useSelector((s: RootState) => s.period);
  
  const [name, setName] = useState("Anonymous User");
  
  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name[0]}</Text>
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Text style={styles.editAvatarText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput 
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Birth Year</Text>
        <TextInput 
          value={birthYear ? birthYear.toString() : ''}
          editable={false}
          style={[styles.input, { color: Colors.textMuted }]}
        />
        <Text style={styles.hint}>Birth year cannot be changed.</Text>

        <Text style={styles.label}>Goal</Text>
        <TouchableOpacity style={styles.input} onPress={() => router.push('/onboarding/goal')}>
          <Text>{goal?.replace('_', ' ') || 'No Goal'}</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Tap to retake the goal questionnaire.</Text>
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
  cancelText: { fontSize: 16, color: Colors.textSecondary },
  saveText: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
  scroll: { padding: Spacing.lg },
  avatarWrap: { alignItems: 'center', marginVertical: Spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarText: { color: Colors.white, fontWeight: '700', fontSize: 36 },
  editAvatarBtn: { padding: Spacing.sm },
  editAvatarText: { color: Colors.primary, fontWeight: '600', fontSize: 15 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  input: { backgroundColor: Colors.white, padding: Spacing.md, borderRadius: BorderRadius.xl, fontSize: 16, color: Colors.textPrimary, marginBottom: 4 },
  hint: { fontSize: 12, color: Colors.textMuted, marginLeft: 4, marginBottom: Spacing.lg }
});
