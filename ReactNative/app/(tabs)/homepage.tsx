import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { setMood } from "../../src/store/mindslice";

export default function Home() {
  const dispatch = useAppDispatch();
  const mood = useAppSelector(state => state.mind.mood);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>MindEase</Text>
      <Text>Current mood: {mood ?? "none"}</Text>

      <Pressable onPress={() => dispatch(setMood(5))}>
        <Text>Set Mood 😊</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/chatbot")}>
        <Text style={{ marginTop: 20 }}>Go to Chatbot</Text>
      </Pressable>
    </View>
  );
}