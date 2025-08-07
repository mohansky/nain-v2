import { View, Text } from "react-native";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";

interface ActionButtonsProps {
  loading: boolean;
  onUpdateProfile: () => void;
}

export default function ActionButtons({ 
  loading, 
  onUpdateProfile 
}: ActionButtonsProps) {
  return (
    <View className="p-6">

      <View className="flex flex-row gap-4 mb-2">
        {/* <Button
          className="flex-1"
          variant="primary"
          loading={loading}
          onPress={onUpdateProfile}
          disabled={loading}
          size="lg"
        >
          Update
        </Button> */}

        {/* <Button
          className="flex-1"
          variant="destructive"
          onPress={() => supabase.auth.signOut()}
          disabled={loading}
          size="lg"
        >
          Sign Out
        </Button> */}
      </View>

      <Text className="text-xs text-muted-foreground text-center mt-2">
        Fields marked with * are required. All other fields are optional.
      </Text>
    </View>
    
  );
}