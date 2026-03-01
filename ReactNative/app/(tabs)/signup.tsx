import { router } from "expo-router";
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


export default function Signup() {
  const [email,setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
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

    if (isSubmitting) return;

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
    
    setIsSubmitting(true);
    try {
      const success = await submitData(username,password,email);
   
    // After successful signup, redirect to login
      if(!success) return;
      setShowPopup(true);
       setTimeout(() => {
        setShowPopup(false);
        router.replace("/login");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <View style={styles.container}>
      {/* Logo + Title */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>M</Text>
        </View>

        <Text style={styles.title}>Join MindEase</Text>
        <Text style={styles.subtitle}>
          Create your account to start your wellness journey
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
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


        
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        {/* Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Sign Up Button */}
        <Pressable
          onPress={handleSignup}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.primaryButton,
            (pressed || isSubmitting) && styles.primaryButtonPressed,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Create Account</Text>
          )}
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
   
   

{/* Success Modal */}

<Modal
  visible={showPopup}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Signup Successful 🎉</Text>

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




//  Stylesheet

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

});
