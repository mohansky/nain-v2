import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { ChildWithRelationship, MemoryWithDetails } from '@/types'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

interface AddMemoryModalProps {
  visible: boolean
  children: ChildWithRelationship[]
  onClose: () => void
  onSuccess: () => void
  editMemory?: MemoryWithDetails
}

const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  visible,
  children,
  onClose,
  onSuccess,
  editMemory,
}) => {
  const { session } = useAuth()
  const [selectedChildId, setSelectedChildId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Auto-select child if there's only one
  React.useEffect(() => {
    if (children.length === 1 && !selectedChildId && !editMemory) {
      setSelectedChildId(children[0].id)
    }
  }, [children, selectedChildId, editMemory])

  // Populate form when editing
  React.useEffect(() => {
    if (editMemory) {
      setSelectedChildId(editMemory.child_id)
      setTitle(editMemory.title)
      setDescription(editMemory.description || '')
      setMemoryDate(editMemory.memory_date.split('T')[0])
      setSelectedImages(editMemory.images || [])
    }
  }, [editMemory])

  const handleClose = () => {
    setSelectedChildId('')
    setTitle('')
    setDescription('')
    setMemoryDate(new Date().toISOString().split('T')[0])
    setSelectedImages([])
    onClose()
  }

  const pickImages = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.')
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: false,
      })

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri)
        setSelectedImages(prev => [...prev, ...newImages])
      }
    } catch (error) {
      console.error('Error picking images:', error)
      Alert.alert('Error', 'Failed to pick images')
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri)
      if (!fileInfo.exists) {
        throw new Error('File does not exist')
      }

      // Create a unique filename
      const fileName = `memory_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
      const filePath = `memories/${session?.user?.id}/${fileName}`

      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('memory-images')
        .upload(filePath, decode(base64), {
          contentType: 'image/jpeg',
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('memory-images')
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Helper function to decode base64
  const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  const handleSave = async () => {
    if (!selectedChildId) {
      Alert.alert('Error', 'Please select a child')
      return
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }

    try {
      setUploading(true)

      // Handle images - upload new ones and keep existing URLs
      let imageUrls: string[] = []
      if (selectedImages.length > 0) {
        imageUrls = await Promise.all(
          selectedImages.map(async (uri) => {
            // If it's already a URL (existing image), return as is
            if (uri.startsWith('http')) {
              return uri
            }
            // Otherwise, upload new image
            return uploadImage(uri)
          })
        )
      }

      if (editMemory) {
        // Update existing memory
        const { error } = await supabase
          .from('child_memories')
          .update({
            child_id: selectedChildId,
            title: title.trim(),
            description: description.trim() || null,
            images: imageUrls,
            memory_date: memoryDate + 'T12:00:00Z',
          })
          .eq('id', editMemory.id)

        if (error) throw error
        Alert.alert('Success', 'Memory updated successfully!')
      } else {
        // Create new memory
        const { error } = await supabase
          .from('child_memories')
          .insert({
            child_id: selectedChildId,
            created_by: session?.user?.id,
            title: title.trim(),
            description: description.trim() || null,
            images: imageUrls,
            memory_date: memoryDate + 'T12:00:00Z',
          })

        if (error) throw error
        Alert.alert('Success', 'Memory created successfully!')
      }

      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error saving memory:', error)
      Alert.alert('Error', `Failed to ${editMemory ? 'update' : 'create'} memory`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-foreground">
                {editMemory ? 'Edit Memory' : 'Add Memory'}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-muted-foreground text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Child Selection - Only show if multiple children */}
            {children.length > 1 && (
              <View className="mb-5">
                <Text className="text-base font-semibold text-foreground mb-2">
                  Select Child <Text className="text-destructive">*</Text>
                </Text>
                <View className="border border-border rounded-lg bg-card">
                  <Picker
                    selectedValue={selectedChildId}
                    onValueChange={(itemValue: string) => setSelectedChildId(itemValue)}
                    style={{ height: 50 }}
                  >
                    <Picker.Item label="Select a child" value="" />
                    {children.map((child) => (
                      <Picker.Item
                        key={child.id}
                        label={child.name}
                        value={child.id}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            {/* Title */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-foreground mb-2">
                Title <Text className="text-destructive">*</Text>
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
                value={title}
                onChangeText={setTitle}
                placeholder="What's this memory about?"
                placeholderTextColor="#9CA3AF"
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-foreground mb-2">
                Description
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground h-24"
                value={description}
                onChangeText={setDescription}
                placeholder="Tell the story behind this memory..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                maxLength={500}
              />
            </View>

            {/* Memory Date */}
            <View className="mb-5">
              <Text className="text-base font-semibold text-foreground mb-2">
                Memory Date
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
                value={memoryDate}
                onChangeText={setMemoryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
              <Text className="text-xs text-muted-foreground mt-1">
                When did this memory happen? (e.g., 2024-01-15)
              </Text>
            </View>

            {/* Images */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-foreground mb-2">
                Photos
              </Text>
              
              {/* Selected Images */}
              {selectedImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                  <View className="flex-row">
                    {selectedImages.map((uri, index) => (
                      <View key={index} className="relative mr-2">
                        <Image
                          source={{ uri }}
                          className="w-20 h-20 rounded-lg"
                        />
                        <TouchableOpacity
                          className="absolute -top-2 -right-2 bg-destructive rounded-full w-6 h-6 justify-center items-center"
                          onPress={() => removeImage(index)}
                        >
                          <Text className="text-destructive-foreground text-xs font-bold">×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}

              {/* Add Photos Button */}
              <TouchableOpacity
                className="border-2 border-dashed border-border rounded-lg p-4 items-center"
                onPress={pickImages}
              >
                <Text className="text-4xl mb-2">📸</Text>
                <Text className="text-muted-foreground text-center">
                  Tap to add photos
                </Text>
                <Text className="text-xs text-muted-foreground text-center mt-1">
                  You can select multiple photos
                </Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className={`p-4 rounded-lg ${
                uploading ? 'bg-muted' : 'bg-primary'
              }`}
              onPress={handleSave}
              disabled={uploading}
            >
              <Text
                className={`font-semibold text-center text-lg ${
                  uploading ? 'text-muted-foreground' : 'text-primary-foreground'
                }`}
              >
                {uploading 
                  ? `${editMemory ? 'Updating' : 'Creating'} Memory...` 
                  : `${editMemory ? 'Update' : 'Create'} Memory`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default AddMemoryModal