// components/memories/MemoryList.tsx
import React from "react";
import { ScrollView, RefreshControl } from "react-native";
import { MemoryWithDetails } from "@/types";
import MemoryCard from "./MemoryCard";

interface MemoryListProps {
  memories: MemoryWithDetails[];
  refreshing: boolean;
  onRefresh: () => void;
  onLike: (memoryId: string, isCurrentlyLiked: boolean) => void;
  formatTimeAgo: (dateString: string) => string;
  onEdit?: (memory: MemoryWithDetails) => void;
  currentUserId?: string;
}

const MemoryList: React.FC<MemoryListProps> = ({
  memories,
  refreshing,
  onRefresh,
  onLike,
  formatTimeAgo,
  onEdit,
  currentUserId
}) => {
  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          onLike={onLike}
          formatTimeAgo={formatTimeAgo}
          onEdit={onEdit}
          currentUserId={currentUserId}
        />
      ))}
    </ScrollView>
  );
};

export default MemoryList;