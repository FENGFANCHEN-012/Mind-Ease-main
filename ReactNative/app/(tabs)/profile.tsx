import { clearAuth } from "@/src/store/authslice";
import { clearUserInfo, setUserInfo } from "@/src/store/userslice";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
} from "react-native";
import {
    Button,
    Input,
    Paragraph,
    Separator,
    Text,
    XStack,
    YStack,
} from "tamagui";
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
    <XStack ai="center" jc="space-between" gap="$3" py="$3">
      <Text color={COLORS.subtext} fontWeight="700" fontSize="$3">
        {label}
      </Text>
      <Text color={COLORS.text} fontWeight="800" fontSize="$3" maxWidth="60%" textAlign="right">
        {value}
      </Text>
    </XStack>
  );
}
 
export default function Profile() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((s) => s.userInfo);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [draftName, setDraftName] = useState("");
  const [draftSex, setDraftSex] = useState("");
  const [draftAge, setDraftAge] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [draftSlogan, setDraftSlogan] = useState("");
 
  const displayName = useMemo(() => userInfo.name ?? "User", [userInfo.name]);
  const displayEmail = useMemo(() => userInfo.email ?? "—", [userInfo.email]);

  const resetDraft = () => {
    setDraftName(userInfo.name ?? "");
    setDraftSex(userInfo.sex ?? "");
    setDraftAge(userInfo.age === null || userInfo.age === undefined ? "" : String(userInfo.age));
    setDraftPhone(userInfo.phone_number ?? "");
    setDraftSlogan(userInfo.slogan ?? "");
  };
 
  useEffect(() => {
    refreshUserInfo();
    resetDraft();
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
        method: "GET",
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

      // keep draft in sync if user isn't editing
      if (!isEditing) {
        resetDraft();
      }
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  const onToggleEdit = () => {
    if (!isEditing) {
      resetDraft();
      setIsEditing(true);
      return;
    }
    setIsEditing(false);
    resetDraft();
  };

  const onSave = async () => {
    if (isSaving) return;

    const userId = await SecureStore.getItemAsync("userId");
    const token = await SecureStore.getItemAsync("authToken");
    if (!userId || !token) {
      Alert.alert("Not logged in", "Missing login session. Please log in again.");
      return;
    }

    const ageNum = draftAge.trim() === "" ? null : Number(draftAge);
    if (draftAge.trim() !== "" && (!Number.isFinite(ageNum) || !Number.isInteger(ageNum))) {
      Alert.alert("Invalid age", "Please enter a valid integer age.");
      return;
    }

    setIsSaving(true);
    try {
      const BaseUrl = "https://mindeasebackend-production.up.railway.app/api";
      const res = await fetch(`${BaseUrl}/user/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: draftName,
          sex: draftSex,
          age: ageNum,
          phone_number: draftPhone,
          slogan: draftSlogan,
        }),
      });

      const raw = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(raw);
      } catch {
        // ignore
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          (data?.errors ? JSON.stringify(data.errors) : raw || "Failed to update user info");
        Alert.alert("Update failed", msg);
        return;
      }

      const user = data?.user ?? data;
      if (user) {
        dispatch(
          setUserInfo({
            id: String(user?.id ?? userId ?? ""),
            name: user?.name ?? draftName,
            age: user?.age ?? ageNum,
            sex: user?.sex ?? draftSex,
            slogan: user?.slogan ?? draftSlogan,
            profilePicture: user?.profilePicture ?? userInfo.profilePicture ?? null,
            email: user?.email ?? userInfo.email ?? null,
            phone_number: user?.phone_number ?? draftPhone,
            role: user?.role ?? userInfo.role ?? null,
          })
        );
      }

      setIsEditing(false);
      Alert.alert("Saved", "Your profile has been updated.");
    } catch (e: any) {
      Alert.alert("Network error", e?.message || "Failed to update user info");
    } finally {
      setIsSaving(false);
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
        }}
      >
        <YStack flex={1} jc="center" ai="center">
          <YStack width="100%" maxWidth={460} gap="$4" mt="$8">
            <YStack gap="$1" px="$1">
              <Text color={COLORS.subtext} fontWeight="800" fontSize="$3">
                Your space
              </Text>
              <Text color={COLORS.text} fontWeight="900" fontSize="$8" lineHeight="$8">
                Profile
              </Text>
            </YStack>

            <YStack
              backgroundColor={COLORS.card}
              borderColor={COLORS.border}
              borderWidth={1}
              borderRadius="$8"
              padding="$4"
            >
              <XStack ai="center" jc="space-between" gap="$3">
                <XStack ai="center" gap="$3" flex={1}>
                  <YStack
                    width={56}
                    height={56}
                    borderRadius={18}
                    backgroundColor={COLORS.primarySoft}
                    borderWidth={1}
                    borderColor="rgba(45, 190, 96, 0.25)"
                    ai="center"
                    jc="center"
                  >
                    <Text color={COLORS.primary} fontWeight="800" fontSize="$6">
                      {initials(displayName)}
                    </Text>
                  </YStack>

                  <YStack flex={1} gap="$1">
                    <Text color={COLORS.text} fontSize="$6" fontWeight="800" numberOfLines={1}>
                      {displayName}
                    </Text>
                    <Paragraph color={COLORS.subtext} numberOfLines={1}>
                      {displayEmail}
                    </Paragraph>
                  </YStack>
                </XStack>

                <Button
                  size="$3"
                  backgroundColor={COLORS.primarySoft}
                  borderColor="rgba(45, 190, 96, 0.25)"
                  borderWidth={1}
                  onPress={refreshUserInfo}
                  disabled={isRefreshing}
                  borderRadius="$6"
                >
                  <Text color={COLORS.primary} fontWeight="900">
                    {isRefreshing ? "Refreshing" : "Refresh"}
                  </Text>
                </Button>
              </XStack>
            </YStack>

            <XStack ai="center" jc="space-between">
              <Paragraph color={COLORS.subtext} fontWeight="700">
                Keep it simple. Update only what you want.
              </Paragraph>
              <XStack gap="$2">
                <Button
                  size="$3"
                  backgroundColor={isEditing ? "#FFFFFF" : COLORS.primarySoft}
                  borderColor={isEditing ? COLORS.border : "rgba(45, 190, 96, 0.25)"}
                  borderWidth={1}
                  onPress={onToggleEdit}
                  borderRadius="$6"
                >
                  <Text color={isEditing ? COLORS.subtext : COLORS.primary} fontWeight="900">
                    {isEditing ? "Cancel" : "Edit"}
                  </Text>
                </Button>

                {isEditing ? (
                  <Button
                    size="$3"
                    backgroundColor={COLORS.primary}
                    borderColor={COLORS.primary}
                    borderWidth={1}
                    onPress={onSave}
                    disabled={isSaving}
                    borderRadius="$6"
                  >
                    <Text color="#fff" fontWeight="900">
                      {isSaving ? "Saving" : "Save"}
                    </Text>
                  </Button>
                ) : null}
              </XStack>
            </XStack>

            <YStack
              backgroundColor={COLORS.card}
              borderColor={COLORS.border}
              borderWidth={1}
              borderRadius="$8"
              padding="$4"
            >
              <InfoRow label="User ID" value={userInfo.id ? String(userInfo.id) : "—"} />
              <Separator backgroundColor={COLORS.border} />

              {isEditing ? (
                <YStack gap="$3" py="$3">
                  <YStack gap="$2">
                    <Text color={COLORS.subtext} fontWeight="700" fontSize="$3">
                      Name
                    </Text>
                    <Input
                      value={draftName}
                      onChangeText={setDraftName}
                      backgroundColor="#fff"
                      borderRadius="$6"
                      placeholder="Your name"
                    />
                  </YStack>

                  <YStack gap="$2">
                    <Text color={COLORS.subtext} fontWeight="700" fontSize="$3">
                      Gender
                    </Text>
                    <Input
                      value={draftSex}
                      onChangeText={setDraftSex}
                      backgroundColor="#fff"
                      borderRadius="$6"
                      placeholder="e.g. female / male"
                    />
                  </YStack>

                  <YStack gap="$2">
                    <Text color={COLORS.subtext} fontWeight="700" fontSize="$3">
                      Age
                    </Text>
                    <Input
                      value={draftAge}
                      onChangeText={setDraftAge}
                      keyboardType="number-pad"
                      backgroundColor="#fff"
                      borderRadius="$6"
                      placeholder="e.g. 21"
                    />
                  </YStack>

                  <YStack gap="$2">
                    <Text color={COLORS.subtext} fontWeight="700" fontSize="$3">
                      Phone
                    </Text>
                    <Input
                      value={draftPhone}
                      onChangeText={setDraftPhone}
                      keyboardType="phone-pad"
                      backgroundColor="#fff"
                      borderRadius="$6"
                      placeholder="Optional"
                    />
                  </YStack>
                </YStack>
              ) : (
                <YStack>
                  <InfoRow label="Age" value={userInfo.age !== null ? String(userInfo.age) : "—"} />
                  <Separator backgroundColor={COLORS.border} />
                  <InfoRow label="Gender" value={userInfo.sex || "—"} />
                  <Separator backgroundColor={COLORS.border} />
                  <InfoRow label="Phone" value={userInfo.phone_number || "—"} />
                  <Separator backgroundColor={COLORS.border} />
                  <InfoRow label="Role" value={userInfo.role || "—"} />
                </YStack>
              )}
            </YStack>

            <YStack
              backgroundColor={COLORS.card}
              borderColor={COLORS.border}
              borderWidth={1}
              borderRadius="$8"
              padding="$4"
            >
              <Text color={COLORS.subtext} fontWeight="800" fontSize="$3" mb="$2">
                Slogan
              </Text>
              {isEditing ? (
                <Input
                  value={draftSlogan}
                  onChangeText={setDraftSlogan}
                  backgroundColor="#fff"
                  borderRadius="$6"
                  placeholder="A short line that motivates you"
                />
              ) : (
                <Paragraph color={COLORS.text} fontWeight="600">
                  {userInfo.slogan || "—"}
                </Paragraph>
              )}
            </YStack>

            <Button
              backgroundColor="#fff"
              borderColor="rgba(239, 68, 68, 0.35)"
              borderWidth={1}
              onPress={onLogout}
              borderRadius="$6"
            >
              <Text color={COLORS.danger} fontWeight="900">
                Log out
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}