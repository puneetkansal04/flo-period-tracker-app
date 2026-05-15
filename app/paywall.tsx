import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setPremium } from '@/store/slices/periodSlice';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { LinearGradient } from 'expo-linear-gradient';
import { useIAP, requestSubscription, getSubscriptions, Subscription } from 'react-native-iap';

const SUBSCRIPTION_ID = 'premium_subscription';
const MONTHLY_BASE_PLAN = 'premium-monthly-plan';
const ANNUAL_BASE_PLAN = 'premium-annual-plan';

export default function PaywallScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { connected, subscriptions, getSubscriptions, currentPurchase, finishTransaction, getAvailablePurchases } = useIAP();
  
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    if (connected) {
      getSubscriptions({ skus: [SUBSCRIPTION_ID] });
    }
  }, [connected]);

  useEffect(() => {
    const checkPurchase = async () => {
      if (currentPurchase) {
        try {
          await finishTransaction({ purchase: currentPurchase, isConsumable: false });
          dispatch(setPremium(true));
          router.back();
        } catch (error) {
          console.error('Error finishing transaction', error);
        }
      }
    };
    checkPurchase();
  }, [currentPurchase]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const selectedBasePlanId = selectedPlan === 'monthly' ? MONTHLY_BASE_PLAN : ANNUAL_BASE_PLAN;
      const sub = subscriptions.find(s => s.productId === SUBSCRIPTION_ID);
      
      if (!sub) {
        Alert.alert('Error', 'Subscription details not found. Please try again later.');
        return;
      }

      const offer = sub.subscriptionOfferDetails?.find(o => o.basePlanId === selectedBasePlanId);
      
      if (!offer) {
        Alert.alert('Error', 'Pricing plan not found in the store.');
        return;
      }

      await requestSubscription({
        sku: SUBSCRIPTION_ID,
        subscriptionOffers: [{
          productId: SUBSCRIPTION_ID,
          basePlanId: selectedBasePlanId,
        }]
      });
    } catch (err: any) {
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert('Subscription Error', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: 'calendar', title: 'Advanced cycle predictions', subtitle: 'Know exactly when your period will start' },
    { icon: 'body', title: 'Daily health insights', subtitle: 'Personalized articles based on your logs' },
    { icon: 'bar-chart', title: 'Symptom analysis', subtitle: 'Identify patterns in your cycle' },
    { icon: 'document-text', title: 'Personalized PDF reports', subtitle: 'Share your cycle data with your doctor' },
  ];

  // Fallback prices if store is not loaded yet
  const monthlyPrice = selectedPlan === 'monthly' ? '₹799' : '$9.99';
  const annualPrice = selectedPlan === 'annual' ? '₹3,299' : '$39.99';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary + '20', Colors.white, Colors.white]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {
            try {
              const purchases = await getAvailablePurchases();
              if (purchases && purchases.length > 0) {
                dispatch(setPremium(true));
                Alert.alert('Success', 'Your premium subscription has been restored.');
                router.back();
              } else {
                Alert.alert('Info', 'No active subscriptions found to restore.');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to restore purchases.');
            }
          }}>
            <Text style={styles.restoreText}>Restore</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.heroSection}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>Serene Premium</Text>
            </View>
            <Text style={styles.title}>Unlock your body's full potential</Text>
            <Text style={styles.subtitle}>Get personalized insights, advanced predictions, and more with Serene Premium.</Text>
          </View>

          <View style={styles.featuresList}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon as any} size={20} color={Colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.pricingSection}>
            <TouchableOpacity 
              style={[styles.pricingCard, selectedPlan === 'annual' && styles.pricingCardActive]}
              onPress={() => setSelectedPlan('annual')}
            >
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>Best Value</Text>
              </View>
              <Text style={styles.planName}>Annual Plan</Text>
              <Text style={styles.planPrice}>₹3,299 / year</Text>
              <Text style={styles.planDesc}>Just ₹275/month. Cancel anytime.</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.pricingCard, selectedPlan === 'monthly' && styles.pricingCardActive]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <Text style={styles.planName}>Monthly Plan</Text>
              <Text style={styles.planPrice}>₹799 / month</Text>
              <Text style={styles.planDesc}>Flexible. Cancel anytime.</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.subscribeBtn} 
            onPress={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.subscribeText}>Continue</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By continuing, you agree to our Terms of Use and Privacy Policy. Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  closeBtn: { padding: Spacing.sm },
  restoreText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, padding: Spacing.sm },
  scroll: { padding: Spacing.xl, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginBottom: Spacing.xl },
  logoBadge: {
    backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full, marginBottom: Spacing.lg,
  },
  logoText: { color: Colors.white, fontWeight: '800', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm, lineHeight: 34 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  featuresList: { gap: Spacing.lg, marginBottom: Spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  featureSubtitle: { fontSize: 13, color: Colors.textSecondary },
  pricingSection: { gap: Spacing.md },
  pricingCard: {
    borderWidth: 2, borderColor: Colors.border, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, position: 'relative',
  },
  pricingCardActive: {
    borderColor: Colors.primary, backgroundColor: Colors.primaryBg,
  },
  bestValueBadge: {
    position: 'absolute', top: -12, left: '50%', transform: [{ translateX: -40 }],
    backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  bestValueText: { color: Colors.white, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  planName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  planPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  planDesc: { fontSize: 13, color: Colors.textSecondary },
  footer: {
    padding: Spacing.xl, paddingTop: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  subscribeBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingVertical: 16, alignItems: 'center', marginBottom: Spacing.md,
  },
  subscribeText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  termsText: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', lineHeight: 14 },
});

