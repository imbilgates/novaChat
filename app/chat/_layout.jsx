import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false, // removes bottom border
          headerTintColor: '#222',    // color for back icon
        }}
      />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f9f9f9',
    elevation: 0, // for Android
    shadowOpacity: 0, // for iOS
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});
