import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="SignIn" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="SignUp" 
        options={{ 
          title: 'Create Account',
          headerBackTitle: 'Sign In'
        }} 
      />
    </Stack>
  );
}