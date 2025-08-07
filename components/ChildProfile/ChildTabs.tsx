import React from 'react'
import { ScrollView, TouchableOpacity, Text } from 'react-native'
import { ChildWithRelationship } from '@/types'

interface ChildTabsProps {
  children: ChildWithRelationship[]
  selectedChildIndex: number
  onSelectChild: (index: number) => void
}

const ChildTabs: React.FC<ChildTabsProps> = ({ children, selectedChildIndex, onSelectChild }) => {
  if (children.length <= 1) return null

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="bg-card border-b border-border"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
    >
      {children.map((child, index) => (
        <TouchableOpacity
          key={child.id}
          onPress={() => onSelectChild(index)}
          className={`mr-4 px-4 py-2 rounded-full ${
            selectedChildIndex === index 
              ? 'bg-primary' 
              : 'bg-muted'
          }`}
        >
          <Text className={`text-left font-semibold ${
            selectedChildIndex === index 
              ? 'text-primary-foreground' 
              : 'text-muted-foreground'
          }`}>
            {child.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default ChildTabs