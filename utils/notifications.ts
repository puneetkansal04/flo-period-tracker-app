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

export async function scheduleDailyReminder() {
  if (Platform.OS === 'web') return;
  
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "How's your day going? 🌸",
      body: "Take a moment to log your symptoms and moods.",
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

export async function registerForPushNotificationsAsync() {
  return null;
}

export async function scheduleCycleNotifications(daysUntilPeriod: number) {
  if (Platform.OS === 'web') return;
  if (daysUntilPeriod <= 1) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Period starting soon 🌸",
        body: "Your period is predicted to start tomorrow. Get ready!",
      },
      trigger: { seconds: 5 }, // Immediate for testing, or set a specific time
    });
  }
}
