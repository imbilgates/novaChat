import { useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useFireUser } from "../context/UserContext";
import useFetchFriends from "../hooks/useFetchFriends";
import { router } from "expo-router";
import Modal from "react-native-modal";

const UsersChatList = () => {
  const { fireUser: currentUser } = useFireUser();
  const { userPageData: chatList, loading, error } = useFetchFriends();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const handleRemoveUser = async () => {
    try {
      const updatedChats = chatList.filter(
        (chat) => chat.id !== selectedUser.id
      );
      const chatRef = doc(db, "userPage", currentUser.uid);
      await updateDoc(chatRef, { chats: updatedChats });
      closeModal();
    } catch (error) {
      console.error("Failed to remove chat:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
      onLongPress={() => openDeleteModal(item)}
    >
      <Avatar rounded source={{ uri: item.img }} containerStyle={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.time}>
            {item.time?.seconds
              ? new Date(item.time.seconds * 1000).toLocaleTimeString()
              : item.time || ""}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
    <>
      <FlatList
        data={chatList.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Remove Chat</Text>
          <Text style={styles.modalSubtitle}>
            Do you want to remove{" "}
            <Text style={{ fontWeight: "bold" }}>{selectedUser?.name}</Text> from your chat list?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleRemoveUser}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UsersChatList;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    backgroundColor: "#fff",
  },
  avatar: {
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "gray",
    marginLeft: 8,
  },
  lastMessage: {
    color: "gray",
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#6B7280",
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
