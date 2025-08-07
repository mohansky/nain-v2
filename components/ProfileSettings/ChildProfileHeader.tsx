// components/ProfileSettings/ChildProfileHeader.tsx
import { View, Text, TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ChildWithRelationship } from "@/types";

interface ChildProfileHeaderProps {
  child: ChildWithRelationship;
  onAvatarUpload: (childId: string, url: string) => void;
  onEditName: () => void;
}

export default function ChildProfileHeader({
  child,
  onAvatarUpload,
  onEditName,
}: ChildProfileHeaderProps) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // If less than 1 year, show months
    if (age === 0) {
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
    
    return `${age} year${age !== 1 ? 's' : ''} old`;
  };

  return (
    <View className="relative mb-20">
      <View className="bg-primary-foreground rounded-t-lg p-5 pb-16">
        <Text className="text-sm font-light text-foreground mb-6 text-center">
          Child Profile
        </Text>
        <TouchableOpacity 
          className="flex-row items-center justify-center mt-2 mb-2"
          onPress={onEditName}
        >
          <Text className="text-2xl text-center font-bold text-foreground mr-2">
            {child.name || "Tap to add name"}
          </Text>
          <Icon name="edit" size={20} color="hsl(var(--foreground))" />
        </TouchableOpacity>
        <Text className="text-center text-muted-foreground mb-4">
          {calculateAge(child.date_of_birth)}
        </Text>
      </View>
      
      <View 
        className="absolute items-center w-full z-10"
        style={{ bottom: -60 }}
      >
        <Avatar
          size={120}
          url={child.avatar_url || null}
          onUpload={(url: string) => onAvatarUpload(child.id, url)}
        />
      </View>
    </View>
  );
}