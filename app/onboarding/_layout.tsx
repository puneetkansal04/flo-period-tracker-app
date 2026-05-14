import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="birth-year" />
      <Stack.Screen name="last-period" />
      <Stack.Screen name="cycle-length" />
      <Stack.Screen name="period-length" />
    </Stack>
  );
}
