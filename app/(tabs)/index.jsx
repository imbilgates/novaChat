import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CurrentUserChatList from '../../components/CurrentUserChatList';

export default function Homepage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="black" backgroundColor="black" />
      <View style={styles.container}>
        <CurrentUserChatList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
