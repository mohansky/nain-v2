// components/ChildProfile/ChildHeader.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { ChildWithRelationship } from "@/types";
import { useAvatarUrl } from "@/lib/useAvatarUrl";

interface ChildHeaderProps {
  child: ChildWithRelationship;
}

const ChildHeader: React.FC<ChildHeaderProps> = ({ child }) => {
  const { avatarUrl, loading } = useAvatarUrl(child.avatar_url);

  function calculateAge(dateOfBirth: string) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    if (today.getDate() < birthDate.getDate()) {
      ageMonths--;
      if (ageMonths < 0) {
        ageYears--;
        ageMonths += 12;
      }
    }

    if (ageYears === 0) {
      return `${ageMonths} month${ageMonths !== 1 ? "s" : ""} old`;
    } else if (ageMonths === 0) {
      return `${ageYears} year${ageYears !== 1 ? "s" : ""} old`;
    } else {
      return `${ageYears} year${ageYears !== 1 ? "s" : ""}, ${ageMonths} month${
        ageMonths !== 1 ? "s" : ""
      } old`;
    }
  }

  return (
    <View>
      <View className="flex-row items-center mb-4">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-20 h-20 rounded-full mr-4"
          />
        ) : (
          <View className="w-20 h-20 rounded-full mr-4 bg-gray-300 items-center justify-center">
            <Text className="text-gray-600 text-2xl font-bold">
              {child.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <View>
          <Text className="text-2xl font-bold text-foreground">
            {child.name} growth chart
          </Text>
          <Text className="text-lg text-muted-foreground">
            {calculateAge(child.date_of_birth)}
          </Text>
   
        </View>
      </View>
    </View>
  );
};

export default ChildHeader;
