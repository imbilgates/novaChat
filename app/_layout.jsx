import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { UserProvider } from '../src/context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChatProvider } from '../src/context/ChatContext';

import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'


export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
        <UserProvider>
          <ChatProvider>
            <GestureHandlerRootView style={styles.container}>
              <LayoutWithRedirect />
            </GestureHandlerRootView>
          </ChatProvider>
        </UserProvider>
    </ClerkProvider>
  );
}

function LayoutWithRedirect() {


  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="chat" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
