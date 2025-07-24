import { Tabs } from "expo-router";
import React from "react";
import { Platform, Image, StyleSheet } from "react-native"; // Import Image and StyleSheet

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint; // Get tint color once

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor, // Use the variable
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard", // Changed title to reflect the content
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("@/assets/images/3d-house.png")} // Path to your PNG
              style={[
                styles.tabIcon,
                { tintColor: focused ? tintColor : "gray" },
              ]} // Apply tint
            />
          ),
        }}
      />
      <Tabs.Screen
        name="booking-appointment"
        options={{
          title: "Book Appointment",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("@/assets/images/3d-calendar.png")} // Path to your PNG
              style={[
                styles.tabIcon,
                { tintColor: focused ? tintColor : "gray" },
              ]} // Apply tint
            />
          ),
        }}
      />
      <Tabs.Screen
        name="queueing"
        options={{
          title: "Queueing",
          tabBarIcon: (
            { color } // Use IconSymbol for other tabs
          ) => <IconSymbol size={28} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="in-app-messaging"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account-settings"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="person.crop.circle.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 28, // Adjust size as needed
    height: 28, // Adjust size as needed
    resizeMode: "contain",
  },
});
