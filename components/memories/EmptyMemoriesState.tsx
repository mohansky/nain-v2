// components/memories/EmptyMemoriesState.tsx
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface EmptyMemoriesStateProps {
  type: "no-children" | "no-memories";
  onAddPress?: () => void;
}

const EmptyMemoriesState: React.FC<EmptyMemoriesStateProps> = ({ type, onAddPress }) => {
  if (type === "no-children") {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-6xl mb-4">📸</Text>
        <Text className="text-xl font-bold text-foreground mb-4 text-center">
          No Children Added
        </Text>
        <Text className="text-lg text-muted-foreground text-center">
          Add a child first to start creating memories
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="text-6xl mb-4">📸</Text>
      <Text className="text-xl font-bold text-foreground mb-4 text-center">
        No Memories Yet
      </Text>
      <Text className="text-lg text-muted-foreground text-center mb-6">
        Start capturing precious moments with your little ones
      </Text>
      {onAddPress && (
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={onAddPress}
        >
          <Text className="text-primary-foreground font-semibold">Create First Memory</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyMemoriesState;