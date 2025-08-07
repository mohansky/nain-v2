// app/(tabs)/index.tsx
import {
  Platform,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { Button, Text } from "@rneui/themed";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";
import { ChildWithRelationship } from "@/types";

export default function HomePage() {
  const { session, loading } = useAuth();
  const [children, setChildren] = useState<ChildWithRelationship[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);

  // console.log('HomePage - loading:', loading, 'session:', !!session, 'user:', session?.user?.email);

  useEffect(() => {
    if (session) {
      fetchChildren();
    }
  }, [session]);

  async function fetchChildren() {
    try {
      setLoadingChildren(true);
      const { data, error } = await supabase
        .from("user_children")
        .select(
          `
          *,
          child_profiles (*)
        `
        )
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
      Alert.alert("Error", "Failed to load children");
    } finally {
      setLoadingChildren(false);
    }
  }


  if (loading || loadingChildren) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {session ? (
          <ScrollView className="flex-1 p-4">
            <Text className="text-2xl font-bold text-foreground mb-6 text-center">
              My Children
            </Text>

            {children.length === 0 ? (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-6xl mb-4">👶</Text>
                <Text className="text-lg text-muted-foreground mb-6 text-center">
                  No child added yet
                </Text>
                <Text className="text-base text-muted-foreground text-center">
                  Go to the Profile tab to add your first child and start tracking their development
                </Text>
              </View>
            ) : (
              <View>
                {children.map((child) => (
                  <View
                    key={child.id}
                    className="bg-card p-4 rounded-lg mb-4 shadow-sm border border-border"
                  >
                    <Text className="text-lg font-semibold text-foreground">
                      {child.name}
                    </Text>
                    <Text className="text-muted-foreground">
                      Born: {child.date_of_birth}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      Role:{" "}
                      {child.user_relationship.is_primary_caregiver
                        ? "Primary Caregiver"
                        : child.user_relationship.relationship}
                    </Text>
                  </View>
                ))}

                <Text className="text-center text-muted-foreground mt-4">
                  To add or edit children, go to the Profile tab
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text>No session found - user might not be logged in</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
