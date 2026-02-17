import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Signup() {
  const [email,setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


   const submitData = async (
  username: string,
  password: string,
  email: string
): Promise<boolean> => {
  try {
    const res = await fetch(
      "https://mind-ease-6auw.onrender.com/user/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Signup failed");
      return false;
    }

    return true;
  } catch (err) {
    setError("Network error");
    return false;
  }
};


   const handleSignup = () => {
    setError("");

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please ensure all fields are filled.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    submitData(username,password,email);
    // After successful signup, redirect to login
    router.replace("/(tabs)/login");
  };



  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      {/* Logo + Title */}
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

        <Text style={{ fontSize: 22, fontWeight: "600" }}>
          Join MindEase
        </Text>
        <Text style={{ color: "#777", marginTop: 4, textAlign: "center" }}>
          Create your account to start your wellness journey
        </Text>
      </View>

      <View style={{ marginTop: 32 }}>
        <Text style={{ marginBottom: 6, color: "#555" }}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        />  </View>



      {/* Form */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ marginBottom: 6, color: "#555" }}>Username</Text>
        <TextInput
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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
            marginBottom: 16,
          }}
        />

        <Text style={{ marginBottom: 6, color: "#555" }}>
          Confirm Password
        </Text>
        <TextInput
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        />

        {/* Error Message */}
        {error ? (
          <Text style={{ color: "red", marginBottom: 12 }}>
            {error}
          </Text>
        ) : null}

        {/* Sign Up Button */}
        <Pressable
          onPress={handleSignup}
          style={{
            backgroundColor: "#2DBE60",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Create Account
          </Text>
        </Pressable>
      </View>

      {/* Login Link */}
      <View style={{ marginTop: 32, alignItems: "center" }}>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={{ color: "#2DBE60" }}>
            Already have an account? Log in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
