import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logDay } from '@/store/slices/periodSlice';
import { RootState } from '@/store';
import moment from 'moment';

export default function SymptomsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const todayStr = moment().format('YYYY-MM-DD');
  const savedSymptoms = useSelector((state: RootState) => state.period.dailyLogs[todayStr]?.symptoms) || [];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(savedSymptoms);

  useEffect(() => {
    setSelectedSymptoms(savedSymptoms);
  }, [savedSymptoms]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    dispatch(logDay({ date: todayStr, log: { symptoms: selectedSymptoms } }));
    router.back();
  };

  const categories = [
    {
      title: 'Period Flow',
      items: [
        { id: 'flow_light', label: 'Light', icon: '💧' },
        { id: 'flow_medium', label: 'Medium', icon: '💧💧' },
        { id: 'flow_heavy', label: 'Heavy', icon: '💧💧💧' },
      ]
    },
    {
      title: 'Mood',
      items: [
        { id: 'mood_calm', label: 'Calm', icon: '😌' },
        { id: 'mood_happy', label: 'Happy', icon: '😊' },
        { id: 'mood_sad', label: 'Sad', icon: '😔' },
        { id: 'mood_irritable', label: 'Irritable', icon: '😠' },
      ]
    },
    {
      title: 'Symptoms',
      items: [
        { id: 'symp_cramps', label: 'Cramps', icon: '⚡' },
        { id: 'symp_headache', label: 'Headache', icon: '💆' },
        { id: 'symp_bloating', label: 'Bloating', icon: '🎈' },
        { id: 'symp_tender', label: 'Tender Breasts', icon: '🍈' },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="#2d2d2d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Symptoms</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {categories.map(category => (
          <View key={category.title} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.grid}>
              {category.items.map(item => {
                const isSelected = selectedSymptoms.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.symptomItem,
                      isSelected && styles.symptomItemSelected
                    ]}
                    onPress={() => toggleSymptom(item.id)}
                  >
                    <Text style={styles.symptomIcon}>{item.icon}</Text>
                    <Text style={styles.symptomLabel}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf9f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d2d2d',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f4a7b9',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2d2d',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  symptomItem: {
    width: '30%',
    margin: '1.5%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  symptomItemSelected: {
    borderColor: '#f4a7b9',
    backgroundColor: '#fef0f2',
  },
  symptomIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  symptomLabel: {
    fontSize: 12,
    color: '#2d2d2d',
    textAlign: 'center',
  },
});
