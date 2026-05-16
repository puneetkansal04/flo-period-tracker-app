import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setPremium } from '@/store/slices/periodSlice';
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/FloColors';
import { LinearGradient } from 'expo-linear-gradient';
import { Subscription, useIAP } from 'react-native-iap';
import { IAPService, SKU, BASE_PLANS } from '@/services/IAPService';
import { CustomAlert } from '@/components/CustomAlert';

export default function PaywallScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isPremium, premiumPlanType } = useSelector((state: RootState) => state.period);
  
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const { connected, fetchProducts: fetchIapProducts, subscriptions: iapSubscriptions, requestPurchase: requestIapPurchaseFromHook } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      console.log('[Paywall] Purchase success from hook:', purchase);
      dispatch(setPremium({ isPremium: true, planType: selectedPlan }));
      showAlert('🎉 Purchase Successful!', `You are now a Premium user on the ${selectedPlan} plan!`);
      setLoading(false);
      router.back();
    },
    onPurchaseError: (error) => {
      console.error('[Paywall] Purchase error from hook:', error);
      if (error.code === 'E_USER_CANCELLED') {
        showAlert('Cancelled', 'You have cancelled the operation.');
      } else {
        showAlert('Purchase Failed', error.message || 'Please try again.');
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (connected && !isPremium) {
      const fetchIAPData = async () => {
        try {
          await fetchIapProducts({ skus: [SKU.PREMIUM], type: 'subs' });
          console.log('[Paywall] Subscriptions fetch requested');
        } catch (err) {
          console.error('[Paywall] Error fetching subscriptions:', err);
        }
      };
      fetchIAPData();
    }
  }, [connected, isPremium]);

  const handleSubscribe = async () => {
    if (isPremium) {
      // Open store subscription management
      const url = Platform.OS === 'ios' 
        ? 'https://apps.apple.com/account/subscriptions' 
        : 'https://play.google.com/store/account/subscriptions';
      Linking.openURL(url);
      return;
    }

    setLoading(true);
    const sku = SKU.PREMIUM;
    try {
      let offers = [];
      const selectedBasePlanId = selectedPlan === 'monthly' ? BASE_PLANS.MONTHLY : BASE_PLANS.ANNUAL;
      
      const sub = iapSubscriptions.find(s => s.productId === sku);
      if (sub && sub.subscriptionOfferDetails && sub.subscriptionOfferDetails.length > 0) {
        const offer = sub.subscriptionOfferDetails.find(o => o.basePlanId === selectedBasePlanId);
        if (offer) {
          offers = [{ sku, offerToken: offer.offerToken }];
        }
      }

      console.log('[Paywall] Requesting subscription for SKU:', sku, 'with offers:', JSON.stringify(offers));
      await requestIapPurchaseFromHook({
        request: {
          google: { skus: [sku], subscriptionOffers: offers }
        },
        type: 'subs'
      });
    } catch (error: any) {
      console.error('[Paywall] Subscription request error:', error);
      if (error.code !== 'E_USER_CANCELLED') {
        showAlert('Purchase Failed', error.message || 'Please try again.');
      }
      setLoading(false);
    }
  };

  const features = [
    { icon: 'calendar', title: 'Advanced cycle predictions', subtitle: 'Know exactly when your period will start' },
    { icon: 'body', title: 'Daily health insights', subtitle: 'Personalized articles based on your logs' },
    { icon: 'bar-chart', title: 'Symptom analysis', subtitle: 'Identify patterns in your cycle' },
    { icon: 'document-text', title: 'Personalized PDF reports', subtitle: 'Share your cycle data with your doctor' },
    { icon: 'sparkles', title: 'AI Symptom Checker', subtitle: 'Get instant feedback on your logs' },
    { icon: 'videocam', title: 'Exclusive Health Content', subtitle: 'Yoga and wellness videos for every phase' },
    { icon: 'shield-checkmark', title: 'Ad-free Experience', subtitle: 'No interruptions, just health tracking' },
    { icon: 'headset', title: 'Priority Support', subtitle: '24/7 access to our support team' },
  ];

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
          {!isPremium && (
            <TouchableOpacity onPress={async () => {
              setLoading(true);
              try {
                const purchases = await IAPService.restorePurchases();
                if (purchases && purchases.length > 0) {
                  const hasPremium = purchases.some(p => p.productId === SKU.PREMIUM);
                  if (hasPremium) {
                    dispatch(setPremium(true));
                    showAlert('Success', 'Your premium subscription has been restored.');
                    setTimeout(() => router.back(), 1500);
                  } else {
                    showAlert('Info', 'No active premium subscription found in your account.');
                  }
                } else {
                  showAlert('Info', 'No active subscriptions found to restore.');
                }
              } catch (err) {
                console.error('[Paywall] Restore error:', err);
                showAlert('Error', 'Failed to restore purchases. Please try again.');
              } finally {
                setLoading(false);
              }
            }}>
              <Text style={styles.restoreText}>Restore</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.heroSection}>
            <View style={[styles.logoBadge, isPremium && styles.activeBadge]}>
              <Text style={styles.logoText}>
                {isPremium ? `${premiumPlanType?.toUpperCase() || ''} PLAN ACTIVE` : 'Serene Premium'}
              </Text>
            </View>
            <Text style={styles.title}>
              {isPremium ? "You're all set with Premium!" : "Unlock your body's full potential"}
            </Text>
            <Text style={styles.subtitle}>
              {isPremium 
                ? `You have full access to all features with your ${premiumPlanType || 'premium'} plan. Enjoy your personalized health journey.`
                : "Get personalized insights, advanced predictions, and more with Serene Premium."
              }
            </Text>
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
                {isPremium && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success || '#4CAF50'} />
                )}
              </View>
            ))}
          </View>

          {!isPremium && (
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
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.subscribeBtn, isPremium && styles.manageBtn]} 
            onPress={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.subscribeText}>
                {isPremium ? 'Manage Subscription' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            {isPremium 
              ? "Your subscription is managed through your app store account."
              : "By continuing, you agree to our Terms of Use and Privacy Policy. Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period."
            }
          </Text>
        </View>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
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
  activeBadge: { backgroundColor: Colors.success || '#4CAF50' },
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
  manageBtn: { backgroundColor: Colors.textSecondary },
  subscribeText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  termsText: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', lineHeight: 14 },
});


