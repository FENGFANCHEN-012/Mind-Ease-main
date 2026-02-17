import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Chatbot() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>MindEase Chatbot</Text>
      <Text>This is a stack page</Text>

      <Pressable onPress={() => router.back()}>
        <Text style={{ marginTop: 20 }}>Go Back</Text>
      </Pressable>
    </View>
  );
}
