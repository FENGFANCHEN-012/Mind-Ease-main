import { View, Text, TextInput, Pressable, Image } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const BaseUrl = "https://mindeasebackend-production.up.railway.app/api"

  const checkLogin = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const res = await fetch(`${BaseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });


    if (res.ok) {
      const data = await res.json();
      console.log("Login successful:", data);
      const {token} = data;
      if (token) {
        await SecureStore.setItemAsync("authToken", token);
        return true;
      }

      console.error("No token returned");
      return false;

      return true;
    } else {
      const errorData = await res.json();
      console.error("Login failed:", errorData);
      return false;
    }
  } catch (err) {
    console.error("Error during login:", err);
    return false;
  }
};

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please ensure all fields are filled.");
      return;
    }

    const isLoginSuccessful = await checkLogin(email, password);
    if (isLoginSuccessful) {
      router.replace("/(tabs)/homepage");
    } else {
      setError("Invalid email or password.");
    }
  };


  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      {/* Logo + Welcome */}
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            backgroundColor: "#2DBE60",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>
            M
          </Text>
        </View>

        <Text style={{ fontSize: 22, fontWeight: "600" }}>Welcome!</Text>
        <Text style={{ color: "#777", marginTop: 4 }}>
          Sign in to continue your wellness journey
        </Text>
      </View>

      {/* Form */}
      <View style={{ marginTop: 32 }}>
        <Text style={{ marginBottom: 6, color: "#555" }}>Email Address</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        />

        <Text style={{ marginBottom: 6, color: "#555" }}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        />

        {/* Error */}
        {error ? (
          <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
        ) : null}

        {/* Sign In Button */}
        <Pressable
          onPress={handleLogin}
          style={{
            backgroundColor: "#2DBE60",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Sign In
          </Text>
        </Pressable>
      </View>

      {/* Divider */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 28,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#eee" }} />
        <Text style={{ marginHorizontal: 12, color: "#888" }}>
          Or continue with
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#eee" }} />
      </View>

      {/* Social Login */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {["G", "f", "♪"].map((icon, index) => (
          <View
            key={index}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#ddd",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>
        ))}
      </View>

      {/* Sign Up */}
      <View style={{ marginTop: 32, alignItems: "center" }}>
        <Pressable onPress={() => router.push("/signup")}>
          <Text style={{ color: "#2DBE60" }}>
            Don’t have an account? Sign up yeah
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
