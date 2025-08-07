// 3. SideSelector.tsx - Left/Right breast selection
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native'; 
import { BreastSide } from '@/types';

interface SideSelectorProps {
  selectedSide: BreastSide;
  onSideChange: (side: BreastSide) => void;
  disabled?: boolean;
}

const SideSelector: React.FC<SideSelectorProps> = ({ 
  selectedSide, 
  onSideChange, 
  disabled = false 
}) => {
  return (
    <View className="flex flex-row gap-10 items-center justify-center mb-6">
      <TouchableOpacity
        className={`p-5 rounded-full border-2 ${
          selectedSide === 'left'
            ? 'bg-pink-500 border-pink-500'
            : 'bg-gray-100 border-gray-300'
        } ${disabled ? 'opacity-50' : ''}`}
        onPress={() => !disabled && onSideChange('left')}
        disabled={disabled}
      >
        <Text
          className={`text-center font-semibold ${
            selectedSide === 'left' ? 'text-white' : 'text-gray-700'
          }`}
        >
          Left
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className={`p-5 rounded-full border-2 ${
          selectedSide === 'right'
            ? 'bg-pink-500 border-pink-500'
            : 'bg-gray-100 border-gray-300'
        } ${disabled ? 'opacity-50' : ''}`}
        onPress={() => !disabled && onSideChange('right')}
        disabled={disabled}
      >
        <Text
          className={`text-center font-semibold ${
            selectedSide === 'right' ? 'text-white' : 'text-gray-700'
          }`}
        >
          Right
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SideSelector;