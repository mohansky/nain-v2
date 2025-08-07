// components/memories/MemoryHeader.tsx
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Button from "../ui/Button";
import Feather from "@expo/vector-icons/Feather";

interface MemoryHeaderProps {
  onAddPress: () => void;
  disabled?: boolean;
}

const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  onAddPress,
  disabled = false,
}) => {
  return (
    <View className="flex-row justify-between items-center p-4 border-b border-border">
      <Text className="text-2xl font-bold text-foreground">Memories</Text> 
      <Button
        variant="primary"
        size="icon"
        onPress={onAddPress}
        disabled={disabled}
        className="rounded-full"
      >
        <Text className="text-primary-foreground font-semibold">
          <Feather name="plus" size={18} color="primary" />
        </Text>
      </Button>
    </View>
  );
};

export default MemoryHeader;
