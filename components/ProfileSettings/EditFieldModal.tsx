import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Language, Relationship, ChildGender } from '@/types';

type FieldType = 'text' | 'language' | 'relationship' | 'number' | 'date' | 'gender';

interface EditFieldModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: any) => void;
  fieldType: FieldType;
  currentValue: any;
  label: string;
  placeholder?: string;
  maxLength?: number;
}

export default function EditFieldModal({
  visible,
  onClose,
  onSave,
  fieldType,
  currentValue,
  label,
  placeholder,
  maxLength
}: EditFieldModalProps) {
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue, visible]);

  const handleSave = () => {
    if (fieldType === 'text' && typeof value === 'string' && !value.trim()) {
      setValue('');
    }
    onSave(value);
    onClose();
  };

  const handleClose = () => {
    setValue(currentValue);
    onClose();
  };

  const renderInput = () => {
    switch (fieldType) {
      case 'text':
        return (
          <TextInput
            className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            maxLength={maxLength}
            autoCapitalize={label.toLowerCase().includes('name') ? 'words' : 'none'}
            autoCorrect={false}
            autoFocus
          />
        );

      case 'language':
        return (
          <View className="border border-border rounded-lg bg-card">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue: Language) => setValue(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="English" value="english" />
              <Picker.Item label="Hindi" value="hindi" />
              <Picker.Item label="Assamese" value="assamese" />
              <Picker.Item label="Bengali" value="bengali" />
              <Picker.Item label="Kannada" value="kannada" />
              <Picker.Item label="Tamil" value="tamil" />
              <Picker.Item label="Marathi" value="marathi" />
            </Picker>
          </View>
        );

      case 'relationship':
        return (
          <View className="border border-border rounded-lg bg-card">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue: Relationship | '') => setValue(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select relationship" value="" />
              <Picker.Item label="Child" value="child" />
              <Picker.Item label="Father" value="father" />
              <Picker.Item label="Mother" value="mother" />
              <Picker.Item label="Nanny" value="nanny" />
              <Picker.Item label="Grandparent" value="grandparent" />
            </Picker>
          </View>
        );

      case 'number':
        return (
          <TextInput
            className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            autoFocus
          />
        );

      case 'date':
        return (
          <TextInput
            className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
            value={value}
            onChangeText={setValue}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
            autoFocus
          />
        );

      case 'gender':
        return (
          <View className="border border-border rounded-lg bg-card">
            <Picker
              selectedValue={value}
              onValueChange={(itemValue: ChildGender | '') => setValue(itemValue)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Boy" value="boy" />
              <Picker.Item label="Girl" value="girl" />
            </Picker>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-background">
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-foreground">Edit {label}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-muted-foreground text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="text-base font-semibold text-foreground mb-3">
              {label}
            </Text>
            {renderInput()}
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 p-4 rounded-lg bg-muted"
              onPress={handleClose}
            >
              <Text className="text-muted-foreground font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 p-4 rounded-lg bg-primary"
              onPress={handleSave}
            >
              <Text className="text-primary-foreground font-semibold text-center">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}