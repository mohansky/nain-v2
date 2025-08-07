import React, { useState } from "react";
import { View, Text } from "react-native";
import { ChildWithRelationship, ChildGender } from "@/types";
import EditableField from "./EditableField";
import EditFieldModal from "./EditFieldModal";

interface ChildPersonalInfoProps {
  child: ChildWithRelationship;
  onUpdateChild: (childId: string, updates: any) => void;
  onEditName: (callback: () => void) => void;
}

export default function ChildPersonalInfo({
  child,
  onUpdateChild,
  onEditName,
}: ChildPersonalInfoProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<
    "name" | "birthday" | "gender" | "height" | "weight" | "headCircumference" | null
  >(null);

  const handleEditField = (field: "name" | "birthday" | "gender" | "height" | "weight" | "headCircumference") => {
    setEditingField(field);
    setModalVisible(true);
  };

  const handleSaveField = (value: any) => {
    const updates: any = {};
    
    switch (editingField) {
      case "name":
        updates.name = value;
        break;
      case "birthday":
        updates.date_of_birth = value;
        break;
      case "gender":
        updates.gender = value;
        break;
      case "height":
        updates.latest_measurements = {
          ...child.latest_measurements,
          height_cm: parseFloat(value) || null,
        };
        break;
      case "weight":
        updates.latest_measurements = {
          ...child.latest_measurements,
          weight_kg: parseFloat(value) || null,
        };
        break;
      case "headCircumference":
        updates.latest_measurements = {
          ...child.latest_measurements,
          head_circumference_cm: parseFloat(value) || null,
        };
        break;
    }
    
    onUpdateChild(child.id, updates);
  };

  const getCurrentValue = () => {
    switch (editingField) {
      case "name":
        return child.name;
      case "birthday":
        return child.date_of_birth;
      case "gender":
        return child.gender;
      case "height":
        return child.latest_measurements?.height_cm?.toString() || "";
      case "weight":
        return child.latest_measurements?.weight_kg?.toString() || "";
      case "headCircumference":
        return child.latest_measurements?.head_circumference_cm?.toString() || "";
      default:
        return "";
    }
  };

  const getFieldType = () => {
    switch (editingField) {
      case "name":
        return "text" as const;
      case "birthday":
        return "date" as const;
      case "gender":
        return "gender" as const;
      case "height":
      case "weight":
      case "headCircumference":
        return "number" as const;
      default:
        return "text" as const;
    }
  };

  const getDisplayValue = (field: "name" | "birthday" | "gender" | "height" | "weight" | "headCircumference") => {
    switch (field) {
      case "name":
        return child.name || "Not set";
      case "birthday":
        const date = new Date(child.date_of_birth);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const year = date.getFullYear();
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                      day === 2 || day === 22 ? 'nd' : 
                      day === 3 || day === 23 ? 'rd' : 'th';
        return `${day}${suffix} ${month} ${year}`;
      case "gender":
        return child.gender 
          ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1)
          : "Not set";
      case "height":
        return child.latest_measurements?.height_cm 
          ? `${child.latest_measurements.height_cm} cm`
          : "Not recorded";
      case "weight":
        return child.latest_measurements?.weight_kg 
          ? `${child.latest_measurements.weight_kg} kg`
          : "Not recorded";
      case "headCircumference":
        return child.latest_measurements?.head_circumference_cm 
          ? `${child.latest_measurements.head_circumference_cm} cm`
          : "Not recorded";
      default:
        return "Not set";
    }
  };

  const getLabel = (field: "name" | "birthday" | "gender" | "height" | "weight" | "headCircumference") => {
    switch (field) {
      case "name":
        return "Name";
      case "birthday":
        return "Birthday";
      case "gender":
        return "Gender";
      case "height":
        return "Height";
      case "weight":
        return "Weight";
      case "headCircumference":
        return "Head Circumference";
      default:
        return "";
    }
  };

  const getPlaceholder = (field: "name" | "birthday" | "gender" | "height" | "weight" | "headCircumference") => {
    switch (field) {
      case "name":
        return "Enter child's name";
      case "height":
        return "Enter height in cm";
      case "weight":
        return "Enter weight in kg";
      case "headCircumference":
        return "Enter head circumference in cm";
      default:
        return undefined;
    }
  };

  // Check if child is less than 3 years old
  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(child.date_of_birth);
    return today.getFullYear() - birthDate.getFullYear();
  };

  const isUnder3Years = calculateAge() < 3;

  // Register the edit name callback
  React.useEffect(() => {
    onEditName(() => handleEditField("name"));
  }, []);

  return (
    <>
      <View className="px-5">
        <View className="bg-card rounded-xl mb-5 space-y-3">
          <EditableField
            label="Birthday"
            value={getDisplayValue("birthday")}
            onEdit={() => handleEditField("birthday")}
          />
          
          <EditableField
            label="Gender"
            value={getDisplayValue("gender")}
            onEdit={() => handleEditField("gender")}
          />
          
          <EditableField
            label="Height"
            value={getDisplayValue("height")}
            onEdit={() => handleEditField("height")}
          />
          
          <EditableField
            label="Weight"
            value={getDisplayValue("weight")}
            onEdit={() => handleEditField("weight")}
          />
          
         {isUnder3Years && (
            <EditableField
              label="Head Circumference"
              value={getDisplayValue("headCircumference")}
              onEdit={() => handleEditField("headCircumference")}
            />
          )} 
        </View>
      </View>

      <EditFieldModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveField}
        fieldType={getFieldType()}
        currentValue={getCurrentValue()}
        label={editingField ? getLabel(editingField) : ""}
        placeholder={editingField ? getPlaceholder(editingField) : undefined}
      />
    </>
  );
}