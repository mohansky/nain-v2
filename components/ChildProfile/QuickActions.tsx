import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

interface QuickActionsProps {
  onAddMeasurement: () => void
  onEditProfile: () => void
  onViewGrowthChart?: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onAddMeasurement, 
  onEditProfile, 
  onViewGrowthChart 
}) => {
  return (
    <View className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <Text className="text-xl font-bold text-foreground mb-4">
        Quick Actions
      </Text>
      
      <View className="flex-row flex-wrap">
        <TouchableOpacity 
          className="bg-primary px-4 py-3 rounded-lg mr-3 mb-3"
          onPress={onAddMeasurement}
        >
          <Text className="text-primary-foreground font-semibold">Add Measurement</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-secondary px-4 py-3 rounded-lg mr-3 mb-3"
          onPress={onViewGrowthChart}
        >
          <Text className="text-secondary-foreground font-semibold">View Growth Chart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-accent px-4 py-3 rounded-lg mr-3 mb-3"
          onPress={onEditProfile}
        >
          <Text className="text-accent-foreground font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default QuickActions