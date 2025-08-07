// components/ChildProfile/MeasurementCard.tsx
import React from "react";
import { View, Text } from "react-native";

interface MeasurementCardProps {
  value: number;
  unit: string;
  label: string;
  bgColor: string;
  textColor: string;
  flexStyle?: string;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({
  value,
  unit,
  label,
  bgColor,
  textColor,
  flexStyle = "flex-1",
}) => {
  return (
    <View className={`${flexStyle} ${bgColor} px-4 py-6 rounded-xl`}>
      <View className="flex flex-row items-baseline gap-2">
        <Text className={`text-4xl font-bold ${textColor}`}>
          {value}
        </Text>
        <Text className={`text-sm ${textColor}`}>{unit}</Text>
      </View>
      <Text className={`text-sm mt-4 font-bold ${textColor}`}>
        {label}
      </Text>
    </View>
  );
};

export default MeasurementCard;