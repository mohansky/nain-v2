// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function _Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Dashboard"
        options={{
          tabBarLabel: "Dashboard",
          headerShown: false,
          tabBarIcon: ({ color = "black", size = 24 }) => (
            <Feather name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Memories"
        options={{
          tabBarLabel: "Memories",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="image" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Activities"
        options={{
          tabBarLabel: "Activities",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
