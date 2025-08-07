// components/ChildProfile/LatestMeasurements.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChildMeasurement } from "@/types";
import MeasurementCard from "./MeasurementCard";
import Button from "../ui/Button";

interface LatestMeasurementsProps {
  measurements: ChildMeasurement | null;
  onAddMeasurement: () => void;
}

const LatestMeasurements: React.FC<LatestMeasurementsProps> = ({
  measurements,
  onAddMeasurement,
}) => {
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const measurementDate = new Date(dateString);
    const diffInMs = now.getTime() - measurementDate.getTime();
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    
    if (diffInHours < 24) {
      return diffInHours <= 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    } else {
      return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
    }
  };
  return (
    <View>
      {measurements ? (
        <View>
          <View className="flex flex-row justify-between gap-4 mb-4">
            {measurements.head_circumference_cm && (
              <MeasurementCard
                value={measurements.head_circumference_cm}
                unit="cm"
                label="Head Circumference"
                bgColor="bg-[#4F378A]"
                textColor="text-background"
              />
            )}

            {measurements.weight_kg && (
              <MeasurementCard
                value={measurements.weight_kg}
                unit="kg"
                label="Weight"
                bgColor="bg-[#4F378A]"
                textColor="text-background"
              />
            )}
          </View>
          {measurements.height_cm && (
            <MeasurementCard
              value={measurements.height_cm}
              unit="cm"
              label="Height"
              bgColor="bg-[#8A5EF4]"
              textColor="text-background"
            />
          )}

          {measurements.notes && (
            <View className="bg-muted p-3 rounded-lg">
              <Text className="text-sm text-muted-foreground font-semibold mb-1">
                Notes:
              </Text>
              <Text className="text-sm text-foreground">
                {measurements.notes}
              </Text>
            </View>
          )}

          <View className="p-3 flex flex-row justify-between items-center">
            <Text className="text-sm text-destructive my-4">
              Last updated:{" "}
              {getRelativeTime(measurements.measured_at)}
            </Text>
            <Button variant="outline" size="sm">
              Update stats
            </Button>
          </View>
        </View>
      ) : (
        <View className="text-center py-8">
          <Text className="text-muted-foreground text-center">
            No measurements recorded yet
          </Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-lg mt-4"
            onPress={onAddMeasurement}
          >
            <Text className="text-primary-foreground font-semibold">
              Add First Measurement
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LatestMeasurements;
