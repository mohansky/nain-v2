import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import { ChildWithRelationship } from '@/types'

interface AddMeasurementsModalProps {
  visible: boolean
  child: ChildWithRelationship | null
  onClose: () => void
  onSuccess: () => void
}

const AddMeasurementsModal: React.FC<AddMeasurementsModalProps> = ({
  visible,
  child,
  onClose,
  onSuccess
}) => {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [headCircumference, setHeadCircumference] = useState('')
  const [notes, setNotes] = useState('')
  const [adding, setAdding] = useState(false)

  const handleClose = () => {
    setHeight('')
    setWeight('')
    setHeadCircumference('')
    setNotes('')
    onClose()
  }

  const handleAdd = async () => {
    if (!height.trim() && !weight.trim() && !headCircumference.trim()) {
      Alert.alert('Error', 'Please enter at least one measurement')
      return
    }

    if (!child) return

    try {
      setAdding(true)

      const measurementData: any = {
        child_id: child.id,
        measured_at: new Date()
      }

      if (height.trim()) measurementData.height_cm = parseFloat(height)
      if (weight.trim()) measurementData.weight_kg = parseFloat(weight)
      if (headCircumference.trim()) measurementData.head_circumference_cm = parseFloat(headCircumference)
      if (notes.trim()) measurementData.notes = notes.trim()

      const { error } = await supabase
        .from('child_measurements')
        .insert(measurementData)

      if (error) throw error

      Alert.alert('Success', 'Measurement added successfully!')
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('Error adding measurement:', error)
      Alert.alert('Error', 'Failed to add measurement')
    } finally {
      setAdding(false)
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
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-foreground">Add Measurements</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-muted-foreground text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-5">
              <Text className="text-base font-semibold text-foreground mb-2">
                Height (cm)
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
                value={height}
                onChangeText={setHeight}
                placeholder="Enter height in centimeters"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mb-5">
              <Text className="text-base font-semibold text-foreground mb-2">
                Weight (kg)
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight in kilograms"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mb-5">
              <Text className="text-base font-semibold text-foreground mb-2">
                Head Circumference (cm)
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground"
                value={headCircumference}
                onChangeText={setHeadCircumference}
                placeholder="Enter head circumference in centimeters"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>

            <View className="mb-8">
              <Text className="text-base font-semibold text-foreground mb-2">
                Notes (Optional)
              </Text>
              <TextInput
                className="border border-border rounded-lg p-3 text-base bg-card text-foreground h-20"
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes about the measurements..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
              />
            </View>

            <Text className="text-sm text-muted-foreground mb-4 text-center">
              Enter at least one measurement to save
            </Text>

            <TouchableOpacity
              className={`p-4 rounded-lg ${adding ? 'bg-muted' : 'bg-primary'}`}
              onPress={handleAdd}
              disabled={adding}
            >
              <Text className={`font-semibold text-center text-lg ${adding ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
                {adding ? 'Adding...' : 'Add Measurements'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

export default AddMeasurementsModal