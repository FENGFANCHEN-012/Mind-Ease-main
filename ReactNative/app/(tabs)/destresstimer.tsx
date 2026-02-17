import { View, Text, Pressable, Animated, Easing } from "react-native";
import { useRef, useState, useEffect } from "react";

export default function Stress() {
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Exhale">("Inhale");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 5 seconds per phase animation
  useEffect(() => {
    if (!isRunning) return;

    const phaseInterval = setInterval(() => {
      setPhase(prev => (prev === "Inhale" ? "Exhale" : "Inhale"));
    }, 5000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(phaseInterval);
  }, [isRunning]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    if (timeLeft === 0) setIsRunning(false);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startExercise = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
    setPhase("Inhale");
    scaleAnim.setValue(1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Stress Relief</Text>

      {isRunning ? (
        <>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>{phase}</Text>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>{formatTime(timeLeft)}</Text>

          {/* Breathing ring */}
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 4,
              borderColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 4,
                borderColor: "#87ceeb",
                transform: [{ scale: scaleAnim }],
              }}
            />
          </View>

          <Pressable
            onPress={() => setIsRunning(false)}
            style={{ padding: 10, backgroundColor: "#ccc", borderRadius: 5, marginTop: 30 }}
          >
            <Text>Stop</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 10 }}>Choose duration:</Text>
          <Pressable
            onPress={() => startExercise(1)}
            style={{ padding: 10, backgroundColor: "#eee", marginBottom: 10, borderRadius: 5 }}
          >
            <Text>1 Minute</Text>
          </Pressable>
          <Pressable
            onPress={() => startExercise(2)}
            style={{ padding: 10, backgroundColor: "#eee", marginBottom: 10, borderRadius: 5 }}
          >
            <Text>2 Minutes</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
