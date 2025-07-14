import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../config/firebase-config";
import { getUniqueChatId } from "../../utils/getUniqueChatId";
import {
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import uuid from "react-native-uuid";

const ChatScreen = ({ clickedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMessageIndex, setOpenMessageIndex] = useState(null);

  const scrollViewRef = useRef(null);
  const user = auth.currentUser;

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (user && clickedUser) {
      setLoading(true);
      const chatRef = doc(db, "chats", getUniqueChatId(user?.uid, clickedUser?.uid));
      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [user, clickedUser]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const receivedMessage = {
        id: uuid.v4(),
        name: user?.displayName || "Anonymous",
        img: user?.photoURL,
        time: new Date().toLocaleTimeString(),
        text: message,
        sender: user?.uid,
      };

      const chatId = getUniqueChatId(user?.uid, clickedUser?.uid);
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion(receivedMessage),
        });
      } else {
        await setDoc(chatRef, {
          messages: [receivedMessage],
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const deleteChatMessage = async (msg) => {
    try {
      const chatId = getUniqueChatId(user?.uid, clickedUser?.uid);
      const chatRef = doc(db, "chats", chatId);
      await updateDoc(chatRef, {
        messages: arrayRemove(msg),
      });
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  const renderItem = ({ item, index }) => {
    const isSentByUser = item.sender === user?.uid;

    return (
      <TouchableOpacity
        onPress={() => isSentByUser && setOpenMessageIndex(prev => (prev === index ? null : index))}
        activeOpacity={0.8}
        style={[
          styles.messageContainer,
          isSentByUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.message}>{item.text}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.time}>
            {item.time?.seconds
              ? new Date(item.time.seconds * 1000).toLocaleTimeString()
              : item.time || ""}
          </Text>

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
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={styles.scrollView}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          placeholderTextColor="#000"
          onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          value={message}
          onChangeText={(newText) => setMessage(newText)}
        />

        <Ionicons
          name="send"
          size={30}
          color="black"
          style={styles.sendBtn}
          onPress={sendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

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
    marginBottom: 4,
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
    marginBottom: 20,
  },
  sendBtn: {
    marginLeft: 10,
    marginBottom: 20,
  },
});
