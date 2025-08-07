import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { View, Alert, Platform, ScrollView, ToastAndroid } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Language, Relationship } from "@/types";

import ProfileHeader from "./ProfileHeader";
import PersonalInfo from "./PersonalInfo";
import ActionButtons from "./ActionButtons";
import ChildManagement from "./ChildManagement";

export default function ProfileSettings({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [language, setLanguage] = useState<Language>("english");
  const [relationship, setRelationship] = useState<Relationship | "">("");
  const [location, setLocation] = useState("");
  const [isPrimaryCaregiver, setIsPrimaryCaregiver] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [editUsernameCallback, setEditUsernameCallback] = useState<(() => void) | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `username, avatar_url, language, relationship, location, is_primary_caregiver, phone_number`
        )
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || "");
        setLanguage(data.language || "english");
        setRelationship(data.relationship || "");
        setLocation(data.location || "");
        setIsPrimaryCaregiver(data.is_primary_caregiver || false);
        setPhoneNumber(data.phone_number || "");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
    language,
    relationship,
    location,
    is_primary_caregiver,
    phone_number,
  }: {
    username: string;
    avatar_url: string;
    language: Language;
    relationship: Relationship | "";
    location: string;
    is_primary_caregiver: boolean;
    phone_number: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username: username || null,
        avatar_url: avatar_url || null,
        language,
        relationship: relationship || null,
        location: location || null,
        is_primary_caregiver,
        phone_number: phone_number || null,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) {
        throw error;
      }

      if (Platform.OS === "android") {
        ToastAndroid.show("Profile updated successfully!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProfile = () => {
    updateProfile({
      username,
      avatar_url: avatarUrl,
      language,
      relationship,
      location,
      is_primary_caregiver: isPrimaryCaregiver,
      phone_number: phoneNumber,
    });
  };

  const handleAvatarUpload = (url: string) => {
    updateProfile({
      username,
      avatar_url: url,
      language,
      relationship,
      location,
      is_primary_caregiver: isPrimaryCaregiver,
      phone_number: phoneNumber,
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-primary/20"
      contentContainerStyle={{
        // paddingBottom: insets.bottom + 100,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full h-auto">
        <View className="p-6">
          <View className="bg-card mb-5 rounded-xl shadow-lg">
            <ProfileHeader
              username={username}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              onAvatarUpload={handleAvatarUpload}
              onEditUsername={() => editUsernameCallback?.()}
            />

            <PersonalInfo 
              session={session}
              username={username}
              setUsername={setUsername}
              language={language}
              setLanguage={setLanguage}
              relationship={relationship}
              setRelationship={setRelationship}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              location={location}
              setLocation={setLocation}
              onEditUsername={(callback) => setEditUsernameCallback(() => callback)}
            />

            <ActionButtons
              loading={loading}
              onUpdateProfile={handleUpdateProfile}
            />
          </View>
        </View>

        {/* Child Management Section */}
        <View className="p-6">
          <ChildManagement session={session} />
        </View>
      </View>
    </ScrollView>
  );
}
