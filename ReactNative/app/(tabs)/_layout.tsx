import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="stress" options={{ title: "Stress" }} />
      <Tabs.Screen name="sleep" options={{ title: "Sleep" }} />
      <Tabs.Screen name="plan" options={{ title: "Plan" }} />
    </Tabs>
  );
}
