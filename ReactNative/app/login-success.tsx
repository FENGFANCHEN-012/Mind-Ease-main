import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function LoginSuccess() {
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            backgroundColor: "#2DBE60",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>✓</Text>
        </View>

        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
          Login successful
        </Text>
        <Text style={{ color: "#666", textAlign: "center", marginBottom: 24 }}>
          Welcome back. Continue to your home page.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/homepage")}
          style={{
            backgroundColor: "#2DBE60",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
