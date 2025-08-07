// 2. Timer.tsx - Session duration tracker
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface TimerProps {
  isActive: boolean;
  startTime: string | null;
}

const Timer: React.FC<TimerProps> = ({ isActive, startTime }) => {
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        const elapsedMs = now.getTime() - start.getTime();
        setElapsed(Math.floor(elapsedMs / 1000));
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="items-center py-6">
      <Text className="text-sm text-gray-600 mb-2">Duration</Text>
      <Text className="text-4xl font-mono font-bold text-blue-600">
        {formatTime(elapsed)}
      </Text>
    </View>
  );
};

export default Timer;