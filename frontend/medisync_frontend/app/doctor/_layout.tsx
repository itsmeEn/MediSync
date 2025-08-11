import { Stack } from "expo-router";

export default function DoctorLayout() {
  return (
    <Stack>
      <Stack.Screen name="sidenav" options={{ headerShown: false }} />
      <Stack.Screen name="doctor-signup" options={{ headerShown: false }} />
    </Stack>
  );
}
