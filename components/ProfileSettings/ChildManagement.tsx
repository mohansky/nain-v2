import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { ChildWithRelationship } from "@/types";
import AddChildModal from "./AddChildModal";
import ChildProfile from "./ChildProfile";
import Button from "../ui/Button";

interface ChildManagementProps {
  session: Session;
}

export default function ChildManagement({ session }: ChildManagementProps) {
  const [children, setChildren] = useState<ChildWithRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (session) {
      fetchChildren();
    }
  }, [session]);

  async function fetchChildren() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_children")
        .select(
          `
          *,
          child_profiles (
            *,
            child_measurements (*)
          )
        `
        )
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      const childrenWithRelationship: ChildWithRelationship[] =
        data?.map((relation) => {
          const childProfile = relation.child_profiles;
          const measurements = childProfile.child_measurements || [];
          const latestMeasurement =
            measurements.length > 0
              ? measurements.sort(
                  (a: any, b: any) =>
                    new Date(b.measured_at).getTime() -
                    new Date(a.measured_at).getTime()
                )[0]
              : null;

          return {
            ...childProfile,
            user_relationship: relation,
            latest_measurements: latestMeasurement,
          };
        }) || [];

      setChildren(childrenWithRelationship);
    } catch (error) {
      console.error("Error fetching children:", error);
      Alert.alert("Error", "Failed to load children");
    } finally {
      setLoading(false);
    }
  }

  const handleAddSuccess = () => {
    fetchChildren();
  };

  if (loading) {
    return (
      <View className="p-4">
        <Text className="text-center text-muted-foreground">
          Loading children...
        </Text>
      </View>
    );
  }

  return (
    <View>
      {children.length > 0 && (
        <View className="mb-4">
          {children.map((child) => (
            <ChildProfile
              key={child.id}
              child={child}
              session={session}
              onUpdate={fetchChildren}
            />
          ))}
        </View>
      )}

      {/* <TouchableOpacity
        className="bg-primary px-6 py-4 rounded-lg mb-6"
        onPress={() => setShowAddModal(true)}
      >
        <Text className="text-primary-foreground font-semibold text-center text-lg">
          {children.length === 0 ? 'Add Your First Child' : 'Add Child'}
        </Text>
      </TouchableOpacity> */}

      <Button variant="outline" size="lg" onPress={() => setShowAddModal(true)}>
        {children.length === 0 ? "Add Your First Child" : "Add Child"}
      </Button>

      <AddChildModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        session={session}
      />
    </View>
  );
}
