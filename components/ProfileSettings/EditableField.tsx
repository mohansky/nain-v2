// components/ProfileSettings/EditableField.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface EditableFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
  isRequired?: boolean;
}

export default function EditableField({
  label,
  value,
  onEdit,
  isRequired = false,
}: EditableFieldProps) {
  return (
    <TouchableOpacity
      className="px-3 py-5 flex-row items-center"
      onPress={onEdit}
      activeOpacity={0.7}
    >

      <View style={{ width: '50%' }}>
        <Text className="text-muted-foreground text-base">
          {label} {isRequired && <Text className="text-destructive">*</Text>}
        </Text>
      </View>

      <View style={{ width: '40%' }} className="px-2">
        <Text className="text-base font-semibold text-foreground text-left">
          {value || "Not set"}
        </Text>
      </View>

      <View style={{ width: '10%' }} className="items-end">
        <Feather name="edit-3" size={18} color="#666" />
      </View>
    </TouchableOpacity>
  );
}
