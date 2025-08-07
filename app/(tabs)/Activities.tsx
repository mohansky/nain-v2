// app/(tabs)/Activities.tsx
import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useAuth } from "@/lib/useAuth";
import BreastfeedingSession from "@/components/BreastfeedingTracker/BreastfeedingSession";
import BreastfeedingHistory from "@/components/BreastfeedingTracker/BreastfeedingHistory";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BreastfeedingScreen() {
  const { session, user, loading } = useAuth();
  const [refreshHistory, setRefreshHistory] = useState<number>(0);

  const handleSessionComplete = (): void => {
    setRefreshHistory((prev) => prev + 1);
  };

  if (!session) {
    return (
      <SafeAreaView>
        <Text className="text-gray-500">Please log in to track sessions</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-600">
        <BreastfeedingHistory
          userId={session.user.id}
          key={refreshHistory}
          ListHeaderComponent={
            <BreastfeedingSession
              userId={session.user.id}
              onSessionComplete={handleSessionComplete}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}
