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
  try {
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
  } catch (e) {
    console.warn("Failed to schedule daily reminder:", e);
  }
}

export async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === 'web') return null;
    return null;
  } catch (e) {
    return null;
  }
}

export async function scheduleCycleNotifications(daysUntilPeriod: number) {
  if (Platform.OS === 'web') return;
  try {
    if (daysUntilPeriod <= 1) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Period starting soon 🌸",
          body: "Your period is predicted to start tomorrow. Get ready!",
        },
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5 
        },
      });
    }
  } catch (e) {
    console.warn("Failed to schedule cycle notifications:", e);
  }
}
