import { useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useFireUser } from "../context/UserContext";
import useFetchFriends from "../hooks/useFetchFriends";
import { router } from "expo-router";
import Modal from "react-native-modal";
import SkeletonLoader from "./skeletons/SkeletonLoader";
import { convertTimestamp } from "../utils/convertTimestamp";
import ProfileImageWithPreview from "../components/ProfileImageWithPreview";

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
      {item.img ? (
        <ProfileImageWithPreview uri={item.img} name={item.name} />

      ) : (
        <Avatar
          rounded
          title={item.name?.charAt(0).toUpperCase() || "U"}
          size="medium"
          containerStyle={{ backgroundColor: "#000" }}
        />
      )}

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.time}>
            {convertTimestamp(item.time)}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.text || "Start the conversation..."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <SkeletonLoader />;
  if (error)
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
      </View>
    );

  if (chatList.length === 0)
    return (
      <View style={styles.centered}>
        <Text>No chats available.</Text>
      </View>
    );

  return (
    <>
      <FlatList
        data={chatList.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal isVisible={modalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Remove Chat</Text>
          <Text style={styles.modalSubtitle}>
            Do you want to remove{" "}
            <Text style={{ fontWeight: "bold" }}>{selectedUser?.name}</Text>?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleRemoveUser}
            >
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
  chatContent: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
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
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
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
