import { Tabs } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { Theme } from "tamagui";
import { tamaguiConfig } from "../../tamagui.config";

export default function TabsLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Theme name="light">
        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="stress" options={{ title: "Stress" }} />
          <Tabs.Screen name="sleep" options={{ title: "Sleep" }} />
          <Tabs.Screen name="plan" options={{ title: "Plan" }} />
        </Tabs>
      </Theme>
    </TamaguiProvider>
  );
}