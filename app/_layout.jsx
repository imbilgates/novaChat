import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { UserProvider } from '../context/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChatProvider } from '../context/ChatContext';

import { store } from '../store/store'
import { Provider } from 'react-redux'



export default function RootLayout() {
  return (
    <Provider store={store}>
      <UserProvider>
        <ChatProvider>
          <GestureHandlerRootView style={styles.container}>
                <LayoutWithRedirect />
          </GestureHandlerRootView>
        </ChatProvider>
      </UserProvider>
    </Provider>
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
