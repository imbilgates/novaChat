import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import useFetchGroupChats from '../../hooks/useFetchFriendGroup';
import GroupChatScreen from '../../components/chats/GroupChatScreen';

const screenWidth = Dimensions.get('window').width;

// Header Left Component
const GroupHeaderLeft = ({ group }) => (
  <View style={styles.leftWrapper}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#222" />
    </TouchableOpacity>
    <View style={styles.groupInfo}>
      {group.img ? (
        <Avatar
          rounded
          source={{ uri: group.img }}
          size="small"
          containerStyle={{ backgroundColor: "black" }}
        />
      ) : (
        <Avatar
          rounded
          title={group.name?.charAt(0) || "G"}
          size="small"
          containerStyle={{ backgroundColor: "black" }}
        />
      )}

      <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
    </View>
  </View>
);

const GroupChat = () => {
  const { id } = useLocalSearchParams();

  const { groupChats, loading } = useFetchGroupChats();

  const group = groupChats.find((chat) => chat.groupId === id);


  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading group chat...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.centered}>
        <Text>Group not found or you are not a member.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: { backgroundColor: '#f9f9f9' },
          headerLeft: () => <GroupHeaderLeft group={group} />,
        }}
      />
      <GroupChatScreen group={group} isGroup />
    </>
  );
};

export default GroupChat;

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
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginLeft: 10,
    maxWidth: screenWidth * 0.4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
