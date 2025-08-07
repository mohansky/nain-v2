import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { ChildWithRelationship, ChildGender } from '@/types'
import { Picker } from '@react-native-picker/picker'

interface EditProfileModalProps {
  visible: boolean
  child: ChildWithRelationship | null
  onClose: () => void
  onSuccess: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  child,
  onClose,
  onSuccess
}) => {
  const [editName, setEditName] = useState('')
  const [editDOB, setEditDOB] = useState('')
  const [editGender, setEditGender] = useState<ChildGender | ''>('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (child && visible) {
      setEditName(child.name)
      setEditDOB(child.date_of_birth)
      setEditGender(child.gender || '')
    }
  }, [child, visible])

  const handleClose = () => {
    setEditName('')
    setEditDOB('')
    setEditGender('')
    onClose()
  }

  const handleUpdate = async () => {
    if (!editName.trim() || !editDOB.trim() || !editGender) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    if (!child) return

    try {
      setUpdating(true)

      const { error } = await supabase
        .from('child_profiles')
        .update({
          name: editName.trim(),
          date_of_birth: editDOB,
          gender: editGender,
          updated_at: new Date()
        })
        .eq('id', child.id)

      if (error) throw error

      Alert.alert('Success', 'Profile updated successfully!')
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setUpdating(false)
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
            <Text className="text-xl font-bold text-foreground">Edit Profile</Text>
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
              value={editName}
              onChangeText={setEditName}
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
                selectedValue={editGender}
                onValueChange={(itemValue: ChildGender | '') => setEditGender(itemValue)}
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
              value={editDOB}
              onChangeText={setEditDOB}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9CA3AF"
            />
            <Text className="text-xs text-muted-foreground mt-1">
              Please enter date in YYYY-MM-DD format (e.g., 2023-06-15)
            </Text>
          </View>

          <TouchableOpacity
            className={`p-4 rounded-lg ${updating ? 'bg-muted' : 'bg-primary'}`}
            onPress={handleUpdate}
            disabled={updating}
          >
            <Text className={`font-semibold text-center text-lg ${updating ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
              {updating ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default EditProfileModal