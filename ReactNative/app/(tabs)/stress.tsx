import { View, Text } from "react-native";
import { useAppSelector } from "../../src/store/hooks";

export default function Stress() {
  const mood = useAppSelector(state => state.mind.mood);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Stress</Text>
      <Text>Your mood: {mood ?? "unknown"}</Text>
    </View>
  );
}
