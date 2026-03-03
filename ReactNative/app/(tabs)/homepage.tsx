import { clearAuth } from "@/src/store/authslice";
import { setUserName } from "@/src/store/userslice";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { setMood } from "../../src/store/mindslice";

const COLORS = {
  primary: "#2DBE60",
  primarySoft: "#E9F8EF",
  text: "#111827",
  subtext: "#6B7280",
  border: "#E5E7EB",
  bg: "#F5F7F6", // main background
  card: "#FFFFFF",
  danger: "#EF4444",
  warn: "#F59E0B",
  shadow: "rgba(17, 24, 39, 0.08)",
};

type Practice = "yoga" | "breathing" | "meditation";
const PRACTICE_ORDER: Practice[] = ["yoga", "breathing", "meditation"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function practiceLabel(p: Practice) {
  if (p === "yoga") return "Yoga";
  if (p === "breathing") return "Breathing";
  return "Meditation";
}
function practiceTitle(p: Practice) {
  if (p === "yoga") return "Yoga Flow";
  if (p === "breathing") return "Deep Breathing";
  return "Meditation";
}
function practiceDesc(p: Practice) {
  if (p === "yoga") return "Gentle stretch to reset your body.";
  if (p === "breathing") return "2–5 minutes to calm your nervous system.";
  return "10 minutes to clear your mind.";
}
function practiceButton(p: Practice) {
  if (p === "yoga") return "Start Yoga";
  if (p === "breathing") return "Start Breathing";
  return "Start Meditation";
}

export default function Home() {

  const dispatch = useAppDispatch();
  const mood = useAppSelector((state) => state.mind.mood);
  const userName = useAppSelector((state) => state.mind.userName);
  const BaseUrl = "https://mindeasebackend-production.up.railway.app/api"

  useEffect(() => {
    
    console.log("Getting user info");
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("authToken");

      if (!userId) {
        throw new Error("Missing userId in SecureStore");
      }
      if (!token) {
        throw new Error("Missing authToken in SecureStore");
      }

      const res = await fetch(`${BaseUrl}/users/info/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const raw = await res.text();
        throw new Error(`Failed to fetch user info (${res.status}): ${raw}`);
      }
      const data = await res.json();
      const user = data?.user ?? data;
      dispatch(setUserName(user?.name ?? "User"));
      
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  // demo data

  const wellnessScore = 85; // 0-100
  const weekly = [35, 50, 45, 60, 70, 85, 78]; // demo weekly scores for bar chart

  const tasks = [
    { id: "t1", title: "Morning Meditation", time: "8:00 AM", done: false },
    { id: "t2", title: "Work Task Finish", time: "7:00 AM - 5:00 PM", done: true },
  ];
  const sleep = {
    total: "7h 25m",
    deep: "1h 45m",
    quality: "92%",
    breath: "12.5",
    hr: "58 bpm",
    note: "Last Night",
  };

  const [selectedPractice, setSelectedPractice] = useState<Practice>("yoga");

  const progress = clamp(wellnessScore, 0, 100);

  const nextPractice = () => {
    const idx = PRACTICE_ORDER.indexOf(selectedPractice);
    setSelectedPractice(PRACTICE_ORDER[(idx + 1) % PRACTICE_ORDER.length]);
  };

  const maxWeekly = useMemo(() => Math.max(...weekly, 1), [weekly]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>Good Morning,</Text>
            <Text style={styles.name}>{userName ? userName : "Friend"}!</Text>

            <View style={styles.statusPill}>
              <View style={styles.dotOnline} />
              <Text style={styles.statusText}>Watch Connected</Text>
            </View>
          </View>

          <Pressable onPress={() => router.push("/profile")} style={styles.avatarWrap}>
            <Image source={{ uri: "https://i.pravatar.cc/150" }} style={styles.avatar} />
          </Pressable>
        </View>

        {/* Small row: mood + logout */}
        <View style={styles.rowBetween}>
          <Text style={styles.smallHint}>Current mood: {mood ?? "none"}</Text>
          <Pressable
            onPress={() => {
              dispatch(clearAuth());
              router.replace("/login");
            }}
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Wellness Score Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today s Wellness Score</Text>
            <Text style={styles.cardSub}>You are a good today! Keep it up!</Text>
          </View>

          <View style={styles.wellnessRow}>
            {/* Weekly bars */}
            <View style={{ flex: 1, paddingRight: 14 }}>
              <Text style={styles.sectionLabel}>Weekly Wellness Levels</Text>
              <View style={styles.barsRow}>
                {weekly.map((v, i) => {
                  const h = Math.round((v / maxWeekly) * 54);
                  const isToday = i === 5;
                  return (
                    <View key={i} style={styles.barItem}>
                      <View
                        style={[
                          styles.bar,
                          { height: h },
                          isToday && { backgroundColor: COLORS.primary },
                        ]}
                      />
                      <Text style={styles.barLabel}>
                        {["Mon", "Tues", "Thur", "Fri", "Sat", "Sun", ""][i] ?? ""}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Score ring */}
            <View style={styles.scoreWrap}>
              <View style={styles.scoreRingOuter}>
                <View style={styles.scoreRingInner}>
                  <Text style={styles.scoreNum}>{wellnessScore}</Text>
                </View>
              </View>
              <View style={styles.scoreTrack}>
                <View style={[styles.scoreFill, { width: `${progress}%` }]} />
              </View>

              <Pressable
                onPress={() => dispatch(setMood(5))}
                style={styles.ghostBtn}
              >
                <Text style={styles.ghostBtnText}>Quick Mood Boost</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Tasks */}
        <View style={styles.card}>
          <View style={[styles.cardHeaderRow, { marginBottom: 10 }]}>
            <Text style={styles.cardTitle}>Today s Tasks</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                {tasks.filter((t) => t.done).length}/{tasks.length} completed
              </Text>
            </View>
          </View>

          {tasks.map((t) => (
            <View key={t.id} style={styles.taskRow}>
              <View style={[styles.taskIcon, t.done ? styles.taskIconDone : null]}>
                <Text style={styles.taskIconText}>{t.done ? "✓" : "⏰"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{t.title}</Text>
                <Text style={styles.taskTime}>{t.time}</Text>
              </View>
              <View style={[styles.checkBox, t.done && styles.checkBoxOn]}>
                {t.done ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
            </View>
          ))}
        </View>

        {/* Sleep */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Sleep Analysis</Text>
            <Text style={styles.cardLink}>{sleep.note}</Text>
          </View>

          <View style={styles.sleepTop}>
            <Text style={styles.sleepBig}>{sleep.total}</Text>
            <Text style={styles.sleepSub}>Last Night</Text>
          </View>

          <View style={styles.sleepGrid}>
            <View style={styles.sleepMiniCard}>
              <Text style={styles.miniVal}>{sleep.deep}</Text>
              <Text style={styles.miniLabel}>Deep Sleep</Text>
            </View>
            <View style={styles.sleepMiniCard}>
              <Text style={styles.miniVal}>{sleep.quality}</Text>
              <Text style={styles.miniLabel}>Sleep Efficiency</Text>
            </View>
            <View style={styles.sleepMiniCard}>
              <Text style={styles.miniVal}>{sleep.breath}</Text>
              <Text style={styles.miniLabel}>Breath/min</Text>
            </View>
            <View style={styles.sleepMiniCard}>
              <Text style={styles.miniVal}>{sleep.hr}</Text>
              <Text style={styles.miniLabel}>Avg Heart Rate</Text>
            </View>
          </View>

          <Pressable style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>View Detail Analysis</Text>
          </Pressable>
        </View>

        {/* Stress Tools */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stress Out Tools</Text>

          {/* segmented tabs */}
          <View style={styles.segment}>
            {PRACTICE_ORDER.map((p) => {
              const active = selectedPractice === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setSelectedPractice(p)}
                  style={[styles.segmentItem, active && styles.segmentItemOn]}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextOn]}>
                    {practiceLabel(p)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* practice banner (fake image block) */}
          <View style={styles.practiceBanner}>
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{practiceTitle(selectedPractice)}</Text>
              <Text style={styles.bannerDesc}>{practiceDesc(selectedPractice)}</Text>
            </View>
          </View>

          {/* settings rows */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Session Duration</Text>
            <View style={styles.settingValuePill}>
              <Text style={styles.settingValue}>20 Min</Text>
            </View>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Difficulty Level</Text>
            <View style={styles.settingValuePill}>
              <Text style={styles.settingValue}>High</Text>
            </View>
          </View>

          {/* Spotify */}
          <View style={styles.spotifyCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.spotifyTitle}>Background Music</Text>
              <Text style={styles.spotifySub}>Go to Spotify To Find Out More Music</Text>
            </View>
            <View style={styles.spotifyBadge}>
              <Text style={styles.spotifyBadgeText}>Spotify</Text>
            </View>
          </View>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.push("./")}
          >
            <Text style={styles.primaryBtnText}>{practiceButton(selectedPractice)}</Text>
          </Pressable>

          <Pressable onPress={nextPractice} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next ›</Text>
          </Pressable>
        </View>

        {/* AI Chat */}
        <Pressable style={styles.aiCard} onPress={() => router.push("/chatbot")}>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>Feeling stressed?</Text>
            <Text style={styles.aiSub}>Chat with our AI and feel better in minutes.</Text>
            <View style={styles.aiBtn}>
              <Text style={styles.aiBtnText}>Start AI Chat</Text>
            </View>
          </View>
          <Text style={styles.aiEmoji}>🤖</Text>
        </Pressable>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  screen: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 18, paddingTop: 14 },

  headerRow: { flexDirection: "row", alignItems: "center" },
  hi: { color: COLORS.subtext, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "900", color: COLORS.text, marginTop: 2 },

  statusPill: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CFF3DC",
    gap: 6,
  },
  dotOnline: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: COLORS.primary,
  },
  statusText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },

  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 2,
    marginLeft: 14,
    backgroundColor: COLORS.card,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 14 },

  rowBetween: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallHint: { color: COLORS.subtext, fontWeight: "700" },

  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  logoutText: { color: COLORS.danger, fontWeight: "900" },

  card: {
    marginTop: 14,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    shadowColor: COLORS.shadow as any,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  cardHeader: { marginBottom: 10 },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  cardSub: { marginTop: 6, color: COLORS.subtext, fontWeight: "600" },
  cardLink: { color: COLORS.subtext, fontWeight: "800" },

  wellnessRow: { flexDirection: "row", alignItems: "flex-start" },
  sectionLabel: { color: COLORS.subtext, fontWeight: "800", marginBottom: 10, fontSize: 12 },
  barsRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  barItem: { alignItems: "center", width: 22 },
  bar: {
    width: 10,
    borderRadius: 999,
    backgroundColor: "#BFEFD0",
  },
  barLabel: { marginTop: 6, fontSize: 10, color: COLORS.subtext, fontWeight: "700" },

  scoreWrap: { width: 120, alignItems: "center" },
  scoreRingOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 10,
    borderColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreRingInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F7FFFA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E7F6EC",
  },
  scoreNum: { fontSize: 22, fontWeight: "900", color: COLORS.primary },

  scoreTrack: {
    marginTop: 10,
    width: "100%",
    height: 8,
    borderRadius: 99,
    backgroundColor: "#EEF2F7",
    overflow: "hidden",
  },
  scoreFill: { height: "100%", borderRadius: 99, backgroundColor: COLORS.primary },

  ghostBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DFF3E6",
    backgroundColor: "#F3FFF7",
  },
  ghostBtnText: { color: COLORS.primary, fontWeight: "900", fontSize: 12 },

  pill: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: "#CFF3DC",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  pillText: { color: COLORS.primary, fontWeight: "900", fontSize: 12 },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F3F7",
    gap: 10,
  },
  taskIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
  },
  taskIconDone: { backgroundColor: COLORS.primarySoft },
  taskIconText: { fontWeight: "900", color: COLORS.text },

  taskTitle: { fontWeight: "900", color: COLORS.text },
  taskTime: { marginTop: 2, color: COLORS.subtext, fontWeight: "600", fontSize: 12 },

  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxOn: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  checkMark: { color: "#fff", fontWeight: "900", fontSize: 14 },

  sleepTop: { marginTop: 2, flexDirection: "row", alignItems: "baseline", gap: 8 },
  sleepBig: { fontSize: 22, fontWeight: "900", color: COLORS.text },
  sleepSub: { color: COLORS.subtext, fontWeight: "700" },

  sleepGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sleepMiniCard: {
    width: "48%",
    backgroundColor: "#F6F7FA",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 14,
    padding: 12,
  },
  miniVal: { fontWeight: "900", color: COLORS.text, fontSize: 14 },
  miniLabel: { marginTop: 6, color: COLORS.subtext, fontWeight: "700", fontSize: 12 },

  outlineBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#DFF3E6",
    backgroundColor: "#F3FFF7",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  outlineBtnText: { color: COLORS.primary, fontWeight: "900" },

  segment: {
    marginTop: 12,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemOn: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: "#E7F6EC" },
  segmentText: { color: COLORS.subtext, fontWeight: "900", fontSize: 12 },
  segmentTextOn: { color: COLORS.primary },

  practiceBanner: {
    marginTop: 12,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#EAF7F0",
    borderWidth: 1,
    borderColor: "#DFF3E6",
    overflow: "hidden",
  },
  bannerOverlay: { flex: 1, padding: 14, justifyContent: "flex-end" },
  bannerTitle: { color: COLORS.text, fontWeight: "900", fontSize: 16 },
  bannerDesc: { marginTop: 6, color: COLORS.subtext, fontWeight: "700" },

  settingRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F3F7",
  },
  settingLabel: { color: COLORS.text, fontWeight: "800" },
  settingValuePill: {
    backgroundColor: "#F6F7FA",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  settingValue: { color: COLORS.subtext, fontWeight: "900", fontSize: 12 },

  spotifyCard: {
    marginTop: 12,
    backgroundColor: "#0E7A38",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  spotifyTitle: { color: "#EAF7F0", fontWeight: "900" },
  spotifySub: { marginTop: 4, color: "#D1FAE5", fontWeight: "700", fontSize: 12 },
  spotifyBadge: {
    marginLeft: 10,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  spotifyBadgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  nextBtn: { marginTop: 10, alignSelf: "center" },
  nextBtnText: { color: COLORS.subtext, fontWeight: "900" },

  aiCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    backgroundColor: "#ECFDF5",
    flexDirection: "row",
    alignItems: "center",
  },
  aiTitle: { fontSize: 18, fontWeight: "900", color: COLORS.text },
  aiSub: { color: COLORS.subtext, marginTop: 6, lineHeight: 18, fontWeight: "600" },
  aiBtn: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  aiBtnText: { color: "#fff", fontWeight: "900" },
  aiEmoji: { fontSize: 36, marginLeft: 14 },
});