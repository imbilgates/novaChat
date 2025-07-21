import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import ChatScreen from '../../src/components/chats/ChatScreen';
import useUsersLog from '../../src/hooks/useUsersLog';

const screenWidth = Dimensions.get('window').width;

const Left = () => {
  const { id } = useLocalSearchParams();
  const { users } = useUsersLog();

  const clickedUser = users.find((user) => user.uid === id);

  return (
    <View style={styles.leftWrapper}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#222" />
      </TouchableOpacity>
      {clickedUser ? (
        <View style={styles.userInfo}>
          <Avatar rounded source={{ uri: clickedUser.photoURL }} size="small" />
          <Text style={styles.username} numberOfLines={1}>
            {clickedUser.displayName}
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const Right = () => {
  return (
    <View style={styles.rightContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <Feather name="video" size={22} color="#222" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="call-outline" size={22} color="#222" />
      </TouchableOpacity>
    </View>
  );
};

const Chat = () => {
  const { id } = useLocalSearchParams();
  const { users } = useUsersLog();
  const clickedUser = users.find((user) => user.uid === id);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: '#f9f9f9' },
          headerLeft: () => <Left />,
          headerRight: () => <Right />,
        }}
      />
      <ChatScreen clickedUser={clickedUser} />
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  leftWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    maxWidth: screenWidth * 0.6,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginLeft: 10,
    maxWidth: screenWidth * 0.4,
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginRight: 15,
  },
  iconButton: {
    padding: 6,
  },
});
