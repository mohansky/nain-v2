// 5. BreastfeedingHistory.tsx - List of past sessions
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { supabase } from "@/lib/supabase";
import SessionSummary from "./SessionSummary";
import { BreastfeedingSession } from "@/types";

interface BreastfeedingHistoryProps {
  userId: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement;
}

const BreastfeedingHistory: React.FC<BreastfeedingHistoryProps> = ({
  userId,
  ListHeaderComponent,
}) => {
  const [sessions, setSessions] = useState<BreastfeedingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchSessions = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("breastfeeding_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("start_time", { ascending: false })
        .limit(50);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const onRefresh = (): void => {
    setRefreshing(true);
    fetchSessions();
  };

  const renderSession: ListRenderItem<BreastfeedingSession> = ({ item }) => (
    <SessionSummary session={item} />
  );

  const renderEmpty = (): React.JSX.Element => (
    <View className="justify-center items-center py-20">
      <Text className="text-gray-500 text-lg">No sessions recorded yet</Text>
      <Text className="text-gray-400 text-sm mt-2">
        Start your first breastfeeding session above
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">Recent Sessions</Text>
      </View> */}

      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ flexGrow: 1 }}
      /> */}
    </View>
  );
};

export default BreastfeedingHistory;
