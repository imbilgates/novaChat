import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import useUsersLog from "../hooks/useUsersLog";
import { useFireUser } from "../context/UserContext";
import { addChatToUserPage } from "../utils/addChatToUserPage";
import useFetchFriends from "../hooks/useFetchFriends"; // 👈 added
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

const SearchUsers = () => {
  const { users } = useUsersLog();
  const { fireUser: currentUser } = useFireUser();
  const { userPageData, loading } = useFetchFriends(); // 👈 use existing friends list

  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    setFilteredList([]);
  }, [users]);

  const filterList = (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredList([]);
      return;
    }

    const filtered = users.filter((user) =>
      user.displayName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleUserSelect = async (selectedUser) => {
    try {
      if (currentUser.uid === selectedUser.uid) return;
      await addChatToUserPage(currentUser, selectedUser);
      router.push(`/chat/${selectedUser.uid}`);
    } catch (error) {
      Alert.alert("Error", "Could not start chat.");
      console.error("Failed to add chat:", error);
    }
  };

  const handleRemoveUser = async (selectedUser) => {
    try {
      const updatedChats = userPageData.filter(
        (chat) => chat.id !== selectedUser.uid
      );

      const chatRef = doc(db, "userPage", currentUser.uid);
      await updateDoc(chatRef, { chats: updatedChats });
    } catch (error) {
      Alert.alert("Error", "Could not remove user.");
      console.error("Failed to remove chat:", error);
    }
  };

  const renderItem = ({ item }) => {
    const isFriend = userPageData?.some((chat) => chat.id === item.uid);

    return (
      <ListItem containerStyle={styles.listItem}>
        <Avatar rounded source={{ uri: item.photoURL }} />
        <ListItem.Content>
          <ListItem.Title style={styles.username}>
            {item.displayName}
          </ListItem.Title>
        </ListItem.Content>

        <TouchableOpacity
          onPress={() =>
            isFriend ? handleRemoveUser(item) : handleUserSelect(item)
          }
        >
          <Ionicons
            name={isFriend ? "person-remove" : "person-add"}
            size={24}
            color={isFriend ? "red" : "black"}
          />
        </TouchableOpacity>
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Users"
        placeholderTextColor="#000"
        value={search}
        onChangeText={filterList}
      />

      {search.length > 0 && filteredList.length === 0 ? (
        <Text style={styles.noResults}>No users found</Text>
      ) : (
        <FlatList
          style={styles.searchList}
          data={filteredList}
          keyExtractor={(item) => item.uid.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default SearchUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 20,
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  searchList: {
    marginHorizontal: 10,
  },
  listItem: {
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 40,
  },
});
