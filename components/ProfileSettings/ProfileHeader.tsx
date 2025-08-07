// components/ProfileSettings/ProfileHeader.tsx
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ProfileHeaderProps {
  avatarUrl: string;
  username: string;
  setAvatarUrl: (url: string) => void;
  onAvatarUpload: (url: string) => void;
  onEditUsername: () => void;
}

export default function ProfileHeader({
  avatarUrl,
  username,
  setAvatarUrl,
  onAvatarUpload,
  onEditUsername,
}: ProfileHeaderProps) {
  return (
    <View className="relative mb-20">
      <View className="bg-primary-foreground rounded-t-lg p-5 pb-16">
        <Text className="text-sm font-light text-foreground mb-6 text-center">
          User Profiles
        </Text>
        <TouchableOpacity 
          className="flex-row items-center justify-center mt-2 mb-6 pb-6"
          onPress={onEditUsername}
        >
          <Text className="text-2xl text-center font-bold text-foreground mr-2">
            {username || "Tap to add name"}
          </Text>
          {/* <Icon name="edit" size={20} color="hsl(var(--foreground))" /> */}
        </TouchableOpacity>
      </View>
      
      <View 
        className="absolute items-center w-full z-10"
        style={{ bottom: -60 }}
      >
        <Avatar
          size={120}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            onAvatarUpload(url);
          }}
        />
      </View>
    </View>
  );
}
