import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import Modal from "react-native-modal";
import { useRouter } from "expo-router"; // ✅ router import
import useFetchGroupChats from "../../hooks/useFetchFriendGroup";

import SkeletonLoader from "../skeletons/SkeletonLoader";
import { db } from "../../config/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import { convertTimestamp } from "../../utils/convertTimestamp";

const GroupChatList = () => {
  const router = useRouter(); // ✅ initialize router
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { groupChats, loading } = useFetchGroupChats();

  const handleGroupClick = (item) => {
    router.push(`/group/${item.groupId}`); // ✅ navigate to group chat
  };

  const openDeleteModal = (group) => {
    setSelectedGroup(group);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedGroup(null);
  };

  const handleRemoveGroup = async (id) => {
    const chatRef = doc(db, "groupChats", id);

    try {
      await deleteDoc(chatRef);
    } catch (error) {
      console.error("Error removing chat:", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleGroupClick(item)}
        onLongPress={() => openDeleteModal(item)}
      >
        {item.img ? (
          <Avatar
            rounded
            source={{ uri: item.img }}
            size="medium"
            containerStyle={{ backgroundColor: "#000" }}
            title={item.name?.charAt(0).toUpperCase() || "G"}
            renderPlaceholderContent={
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {item.name?.charAt(0).toUpperCase() || "G"}
              </Text>
            }
          />
        ) : (
          <Avatar
            rounded
            title={item.name?.charAt(0).toUpperCase() || "G"}
            size="medium"
            containerStyle={{ backgroundColor: "#000" }}
          />
        )}

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.username}>{item.name || "Unnamed Group"}</Text>
            <Text style={styles.time}>
              {convertTimestamp(item?.updatedAt) || "N/A"}
            </Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.text || "Start the conversation..."}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (groupChats.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No groups available. Create one to start chatting.</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={groupChats.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal isVisible={modalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Remove Group</Text>
          <Text style={styles.modalSubtitle}>
            Are you sure you want to remove{" "}
            <Text style={{ fontWeight: "bold" }}>{selectedGroup?.name}</Text>?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                handleRemoveGroup(selectedGroup?.id);
                closeModal();
              }}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GroupChatList;

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
