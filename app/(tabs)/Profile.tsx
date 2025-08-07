// app/(tabs)/Profile.tsx
import { Platform, View } from "react-native";
import { Button, Text } from "@rneui/themed";
import { supabase } from "@/lib/supabase";
import Account from "@/components/Account";
import { useAuth } from "@/lib/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from 'react-native';

export default function ProfileScreen() {
  const { session, loading } = useAuth();

  // console.log('HomePage - loading:', loading, 'session:', !!session, 'user:', session?.user?.email);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {session ? (
        <Account session={session} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No session found - user might not be logged in</Text>
        </View>
      )}
       </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
