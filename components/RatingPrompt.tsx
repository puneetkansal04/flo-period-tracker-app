import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setHasRated, setLastRatingPromptDate } from '@/store/slices/periodSlice';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default function RatingPrompt() {
  const dispatch = useDispatch();
  const { hasRated, lastRatingPromptDate } = useSelector((state: RootState) => state.period);
  const [visible, setVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (hasRated) return;

    const today = moment().format('YYYY-MM-DD');
    if (lastRatingPromptDate !== today) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setVisible(true);
        dispatch(setLastRatingPromptDate(today));
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasRated, lastRatingPromptDate]);

  const handleRate = () => {
    dispatch(setHasRated(true));
    setVisible(false);
    // In a real app, you'd use StoreReview.requestReview()
    console.log('User tapped rate');
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={40} color={Colors.orange} />
          </View>
          <Text style={styles.title}>Enjoying Serene Cycle?</Text>
          <Text style={styles.subtitle}>
            Your feedback helps us improve and provide better insights for everyone.
          </Text>
          
          <TouchableOpacity style={styles.rateBtn} onPress={handleRate}>
            <Text style={styles.rateBtnText}>Rate now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.maybeBtn} onPress={handleDismiss}>
            <Text style={styles.maybeBtnText}>Maybe later</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.orange + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  rateBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.full,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rateBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  maybeBtn: {
    paddingVertical: 12,
  },
  maybeBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
