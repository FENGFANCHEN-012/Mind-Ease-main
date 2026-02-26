import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Signup() {
  const [email,setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const BaseUrl = "https://mindeasebackend-production.up.railway.app/api"
  
const submitData = async (
  username: string,
  password: string,
  email: string
): Promise<boolean> => {
  try {
    const res = await fetch(`${BaseUrl}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
     
      body: JSON.stringify({
        name: username,
        password,
        email,
      }),
    });

    const raw = await res.text(); 
    console.log("SIGNUP status:", res.status);
    console.log("SIGNUP raw:", raw);

    let data: any = {};
    try {
      data = JSON.parse(raw);
    } catch {}

    if (!res.ok) {
      
      const msg =
        data?.message ||
        data?.error ||
        (data?.errors ? JSON.stringify(data.errors) : "Signup failed");
      setError(msg);
      return false;
    }

    return true;
  } catch (e: any) {
    
       console.log("SIGNUP fetch error:", e); 
    setError(e?.message || "Network error");
    return false;
  }
};

   const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};



   const handleSignup = async () => {
    setError("");

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please ensure all fields are filled.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!validateEmail(email)) {
  setError("Please enter a valid email address.");
  return;
}
if (password.length < 6) {
  setError("Password must be at least 6 characters long.");
  return;
}
    
    const success = await submitData(username,password,email);
   
    // After successful signup, redirect to login
    if(!success) return;
    setIsSuccess(true);
  };



  return (
    isSuccess ? (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff", justifyContent: "center" }}>
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
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>Account created</Text>
        <Text style={{ color: "#666", textAlign: "center", marginBottom: 24 }}>
          Your signup was successful. You can log in now.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/login")}
          style={{
            backgroundColor: "#2DBE60",
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Go to Login</Text>
        </Pressable>
      </View>
    </View>
  ) : (
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
    )
  );
}
