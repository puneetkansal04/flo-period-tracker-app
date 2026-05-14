import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.warn("Notifications not supported in this environment");
}

export async function registerForPushNotificationsAsync() {
  return null;
}

export async function scheduleCycleNotifications(daysUntilPeriod: number) {
  return;
}
