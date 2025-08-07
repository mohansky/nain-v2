import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { ChildGender } from '@/types';
import { Picker } from '@react-native-picker/picker';
import { Session } from '@supabase/supabase-js';

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  session: Session;
}

export default function AddChildModal({ visible, onClose, onSuccess, session }: AddChildModalProps) {
  const [childName, setChildName] = useState('');
  const [childDOB, setChildDOB] = useState('');
  const [childGender, setChildGender] = useState<ChildGender | ''>('');
  const [addingChild, setAddingChild] = useState(false);

  const handleClose = () => {
    setChildName('');
    setChildDOB('');
    setChildGender('');
    onClose();
  };

  async function handleAddChild() {
    if (!childName.trim() || !childDOB.trim() || !childGender) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setAddingChild(true);

      const { data: childData, error: childError } = await supabase
        .from('child_profiles')
        .insert({
          name: childName.trim(),
          date_of_birth: childDOB,
          gender: childGender,
        })
        .select()
        .single();

      if (childError) throw childError;

      const { error: relationError } = await supabase
        .from('user_children')
        .insert({
          user_id: session?.user?.id,
          child_id: childData.id,
          is_primary_caregiver: true,
          relationship: 'parent',
          can_edit: true,
          can_view: true,
          added_by: session?.user?.id,
        });

      if (relationError) throw relationError;

      Alert.alert('Success', 'Child added successfully!');
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error adding child:', error);
      Alert.alert('Error', 'Failed to add child');
    } finally {
      setAddingChild(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-background">
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-foreground">Add Child</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-muted-foreground text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-foreground mb-2">
              Child's Name <Text className="text-destructive">*</Text>
            </Text>
            <TextInput
              className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
              value={childName}
              onChangeText={setChildName}
              placeholder="Enter child's name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-foreground mb-2">
              Gender <Text className="text-destructive">*</Text>
            </Text>
            <View className="border border-border rounded-lg bg-card">
              <Picker
                selectedValue={childGender}
                onValueChange={(itemValue: ChildGender | '') => setChildGender(itemValue)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Select gender" value="" />
                <Picker.Item label="Boy" value="boy" />
                <Picker.Item label="Girl" value="girl" />
              </Picker>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-base font-semibold text-foreground mb-2">
              Date of Birth <Text className="text-destructive">*</Text>
            </Text>
            <TextInput
              className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
              value={childDOB}
              onChangeText={setChildDOB}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9CA3AF"
            />
            <Text className="text-xs text-muted-foreground mt-1">
              Please enter date in YYYY-MM-DD format (e.g., 2023-06-15)
            </Text>
          </View>

          <TouchableOpacity
            className={`p-4 rounded-lg ${addingChild ? 'bg-muted' : 'bg-primary'}`}
            onPress={handleAddChild}
            disabled={addingChild}
          >
            <Text className={`font-semibold text-center text-lg ${addingChild ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
              {addingChild ? 'Adding Child...' : 'Add Child'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}