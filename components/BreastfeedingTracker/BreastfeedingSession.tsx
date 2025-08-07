//  1. BreastfeedingSession.tsx - Main tracking component
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Timer from "./Timer";
import SideSelector from "./SideSelector";
import { BreastSide } from "@/types";
import { supabase } from "@/lib/supabase";
import Button from "../ui/Button";

interface BreastfeedingSessionProps {
  userId: string;
  onSessionComplete?: () => void;
}

const BreastfeedingSession: React.FC<BreastfeedingSessionProps> = ({
  userId,
  onSessionComplete,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<BreastSide>("left");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const startSession = async (): Promise<void> => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("breastfeeding_sessions")
        .insert([
          {
            user_id: userId,
            start_time: now,
            side: selectedSide,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSessionId(data.id);
      setStartTime(now);
      setIsActive(true);
    } catch (error) {
      Alert.alert("Error", "Failed to start session");
    }
  };

  const endSession = async (): Promise<void> => {
    if (!startTime || !sessionId) return;

    try {
      const endTime = new Date().toISOString();
      const totalDurationSeconds = Math.floor(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
      );
      const durationMinutes = Math.floor(totalDurationSeconds / 60);
      const durationSeconds = totalDurationSeconds % 60;

      const { error } = await supabase
        .from("breastfeeding_sessions")
        .update({
          end_time: endTime,
          duration_minutes: durationMinutes,
          duration_seconds: durationSeconds,
          total_duration_seconds: totalDurationSeconds,
        })
        .eq("id", sessionId);

      if (error) throw error;

      setIsActive(false);
      setStartTime(null);
      setSessionId(null);
      onSessionComplete?.();
    } catch (error) {
      Alert.alert("Error", "Failed to end session");
    }
  };

  return (
    <View className="bg-white rounded-lg p-6 m-4 shadow-lg">
      <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
        Breastfeeding Session
      </Text>

      <SideSelector
        selectedSide={selectedSide}
        onSideChange={setSelectedSide}
        disabled={isActive}
      />

      <Timer isActive={isActive} startTime={startTime} />

      <Button
        variant={`${isActive ? "destructive" : "primary"}`}
        size="lg"
        onPress={isActive ? endSession : startSession}
      >
        {isActive ? "End Session" : "Start Session"}
      </Button>
    </View>
  );
};

export default BreastfeedingSession;
