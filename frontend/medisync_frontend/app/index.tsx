import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { View, Image, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Index() {
  const [displayText, setDisplayText] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fullText = "MediSync";
  const currentIndexRef = useRef(0);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    const typingDelay = 1200;
    const charTypingDuration = 150;
    const typingTimer = setTimeout(() => {
      currentIndexRef.current = 0;
      const typeInterval = setInterval(() => {
        if (currentIndexRef.current < fullText.length) {
          setDisplayText(fullText.slice(0, currentIndexRef.current + 1));
          currentIndexRef.current++;
        } else {
          clearInterval(typeInterval);
        }
      }, charTypingDuration);
      return () => clearInterval(typeInterval);
    }, typingDelay);

    const totalTypingDuration = fullText.length * charTypingDuration;
    const navigationDelay = typingDelay + totalTypingDuration + 500;
    const navigationTimer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      router.replace("/auth/options");
    }, navigationDelay);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.typingText}>{displayText}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f8",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: SCREEN_WIDTH > 200 ? 160 : SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH > 200 ? 160 : SCREEN_WIDTH * 0.7,
    maxWidth: 200,
    maxHeight: 200,
    marginBottom: 16,
  },
  typingText: {
    fontSize: SCREEN_WIDTH > 350 ? 32 : 22,
    fontWeight: "bold",
    color: "#286660",
    marginTop: 10,
    letterSpacing: 2,
    textAlign: "center",
  },
});
