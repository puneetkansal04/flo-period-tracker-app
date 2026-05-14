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
  try {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    token = "fake-token-for-dev";
    return token;
  } catch (e) {
    console.warn("Failed to register notifications", e);
    return null;
  }
}

export async function scheduleCycleNotifications(daysUntilPeriod: number) {
  try {
    // Cancel previous
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Daily reminder at 8 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "How are you feeling today? 🌸",
        body: "Log your symptoms and mood to get better cycle insights.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    // Upcoming period notification
    if (daysUntilPeriod > 0 && daysUntilPeriod <= 3) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Your period is coming soon",
          body: `Your period is predicted to start in ${daysUntilPeriod} days.`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5, // Just for testing, normally this would be scheduled at a specific date
        },
      });
    }
  } catch (e) {
    console.warn("Failed to schedule notifications", e);
  }
}
