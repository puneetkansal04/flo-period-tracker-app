import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';


export const SKU = {
  PREMIUM: 'premium_subscription',
};

export const BASE_PLANS = {
  MONTHLY: 'premium-monthly-plan',
  ANNUAL: 'premium-annual-plan',
};

const subscriptionSkus = [SKU.PREMIUM];

let purchaseUpdateSubscription: any;
let purchaseErrorSubscription: any;

export const IAPService = {
  init: async (onSuccess?: (purchase: any) => void, onError?: (error: any) => void) => {
    try {
      await RNIap.initConnection();
      if (Platform.OS === 'android') {
        if (typeof (RNIap as any).flushFailedPurchasesCachedAsPendingAndroid === 'function') {
          await (RNIap as any).flushFailedPurchasesCachedAsPendingAndroid();
        }
      }

      // Setup listeners
      purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
        console.log('[IAP] Purchase Updated:', purchase);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
            if (onSuccess) onSuccess(purchase);
          } catch (err: any) {
            console.warn('[IAP] finishTransaction error:', err.message);
          }
        }
      });

      purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
        console.warn('[IAP] Purchase Error Listener:', error);
        if (onError) onError(error);
      });

      console.log('[IAP] Connection initialized and listeners attached');
    } catch (err: any) {
      console.warn('[IAP] Init error:', err.message);
    }
  },

  end: async () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    await RNIap.endConnection();
  },

  getSubscriptions: async () => {
    try {
      if (typeof RNIap.getSubscriptions !== 'function') {
        console.warn('[IAP] getSubscriptions is not a function on RNIap');
        return [];
      }
      return await RNIap.getSubscriptions({ skus: subscriptionSkus });
    } catch (err: any) {
      console.warn('[IAP] getSubscriptions error:', err.message);
      return [];
    }
  },

  requestSubscription: async (sku: string, basePlanId: string) => {
    try {
      return await RNIap.requestSubscription({
        sku,
        subscriptionOffers: [{
          productId: sku,
          basePlanId: basePlanId,
        }]
      });
    } catch (err: any) {
      console.warn('[IAP] requestSubscription error:', err.message);
      throw err;
    }
  },

  restorePurchases: async () => {
    try {
      console.log('[IAP] Restoring purchases...');
      const purchases = await RNIap.getAvailablePurchases();
      console.log('[IAP] Available purchases:', purchases);
      
      if (purchases && purchases.length > 0) {
        for (const purchase of purchases) {
          // If a purchase exists but isn't acknowledged/finished, finish it now
          if (!purchase.transactionReceipt) continue;
          try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
          } catch (e) {
            console.warn('[IAP] Error finishing restored transaction:', e);
          }
        }
      }
      return purchases;
    } catch (err: any) {
      console.warn('[IAP] restorePurchases error:', err.message);
      return [];
    }
  },
};
