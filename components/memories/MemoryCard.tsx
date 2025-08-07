// components/memories/MemoryCard.tsx
import React from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { MemoryWithDetails } from "@/types";
import { useAvatarUrl } from "@/lib/useAvatarUrl";
import Feather from '@expo/vector-icons/Feather';

interface MemoryCardProps {
  memory: MemoryWithDetails;
  onLike: (memoryId: string, isCurrentlyLiked: boolean) => void;
  formatTimeAgo: (dateString: string) => string;
  onEdit?: (memory: MemoryWithDetails) => void;
  currentUserId?: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onLike, formatTimeAgo, onEdit, currentUserId }) => {
  const { avatarUrl, loading } = useAvatarUrl(memory.child_profile.avatar_url);
  return (
    <View className="bg-card border-b border-border my-5">
      {/* Memory Header */}
      <View className="flex-row items-center p-4">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-muted mr-3 justify-center items-center">
            <Text className="text-lg font-bold text-muted-foreground">
              {memory.child_profile.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-foreground">
            {memory.child_profile.name}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {formatTimeAgo(memory.memory_date)}
          </Text>
        </View>
        
        {/* Edit button - only show if current user created the memory */}
        {onEdit && currentUserId === memory.created_by && (
          <TouchableOpacity
            className="p-2"
            onPress={() => onEdit(memory)}
          >
            {/* <Text className="text-lg">✏️</Text> */}
            <Feather name="edit-3" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Memory Images */}
      {memory.images.length > 0 && (
        <View className="h-96">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="flex-1"
            // contentContainerStyle={{ paddingHorizontal: 16 }}
            pagingEnabled={true}
            decelerationRate="fast"
            snapToInterval={undefined}
          >
            {memory.images.map((imageUrl, index) => (
              <View key={index} className="w-screen">
                <View className="">
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Memory Content */}
      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground mb-2">
          {memory.title}
        </Text>
        {memory.description && (
          <Text className="text-foreground mb-3">
            {memory.description}
          </Text>
        )}

        {/* Actions */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="flex-row items-center mr-4"
              onPress={() => onLike(memory.id, memory.is_liked)}
            >
              <Text className="text-lg mr-1">
                {memory.is_liked ? "❤️" : "🤍"}
              </Text>
              <Text className="text-muted-foreground">
                {memory.like_count}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-lg mr-1">💬</Text>
              <Text className="text-muted-foreground">
                {memory.comment_count}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-muted-foreground">
            by {memory.creator_profile?.username || 'Anonymous'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MemoryCard;