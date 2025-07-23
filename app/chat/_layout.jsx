import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

const GroupLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "CHAT",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerTintColor: '#222',
        }}
      />
      <Stack.Screen
        name="info"
        options={{
          title: "USER-INFO",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerTintColor: '#222',
        }}
      />
    </Stack>
  );
};

export default GroupLayout;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f9f9f9',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});
