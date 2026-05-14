import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { Ionicons } from '@expo/vector-icons';

const CheckBox = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkbox}>
    {checked ? (
      <View style={styles.checkboxChecked}>
        <Ionicons name="checkmark" size={14} color="#fff" />
      </View>
    ) : (
      <View style={styles.checkboxUnchecked} />
    )}
  </TouchableOpacity>
);

export default function PrivacyScreen() {
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeHealth, setAgreeHealth] = useState(false);
  const [agreeTracking, setAgreeTracking] = useState(false);

  const canProceed = agreeTerms && agreeHealth;

  const acceptAll = () => {
    setAgreeTerms(true);
    setAgreeHealth(true);
    setAgreeTracking(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        {/* Flo Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>flo</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Privacy first</Text>
        <Text style={styles.subtitle}>
          Flo is a safe space for you. Please read and accept these terms to continue.
        </Text>

        {/* Consent items */}
        <View style={styles.consentList}>
          <TouchableOpacity style={styles.consentRow} onPress={() => setAgreeTerms(!agreeTerms)} activeOpacity={0.7}>
            <CheckBox checked={agreeTerms} onPress={() => setAgreeTerms(!agreeTerms)} />
            <View style={styles.consentTextWrap}>
              <Text style={styles.consentText}>
                I agree to{' '}
                <Text style={styles.link}>Privacy Policy</Text>
                {' '}and{' '}
                <Text style={styles.link}>Terms of Use</Text>.
              </Text>
              <Text style={styles.required}>Required</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.consentRow} onPress={() => setAgreeHealth(!agreeHealth)} activeOpacity={0.7}>
            <CheckBox checked={agreeHealth} onPress={() => setAgreeHealth(!agreeHealth)} />
            <View style={styles.consentTextWrap}>
              <Text style={styles.consentText}>
                I agree to processing of my personal health data for providing me app functions.
              </Text>
              <Text style={styles.required}>Required</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.consentRow} onPress={() => setAgreeTracking(!agreeTracking)} activeOpacity={0.7}>
            <CheckBox checked={agreeTracking} onPress={() => setAgreeTracking(!agreeTracking)} />
            <View style={styles.consentTextWrap}>
              <Text style={styles.consentText}>
                I agree to tracking my app activity to improve performance and promote services.
              </Text>
              <Text style={styles.optional}>Optional</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Accept All */}
        <TouchableOpacity style={styles.acceptAllBtn} onPress={acceptAll} activeOpacity={0.8}>
          <Text style={styles.acceptAllText}>Accept all</Text>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
          onPress={() => canProceed && router.push('/onboarding/goal')}
          activeOpacity={canProceed ? 0.85 : 1}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Your data is encrypted and never sold to third parties.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.md,
  },
  consentList: {
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  checkbox: {
    marginTop: 2,
  },
  checkboxChecked: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.white,
  },
  consentTextWrap: {
    flex: 1,
  },
  consentText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  link: {
    color: Colors.primary,
    fontWeight: '600',
  },
  required: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optional: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
  },
  acceptAllBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  acceptAllText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: Spacing.xl,
  },
  nextBtnDisabled: {
    backgroundColor: Colors.borderDark,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
