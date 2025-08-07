
// 4. SessionSummary.tsx - Display session details
import React from 'react';
import { View, Text } from 'react-native'; 
import { BreastfeedingSession } from '@/types';

interface SessionSummaryProps {
  session: BreastfeedingSession;
}
const SessionSummary: React.FC<SessionSummaryProps> = ({ session }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number, seconds: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m ${seconds}s`;
    }
    if (remainingMinutes > 0) {
      return `${remainingMinutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatDurationFromTotal = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <View className="bg-white rounded-lg p-4 m-2 shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800">
          {formatDate(session.start_time)}
        </Text>
        <View className={`px-3 py-1 rounded-full ${
          session.side === 'left' ? 'bg-pink-100' : 'bg-blue-100'
        }`}>
          <Text className={`text-sm font-medium capitalize ${
            session.side === 'left' ? 'text-pink-600' : 'text-blue-600'
          }`}>
            {session.side}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-sm text-gray-600">Duration</Text>
          <Text className="text-lg font-semibold text-gray-800">
            {session.total_duration_seconds 
              ? formatDurationFromTotal(session.total_duration_seconds)
              : session.duration_minutes && session.duration_seconds !== undefined
              ? formatDuration(session.duration_minutes, session.duration_seconds)
              : formatDuration(session.duration_minutes || 0, 0)
            }
          </Text>
        </View>
        
        {session.notes && (
          <View className="flex-1 ml-4">
            <Text className="text-sm text-gray-600">Notes</Text>
            <Text className="text-sm text-gray-800" numberOfLines={2}>
              {session.notes}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SessionSummary;
