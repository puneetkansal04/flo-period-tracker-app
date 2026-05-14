import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setBirthYear } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - 10 - i);

export default function BirthYearScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedYear, setSelectedYear] = useState(currentYear - 25);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    dispatch(setBirthYear(selectedYear));
    router.push('/onboarding/last-period');
  };

  const initialIndex = years.indexOf(selectedYear);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '16%' }]} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>What year were you born?</Text>
        <Text style={styles.subtitle}>We'll use this to personalize your experience</Text>

        {/* Drum-roll picker */}
        <View style={styles.pickerContainer}>
          {/* Selection highlight */}
          <View style={styles.selectionHighlight} pointerEvents="none" />

          <FlatList
            ref={flatListRef}
            data={years}
            keyExtractor={(item) => String(item)}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT * 2,
            }}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
              if (index >= 0 && index < years.length) {
                setSelectedYear(years[index]);
              }
            }}
            renderItem={({ item }) => {
              const isSelected = item === selectedYear;
              return (
                <TouchableOpacity
                  style={styles.yearItem}
                  onPress={() => {
                    const idx = years.indexOf(item);
                    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
                    setSelectedYear(item);
                  }}
                >
                  <Text style={[styles.yearText, isSelected && styles.yearTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Text style={styles.selectedYearLabel}>Selected: {selectedYear}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 34,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing['2xl'],
  },
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    zIndex: 1,
  },
  yearItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearText: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  yearTextSelected: {
    fontSize: 26,
    color: Colors.primary,
    fontWeight: '700',
  },
  selectedYearLabel: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
