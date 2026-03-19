import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="explore" />
      <Stack.Screen name="product-detail" />
      <Stack.Screen name="customer-profile" />
    </Stack>
  );
}
