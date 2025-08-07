import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Session } from "@supabase/supabase-js";
import { ChildWithRelationship } from "@/types";
import { supabase } from "@/lib/supabase";
import ChildProfileHeader from "./ChildProfileHeader";
import ChildPersonalInfo from "./ChildPersonalInfo";
import ActionButtons from "./ActionButtons";

interface ChildProfileProps {
  child: ChildWithRelationship;
  session: Session;
  onUpdate: () => void;
}

export default function ChildProfile({ child, session, onUpdate }: ChildProfileProps) {
  const [loading, setLoading] = useState(false);
  const [editNameCallback, setEditNameCallback] = useState<(() => void) | null>(null);

  const handleAvatarUpload = async (childId: string, avatarUrl: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('child_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', childId);

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChild = async (childId: string, updates: any) => {
    try {
      setLoading(true);
      
      // Handle measurements separately if they exist
      if (updates.latest_measurements) {
        const measurementData = {
          child_id: childId,
          height_cm: updates.latest_measurements.height_cm,
          weight_kg: updates.latest_measurements.weight_kg,
          head_circumference_cm: updates.latest_measurements.head_circumference_cm,
          measured_at: new Date().toISOString(),
        };

        const { error: measurementError } = await supabase
          .from('child_measurements')
          .upsert(measurementData);

        if (measurementError) throw measurementError;
        
        // Remove measurements from updates object
        delete updates.latest_measurements;
      }

      // Update child profile
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('child_profiles')
          .update(updates)
          .eq('id', childId);

        if (error) throw error;
      }

      onUpdate();
      Alert.alert('Success', 'Child profile updated successfully!');
    } catch (error) {
      console.error('Error updating child:', error);
      Alert.alert('Error', 'Failed to update child profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-card mb-5 rounded-xl shadow-lg ">
      <ChildProfileHeader
        child={child}
        onAvatarUpload={handleAvatarUpload}
        onEditName={() => editNameCallback?.()}
      />
      
      <ChildPersonalInfo
        child={child}
        onUpdateChild={handleUpdateChild}
        onEditName={(callback) => setEditNameCallback(() => callback)}
      />
      
     <ActionButtons
        loading={loading}
        onUpdateProfile={() => {}} // Individual fields auto-save
      /> 
    </View>
  );
}