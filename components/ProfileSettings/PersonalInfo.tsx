import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Language, Relationship } from "@/types";
import EditableField from "./EditableField";
import EditFieldModal from "./EditFieldModal";

interface PersonalInfoProps {
  session: Session;
  username: string;
  setUsername: (username: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  relationship: Relationship | "";
  setRelationship: (relationship: Relationship | "") => void;
  location: string;
  setLocation: (location: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  onEditUsername: (callback: () => void) => void;
}

export default function PersonalInfo({
  session,
  username,
  setUsername,
  language,
  setLanguage,
  relationship,
  setRelationship,
  location,
  setLocation,
  phoneNumber,
  setPhoneNumber,
  onEditUsername,
}: PersonalInfoProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<
    "username" | "language" | "relationship" | "location" | "phoneNumber" | null
  >(null);

  const handleEditField = (
    field: "username" | "language" | "relationship" | "location" | "phoneNumber"
  ) => {
    setEditingField(field);
    setModalVisible(true);
  };

  const handleSaveField = (value: any) => {
    switch (editingField) {
      case "username":
        setUsername(value);
        break;
      case "language":
        setLanguage(value);
        break;
      case "relationship":
        setRelationship(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
    }
  };

  const getCurrentValue = () => {
    switch (editingField) {
      case "username":
        return username;
      case "language":
        return language;
      case "relationship":
        return relationship;
      case "location":
        return location;
      case "phoneNumber":
        return phoneNumber;
      default:
        return "";
    }
  };

  const getFieldType = () => {
    switch (editingField) {
      case "username":
        return "text" as const;
      case "language":
        return "language" as const;
      case "relationship":
        return "relationship" as const;
      case "location":
      case "phoneNumber":
        return "text" as const;
      default:
        return "text" as const;
    }
  };

  const getDisplayValue = (
    field: "username" | "language" | "relationship" | "location" | "phoneNumber"
  ) => {
    switch (field) {
      case "username":
        return username || "Not set";
      case "language":
        return language.charAt(0).toUpperCase() + language.slice(1);
      case "relationship":
        return relationship
          ? relationship.charAt(0).toUpperCase() + relationship.slice(1)
          : "Not set";
      case "location":
        return location || "Not set";
      case "phoneNumber":
        return phoneNumber || "Not set";
      default:
        return "Not set";
    }
  };


  // Register the edit username callback
  React.useEffect(() => {
    onEditUsername(() => handleEditField("username"));
  }, []);

  return (
    <>
      <View className="px-5">
        <TextInput
          className="text-center border border-border rounded-lg p-3 text-base bg-muted text-muted-foreground mb-3"
          value={session?.user?.email || ""}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          editable={false}
        />
        <View className="bg-card rounded-xl mb-5 space-y-3">
          <EditableField
            label="Phone Number"
            value={getDisplayValue("phoneNumber")}
            onEdit={() => handleEditField("phoneNumber")}
          />
          <EditableField
            label="Relationship"
            value={getDisplayValue("relationship")}
            onEdit={() => handleEditField("relationship")}
          />
          <EditableField
            label="Location"
            value={getDisplayValue("location")}
            onEdit={() => handleEditField("location")}
          />

          <EditableField
            label="Language"
            value={getDisplayValue("language")}
            onEdit={() => handleEditField("language")}
            isRequired
          />
        </View>
      </View>

      <EditFieldModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveField}
        fieldType={getFieldType()}
        currentValue={getCurrentValue()}
        label={
          editingField
            ? editingField === "phoneNumber"
              ? "Phone Number"
              : editingField.charAt(0).toUpperCase() + editingField.slice(1)
            : ""
        }
        placeholder={
          editingField === "username"
            ? "Enter your name (optional)"
            : editingField === "location"
            ? "Enter your location (optional)"
            : editingField === "phoneNumber"
            ? "Enter phone number (optional)"
            : undefined
        }
        maxLength={
          editingField === "username" ? 50 :
          editingField === "phoneNumber" ? 20 : undefined
        }
      />
    </>
  );
}
