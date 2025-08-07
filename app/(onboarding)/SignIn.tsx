import React, { useState } from 'react';
import { Alert, View, AppState, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

// Auto-refresh setup
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
   
    if (error) {
      Alert.alert('Sign In Error', error.message);
    }
    // No need to manually redirect - the auth listener will handle it
    setLoading(false);
  }

  return (
    <View className="flex-1 p-5 justify-center">
      <View className="items-center mb-10">
        <Text className="text-3xl font-bold mb-3 text-gray-800">Welcome Back</Text>
        <Text className="text-gray-600 text-base">Sign in to your account</Text>
      </View>

      <View className="py-1 mt-5">
        <Text className="text-base font-medium text-gray-700 mb-2">Email</Text>
        <View className="relative">
          <View className="absolute left-3 top-4 z-10">
            <Ionicons name="mail-outline" size={20} color="#666" />
          </View>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-4 text-base"
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>
     
      <View className="py-1">
        <Text className="text-base font-medium text-gray-700 mb-2">Password</Text>
        <View className="relative">
          <View className="absolute left-3 top-4 z-10">
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
          </View>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg pl-12 pr-12 py-4 text-base"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
            placeholder="Password"
            autoCapitalize="none"
          />
          <TouchableOpacity
            className="absolute right-3 top-4 z-10"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
      </View>
     
      <View className="py-1 mt-5">
        <TouchableOpacity
          className={`bg-blue-500 rounded-lg py-4 items-center justify-center ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
     
      <View className="py-1">
        <TouchableOpacity
          className="py-4 items-center"
          onPress={() => router.push('/(onboarding)/SignUp')}
        >
          <Text className="text-blue-500 text-base font-medium">Need an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// import React, { useState } from 'react';
// import { Alert, StyleSheet, View, AppState } from 'react-native';
// import { useRouter } from 'expo-router';
// import { supabase } from '@/lib/supabase';
// import { Button, Input, Text } from '@rneui/themed';

// // Auto-refresh setup
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });

// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   async function signInWithEmail() {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({
//       email: email,
//       password: password,
//     });
    
//     if (error) {
//       Alert.alert('Sign In Error', error.message);
//     }
//     // No need to manually redirect - the auth listener will handle it
//     setLoading(false);
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text h3 style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Sign in to your account</Text>
//       </View>

//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Input
//           label="Email"
//           leftIcon={{ type: 'font-awesome', name: 'envelope' }}
//           onChangeText={(text) => setEmail(text)}
//           value={email}
//           placeholder="email@address.com"
//           autoCapitalize={'none'}
//           keyboardType="email-address"
//         />
//       </View>
      
//       <View style={styles.verticallySpaced}>
//         <Input
//           label="Password"
//           leftIcon={{ type: 'font-awesome', name: 'lock' }}
//           onChangeText={(text) => setPassword(text)}
//           value={password}
//           secureTextEntry={true}
//           placeholder="Password"
//           autoCapitalize={'none'}
//         />
//       </View>
      
//       <View style={[styles.verticallySpaced, styles.mt20]}>
//         <Button 
//           title="Sign In" 
//           disabled={loading} 
//           onPress={() => signInWithEmail()}
//           loading={loading}
//         />
//       </View>
      
//       <View style={styles.verticallySpaced}>
//         <Button 
//           title="Need an account? Sign Up" 
//           type="clear"
//           onPress={() => router.push('/(onboarding)/SignUp')}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   title: {
//     marginBottom: 10,
//   },
//   subtitle: {
//     color: '#666',
//     fontSize: 16,
//   },
//   verticallySpaced: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     alignSelf: 'stretch',
//   },
//   mt20: {
//     marginTop: 20,
//   },
// });