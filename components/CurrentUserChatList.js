import { router } from "expo-router";
import { FlatList, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import useFetchFriends from "../hooks/useFetchFriends";

const UsersChatList = () => {
  const { userPageData: chatList, loading, error } = useFetchFriends();

  const renderItem = ({ item, index }) => {
    const isLastItem = index === chatList.length - 1;

    return (
      <TouchableOpacity onPress={() => router.push(`/chat/${item.id}`)}>
        <ListItem
          bottomDivider={!isLastItem}
          containerStyle={isLastItem ? { borderBottomWidth: 0 } : null}
        >
          <Avatar rounded source={{ uri: item.img }} />
          <ListItem.Content>
            <ListItem.Title style={styles.username}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.lastMessage}>
              {item.text}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Text style={styles.time}>
            {item.time?.seconds
              ? new Date(item.time.seconds * 1000).toLocaleTimeString()
              : item.time || ""}
          </Text>
        </ListItem>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );
  }

  if (chatList.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No chats available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={chatList.slice().reverse()}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default UsersChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  username: {
    fontWeight: "bold",
  },
  lastMessage: {
    color: "gray",
  },
  time: {
    color: "gray",
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
