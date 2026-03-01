import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Modal } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
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

    if (isSubmitting) return;

    if (!email.trim() || !password.trim()) {
      setError("Please ensure all fields are filled.");
      return;
    }

    setIsSubmitting(true);
    try {
      const isLoginSuccessful = await checkLogin(email, password);
      if (isLoginSuccessful) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.replace("/homepage");
        }, 2000);
      
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* Logo + Welcome */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>M</Text>
        </View>

        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Sign In Button */}
        <Pressable
          onPress={handleLogin}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.primaryButton,
            (pressed || isSubmitting) && styles.primaryButtonPressed,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
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
            Don’t have an account? Sign up
          </Text>
        </Pressable>
      </View>



      {/* Success Modal */}
      
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Login Successful 🎉</Text>
              <Text style={styles.modalSubtitle}>Welcome back! Redirecting to homepage...</Text>
      
            <Pressable
              onPress={() => setShowPopup(false)}
              style={styles.modalButton}
            >
              <Text style={{ color: "#fff" }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginTop: 44,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#2DBE60",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  form: {
    marginTop: 28,
  },
  label: {
    marginBottom: 6,
    color: "#374151",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  errorText: {
    color: "#B91C1C",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#2DBE60",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },


  // Model Overlay CSS
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  width: "80%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 24,
  alignItems: "center",
},

modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 16,
},

modalButton: {
  backgroundColor: "#2DBE60",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},

modalSubtitle: {
  fontSize: 14,
  color: "#6B7280",
  marginBottom: 16,
},


});
