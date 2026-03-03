// -----------------------------------

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { setUserName, setGender, setAge } from "../src/store/userslice";
import * as SecureStore from "expo-secure-store";
import { Dispatch } from "@reduxjs/toolkit";
import {useEffect} from "react";
// ------------------------------


// --------------------------------
const COLORS = {
  primary: "#2DBE60",
  primarySoft: "#E9F8EF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  bg: "#F5F7F6",
  card: "#FFFFFF",
  shadow: "rgba(17, 24, 39, 0.08)",
};
// --------------------------------


type Gender = "male" | "female" | "other" | "prefer_not";
export default function OnboardingProfile() {
  const BaseUrl = "https://mindeasebackend-production.up.railway.app/api"
  const dispatch = useAppDispatch();
  const existingName = useAppSelector((s) => s.mind.userName);

  const [username, setUsernameLocal] = useState(existingName ?? "");
  const [gender, setGenderLocal] = useState<Gender>("prefer_not");
  const [ageText, setAgeText] = useState("");




  const  updateUserInfo = async (sex:string,
    age:number | null,
    userName:string) => {
    try {      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("authToken");
      const res = await fetch(`${BaseUrl}/user/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          age: age,
          sex: sex,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to update user info");
      }
    } catch (err) {
      console.error("Error updating user info:", err);
    }
  }

  const ageNum = useMemo(() => {
    const n = Number(ageText);
    if (!Number.isFinite(n)) return null;
    if (!Number.isInteger(n)) return null;
    return n;
  }, [ageText]);

  const ageValid = useMemo(() => {
    if (ageText.trim() === "") return true; 
    if (ageNum === null) return false;
    return ageNum >= 6 && ageNum <= 120; 
  }, [ageText, ageNum]);

  const canContinue = useMemo(() => {

    return ageValid;
  }, [ageValid]);

  const goNext = () => {
     updateUserInfo(gender, ageNum, username);
    router.replace("/homepage"); 
  };

  const onSkip = () => {
   
    goNext();
  };

  const onContinue = () => {
    if (!canContinue) return;

 
    goNext();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Top */}
          <View style={styles.topRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>One-time setup</Text>
            </View>

            <Pressable onPress={onSkip} hitSlop={10}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>
            This helps personalize your experience. You can change it anytime.
          </Text>

          {/* Card */}
          <View style={styles.card}>
            {/* Username */}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.at}>@</Text>
              <TextInput
                value={username}
                onChangeText={setUsernameLocal}
                placeholder="e.g. alex_chen"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                style={styles.input}
                returnKeyType="next"
              />
            </View>

            {/* Gender segmented */}
            <Text style={[styles.label, { marginTop: 16 }]}>Gender</Text>
            <View style={styles.segment}>
              <GenderPill label="Male" active={gender === "male"} onPress={() => setGenderLocal("male")} />
              <GenderPill label="Female" active={gender === "female"} onPress={() => setGenderLocal("female")} />
              <GenderPill label="Other" active={gender === "other"} onPress={() => setGenderLocal("other")} />
            </View>

            <Pressable
              onPress={() => setGenderLocal("prefer_not")}
              style={[styles.smallRow, gender === "prefer_not" && styles.smallRowOn]}
            >
              <View style={[styles.radio, gender === "prefer_not" && styles.radioOn]} />
              <Text style={styles.smallRowText}>Prefer not to say</Text>
            </Pressable>

            {/* Age */}
            <Text style={[styles.label, { marginTop: 16 }]}>Age</Text>
            <TextInput
              value={ageText}
              onChangeText={(t) => setAgeText(t.replace(/[^\d]/g, ""))}
              placeholder="e.g. 20"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              style={[styles.input2, !ageValid && styles.inputError]}
              returnKeyType="done"
            />
            {!ageValid ? (
              <Text style={styles.errorText}>Please enter a valid age (6–120).</Text>
            ) : (
              <Text style={styles.hintText}>Optional. Used for better recommendations.</Text>
            )}
          </View>

          {/* Bottom buttons */}
          <View style={styles.bottom}>
            <Pressable
              style={[styles.primaryBtn, !canContinue && { opacity: 0.6 }]}
              onPress={onContinue}
              disabled={!canContinue}
            >
              <Text style={styles.primaryBtnText}>Continue</Text>
            </Pressable>

            <Pressable style={styles.ghostBtn} onPress={onSkip}>
              <Text style={styles.ghostBtnText}>Skip for now</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function GenderPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillOn]}>
      <Text style={[styles.pillText, active && styles.pillTextOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, padding: 18, paddingTop: 12 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: "#CFF3DC",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: { color: COLORS.primary, fontWeight: "900", fontSize: 12 },
  skipText: { color: COLORS.subtext, fontWeight: "900" },

  title: { marginTop: 14, fontSize: 26, fontWeight: "900", color: COLORS.text },
  subtitle: { marginTop: 8, color: COLORS.subtext, fontWeight: "600", lineHeight: 18 },

  card: {
    marginTop: 18,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: COLORS.shadow as any,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  label: { color: COLORS.text, fontWeight: "900", marginBottom: 8 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7F6EC",
    backgroundColor: "#F7FFFA",
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  at: { color: COLORS.subtext, fontWeight: "900", marginRight: 6 },
  input: { flex: 1, paddingVertical: 12, color: COLORS.text, fontWeight: "700" },

  segment: {
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  pillOn: {
    backgroundColor: COLORS.primarySoft,
    borderColor: "#CFF3DC",
  },
  pillText: { color: COLORS.subtext, fontWeight: "900" },
  pillTextOn: { color: COLORS.primary },

  smallRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  smallRowOn: {
    borderColor: "#CFF3DC",
    backgroundColor: "#F3FFF7",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  radioOn: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  smallRowText: { color: COLORS.text, fontWeight: "800" },

  input2: {
    borderWidth: 1,
    borderColor: "#E7F6EC",
    backgroundColor: "#F7FFFA",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: COLORS.text,
    fontWeight: "800",
  },
  inputError: { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
  errorText: { marginTop: 8, color: "#EF4444", fontWeight: "800", fontSize: 12 },
  hintText: { marginTop: 8, color: COLORS.subtext, fontWeight: "700", fontSize: 12 },

  bottom: { marginTop: 16, gap: 10 },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  ghostBtn: {
    borderWidth: 1,
    borderColor: "#DFF3E6",
    backgroundColor: "#F3FFF7",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  ghostBtnText: { color: COLORS.primary, fontWeight: "900", fontSize: 15 },
});