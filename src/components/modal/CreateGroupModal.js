import React, { useState, useContext } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useFireUser } from "../../context/UserContext";
import useFetchFriends from "../../hooks/useFetchFriends";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { CheckBox } from "react-native-elements";

const CreateGroupModal = () => {
  const [grpName, setGrpName] = useState("");
  const { fireUser: user, openGrp, setOpenGrp } = useFireUser();

  const { userPageData } = useFetchFriends();
  const [selectedUsers, setSelectedUsers] = useState([user?.uid]);
  const [visibleUsersCount, setVisibleUsersCount] = useState(4);

  const handleClose = () => setOpenGrp(false);

  const handleGroupSelection = (id, checked) => {
    setSelectedUsers((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((uid) => uid !== id)
    );
  };

  const getUniqueGroupChatId = (users) => [...new Set(users)].sort().join("-");

  const handleCreateGroup = async () => {
    handleClose();
    if (!grpName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    if (selectedUsers.length > 1) {
      const groupChatId = getUniqueGroupChatId(selectedUsers);
      const groupChatRef = doc(db, "groupChats", groupChatId);

      try {
        await setDoc(groupChatRef, {
          groupId: groupChatId,
          name: grpName,
          members: selectedUsers,
          createdBY: user?.uid,
          createdAt: Timestamp.now(),
          text: "",
        });

        Alert.alert("Success", "Group created successfully!");
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to create group");
      }
    } else {
      Alert.alert("Error", "Select more than one user");
    }
  };

  return (
    <Modal visible={openGrp} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add a Group</Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Group Name"
              placeholderTextColor={"#00000088"}
              value={grpName}
              onChangeText={setGrpName}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={handleCreateGroup}
              style={styles.createBtn}
            >
              <Text style={styles.btnText}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 300 }}>
            {userPageData
              ?.slice(0, visibleUsersCount)
              .reverse()
              .map((u) => (
                <Pressable
                  key={u.id}
                  style={styles.userRow}
                  onPress={() =>
                    handleGroupSelection(u.id, !selectedUsers.includes(u.id))
                  }
                >
                  <Image source={{ uri: u.img }} style={styles.avatar} />
                  <Text style={styles.name}>{u.name}</Text>
                  <CheckBox
                    checked={selectedUsers.includes(u.id)}
                    onPress={() =>
                      handleGroupSelection(u.id, !selectedUsers.includes(u.id))
                    }
                    checkedColor="#007BFF"
                    containerStyle={{ padding: 0, margin: 0 }}
                  />
                </Pressable>
              ))}
          </ScrollView>

          <View style={styles.footerButtons}>
            <TouchableOpacity
              onPress={() => setVisibleUsersCount((prev) => prev + 4)}
            >
              <Text style={styles.loadMore}>Load More</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderColor: "#ccc",
  },
  createBtn: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  name: {
    flex: 1,
    fontSize: 16,
  },
  loadMore: {
    textAlign: "center",
    color: "#007BFF",
    marginVertical: 8,
  },
  cancel: {
    textAlign: "center",
    color: "tomato",
    marginTop: 8,
  },
});
