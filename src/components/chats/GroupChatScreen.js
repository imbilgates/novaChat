import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../config/firebase-config";
import {
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import uuid from "react-native-uuid";
import { useUser } from "@clerk/clerk-expo";
import useUpdateGroupLastMessage from "../../hooks/useUpdateGroupLastMessage";

const GroupChatScreen = ({ group }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [openMessageIndex, setOpenMessageIndex] = useState(null);
  const flatListRef = useRef(null);

  const { user } = useUser();
  const { updateLastMessage } = useUpdateGroupLastMessage();

  const mappedUser = {
    uid: user?.id,
    displayName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    photoURL: user?.imageUrl || "",
  };

  const getUniqueChatId = (user, chatWithWho) => {
    if (Array.isArray(chatWithWho.members)) {
      return chatWithWho.groupId;
    } else {
      const sortedUids = [user.uid, chatWithWho.uid].sort();
      return sortedUids.join("");
    }
  };

  useEffect(() => {
    if (mappedUser.uid && group) {
      const chatId = getUniqueChatId(mappedUser, group);
      const chatRef = doc(db, "chats", chatId);

      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setMessages(
            (data.messages || []).sort((a, b) => {
              const timeA = a.time?.seconds || 0;
              const timeB = b.time?.seconds || 0;
              return timeA - timeB;
            })
          );
        } else {
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [mappedUser, group]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );
    return () => keyboardDidShowListener.remove();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = {
        id: uuid.v4(),
        name: mappedUser.displayName || "Anonymous",
        img: mappedUser.photoURL,
        time: Timestamp.now(),
        text: message,
        sender: mappedUser.uid,
      };

      const chatId = getUniqueChatId(mappedUser, group);
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion(newMessage),
        });
      } else {
        await setDoc(chatRef, {
          messages: [newMessage],
        });
      }

      await updateLastMessage(group?.groupId, message);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const deleteChatMessage = async (msg) => {
    try {
      const chatId = getUniqueChatId(mappedUser, group);
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        messages: arrayRemove(msg),
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const renderItem = ({ item, index }) => {
    const isSentByUser = item.sender === mappedUser.uid;
    const timeText = item.time?.seconds
      ? new Date(item.time.seconds * 1000).toLocaleTimeString()
      : "";

    return (
      <TouchableOpacity
        onPress={() =>
          isSentByUser &&
          setOpenMessageIndex((prev) => (prev === index ? null : index))
        }
        activeOpacity={0.8}
        style={[
          styles.messageContainer,
          isSentByUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          {item.img ? (
            <Image source={{ uri: item.img }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={{ color: "white" }}>
                {item.name?.charAt(0) || "?"}
              </Text>
            </View>
          )}
          <Text style={styles.username}>{item.name}</Text>
        </View>

        <Text style={styles.message}>{item.text}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.time}>{timeText}</Text>
          {isSentByUser && openMessageIndex === index && (
            <TouchableOpacity
              onPress={() => deleteChatMessage(item)}
              style={styles.deleteIcon}
            >
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 80}
    >
      <FlatList
        data={messages.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ref={flatListRef}
        contentContainerStyle={styles.scrollView}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#000"
          value={message}
          onChangeText={setMessage}
          onFocus={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <Ionicons
          name="send"
          size={28}
          color="black"
          style={styles.sendBtn}
          onPress={sendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default GroupChatScreen;


const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F1F1",
  },
  username: {
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
    color: "#111",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 12,
    color: "#777",
  },
  deleteIcon: {
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 25,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  sendBtn: {
    marginLeft: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultAvatar: {
    backgroundColor: "black",
  },
});
