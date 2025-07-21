import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";
import useUsersLog from "../hooks/useUsersLog";
import { useFireUser } from "../context/UserContext";
import { addChatToUserPage } from "../utils/addChatToUserPage";
import useFetchFriends from "../hooks/useFetchFriends";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";

const SearchUsers = () => {
  const { users } = useUsersLog();
  const { fireUser: currentUser } = useFireUser();
  const { userPageData, loading } = useFetchFriends();

  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    setFilteredList([]);
  }, [users]);
  const inputRef = useRef(null);

  // 🔁 Focus the input every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // slight delay ensures focus after transition
      return () => clearTimeout(timeout);
    }, [])
  );

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
    <ListItem bottomDivider containerStyle={styles.listItem}>
      <Avatar rounded size="medium" source={{ uri: item.photoURL }} />
      <ListItem.Content>
        <ListItem.Title style={styles.username}>
          {item.displayName}
        </ListItem.Title>
        {/* Optional: Show email or status */}
        {/* <ListItem.Subtitle>{item.email}</ListItem.Subtitle> */}
      </ListItem.Content>
      <TouchableOpacity
        onPress={() =>
          isFriend ? handleRemoveUser(item) : handleUserSelect(item)
        }
        style={styles.iconButton}
      >
        <Ionicons
          name={isFriend ? "person-remove" : "person-add"}
          size={22}
          color={isFriend ? "#E74C3C" : "#2ECC71"}
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
        ref={inputRef}
      />

      {search.length > 0 && filteredList.length === 0 ? (
        <Text style={styles.noResults}>No users found</Text>
      ) : (
        <FlatList
          style={styles.searchList}
          data={filteredList}
          keyExtractor={(item) => item.uid}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fdfdfd",
    marginVertical: 4,
    marginHorizontal: 6,
    elevation: 1,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 40,
  },
});

