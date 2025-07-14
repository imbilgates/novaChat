import { SafeAreaView, StyleSheet, View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CurrentUserChatList from '../../components/CurrentUserChatList';

const Index = () => {
  const statusBarHeight = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <CurrentUserChatList />
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
