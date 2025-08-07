// app/(tabs)/Memories.tsx
import React, { useState, useEffect } from "react";
import { Text, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { ChildWithRelationship, MemoryWithDetails } from "@/types";
import AddMemoryModal from "@/components/AddMemoryModal";
import { MemoryHeader, EmptyMemoriesState, MemoryList } from "@/components/memories";

const MemoriesScreen = () => {
  const { session } = useAuth();
  const [memories, setMemories] = useState<MemoryWithDetails[]>([]);
  const [children, setChildren] = useState<ChildWithRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryWithDetails | undefined>(undefined);

  useEffect(() => {
    if (session) {
      fetchChildren();
      fetchMemories();
    }
  }, [session]);

  async function fetchChildren() {
    try {
      const { data, error } = await supabase
        .from("user_children")
        .select(`
          *,
          child_profiles (*)
        `)
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      const childrenWithRelationship: ChildWithRelationship[] =
        data?.map((relation) => ({
          ...relation.child_profiles,
          user_relationship: relation,
        })) || [];

      setChildren(childrenWithRelationship);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  }

  async function fetchMemories() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("child_memories")
        .select(`
          *,
          child_profiles!child_memories_child_id_fkey (*)
        `)
        .order("memory_date", { ascending: false });

      if (error) throw error;

      // Get likes and comments for each memory
      const memoriesWithDetails: MemoryWithDetails[] = await Promise.all(
        (data || []).map(async (memory) => {
          // Get likes
          const { data: likesData } = await supabase
            .from("memory_likes")
            .select("*")
            .eq("memory_id", memory.id);

          // Get comments (without profiles for now)
          const { data: commentsData } = await supabase
            .from("memory_comments")
            .select("*")
            .eq("memory_id", memory.id)
            .order("created_at", { ascending: true });

          // Get creator profile separately
          const { data: creatorData } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", memory.created_by)
            .single();

          const isLiked = likesData?.some(like => like.user_id === session?.user?.id) || false;

          return {
            ...memory,
            child_profile: memory.child_profiles,
            creator_profile: creatorData || { username: 'Anonymous' },
            likes: likesData || [],
            comments: commentsData || [],
            like_count: likesData?.length || 0,
            comment_count: commentsData?.length || 0,
            is_liked: isLiked,
          };
        })
      );

      setMemories(memoriesWithDetails);
    } catch (error) {
      console.error("Error fetching memories:", error);
      Alert.alert("Error", "Failed to load memories");
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMemories();
    setRefreshing(false);
  };

  const handleLike = async (memoryId: string, isCurrentlyLiked: boolean) => {
    try {
      if (isCurrentlyLiked) {
        // Unlike
        await supabase
          .from("memory_likes")
          .delete()
          .eq("memory_id", memoryId)
          .eq("user_id", session?.user?.id);
      } else {
        // Like
        await supabase
          .from("memory_likes")
          .insert({
            memory_id: memoryId,
            user_id: session?.user?.id,
          });
      }
      
      // Refresh memories to update like count
      await fetchMemories();
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like");
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleEditMemory = (memory: MemoryWithDetails) => {
    setEditingMemory(memory);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingMemory(undefined);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-muted-foreground">Loading memories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <MemoryHeader 
        onAddPress={() => setShowAddModal(true)}
        disabled={children.length === 0}
      />

      {children.length === 0 ? (
        <EmptyMemoriesState type="no-children" />
      ) : memories.length === 0 ? (
        <EmptyMemoriesState 
          type="no-memories" 
          onAddPress={() => setShowAddModal(true)}
        />
      ) : (
        <MemoryList
          memories={memories}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onLike={handleLike}
          formatTimeAgo={formatTimeAgo}
          onEdit={handleEditMemory}
          currentUserId={session?.user?.id}
        />
      )}

      <AddMemoryModal
        visible={showAddModal}
        children={children}
        onClose={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          fetchMemories();
        }}
        editMemory={editingMemory}
      />
    </SafeAreaView>
  );
};

export default MemoriesScreen;
