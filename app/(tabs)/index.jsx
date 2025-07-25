import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CurrentUserChatList from '../../src/components/chats/CurrentUserChatList';
import GroupChatList from '../../src/components/chats/GroupChatList';
import { useState } from 'react';
import ChatToggleTabs from '../../src/components/chats/ChatToggleTabs';
import useSaveUserLog from '../../src/hooks/useSaveUserLog';


const Index = () => {
  useSaveUserLog()
  const statusBarHeight = Platform.OS === 'android' ? RNStatusBar.currentHeight ?? 24 : 0;
  const [activeTab, setActiveTab] = useState('chats');

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ChatToggleTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'chats' ? <CurrentUserChatList /> : <GroupChatList />}
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
