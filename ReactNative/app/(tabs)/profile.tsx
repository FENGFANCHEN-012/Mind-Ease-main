import { clearAuth } from "@/src/store/authslice";
import { clearUserInfo, setUserInfo } from "@/src/store/userslice";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
 
const COLORS = {
  primary: "#2DBE60",
  primarySoft: "#E9F8EF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  bg: "#F5F7F6",
  card: "#FFFFFF",
  danger: "#EF4444",
  shadow: "rgba(17, 24, 39, 0.08)",
};
 
function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  const first = parts[0]?.[0] ?? "U";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}
 
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
 
export default function Profile() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((s) => s.userInfo);
  const [isRefreshing, setIsRefreshing] = useState(false);
 
  const displayName = useMemo(() => userInfo.name ?? "User", [userInfo.name]);
  const displayEmail = useMemo(() => userInfo.email ?? "—", [userInfo.email]);
 
  useEffect(() => {
    refreshUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const refreshUserInfo = async () => {
    if (isRefreshing) return;
 
    setIsRefreshing(true);
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("authToken");
      if (!userId || !token) return;
 
      const BaseUrl = "https://mindeasebackend-production.up.railway.app/api";
      const res = await fetch(`${BaseUrl}/users/info/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
 
      if (!res.ok) return;
 
      const data = await res.json();
      const user = data?.user ?? data;
 
      dispatch(
        setUserInfo({
          id: String(user?.id ?? userId ?? ""),
          name: user?.name ?? displayName,
          age: user?.age ?? null,
          sex: user?.sex ?? user?.gender ?? "Not specified",
          slogan: user?.slogan ?? null,
          profilePicture: user?.profilePicture ?? user?.ProfilePicture ?? null,
          email: user?.email ?? userInfo.email ?? null,
          phone_number: user?.phone_number ?? null,
          role: user?.role ?? null,
        })
      );
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };
 
  const onEditProfile = () => {
    router.push("/input_user_detail");
  };
 
  const onLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          dispatch(clearAuth());
          dispatch(clearUserInfo());
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("userId");
          await SecureStore.deleteItemAsync("first_log_in");
          router.replace("/login");
        },
      },
    ]);
  };
 
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(displayName)}</Text>
          </View>
 
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {displayEmail}
            </Text>
          </View>
 
          <Pressable onPress={refreshUserInfo} style={styles.refreshBtn}>
            {isRefreshing ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text style={styles.refreshText}>Refresh</Text>
            )}
          </Pressable>
        </View>
 
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Pressable onPress={onEditProfile} hitSlop={10}>
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>
 
        <View style={styles.card}>
          <InfoRow label="User ID" value={userInfo.id ? String(userInfo.id) : "—"} />
          <View style={styles.divider} />
          <InfoRow label="Age" value={userInfo.age !== null ? String(userInfo.age) : "—"} />
          <View style={styles.divider} />
          <InfoRow label="Gender" value={userInfo.sex || "—"} />
          <View style={styles.divider} />
          <InfoRow label="Phone" value={userInfo.phone_number || "—"} />
          <View style={styles.divider} />
          <InfoRow label="Role" value={userInfo.role || "—"} />
        </View>
 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Slogan</Text>
          <Text style={styles.sloganText}>{userInfo.slogan || "—"}</Text>
        </View>
 
        <Pressable onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    padding: 16,
    paddingBottom: 28,
  },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(45, 190, 96, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.4,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  email: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.subtext,
  },
  refreshBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(45, 190, 96, 0.25)",
  },
  refreshText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  sectionTitleRow: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  editText: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.subtext,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
  },
  infoLabel: {
    color: COLORS.subtext,
    fontWeight: "700",
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 13,
    maxWidth: "62%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  sloganText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  logoutBtn: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.35)",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: "900",
    fontSize: 14,
  },
});