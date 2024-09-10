import { KeyboardAvoidingView, Platform, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Keyboard } from 'react-native';
import { auth, db } from '../../config/firebase-config';
import { getUniqueChatId } from '../../utils/getUniqueChatId';
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import useClerkUsers from '../../hooks/useClerkUsers';


const ChatScreen = ({ clickedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const uniqueId = uuid.v4();

  const { users } = useClerkUsers();

  console.log(users);
  



  const scrollViewRef = useRef(null);

  const user = auth.currentUser;

  // Scroll to the bottom when the component mounts and when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
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
    if (!message.trim()) return; // Avoid sending empty messages

    try {
      const receivedMessage = {
        id: uniqueId, // More unique ID
        name: user?.displayName || 'Anonymous',
        img: user?.photoURL,
        time: new Date().toLocaleTimeString(),
        text: message,
        sender: user?.uid
      };

      const chatId = getUniqueChatId(user?.uid, clickedUser?.uid);
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion(receivedMessage) // Use arrayUnion to avoid duplicates
        });
      } else {
        await setDoc(chatRef, {
          messages: [receivedMessage]
        });
      }

      setMessage(''); // Reset message input only on success
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === user?.uid ? styles.sentMessage : styles.receivedMessage
      ]}
    >
      <Text style={styles.username}>{item.name}</Text>
      <Text style={styles.message}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.scrollView}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Type here...'
          placeholderTextColor='#000'
          onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          value={message}
          onChangeText={newText => setMessage(newText)}
        />

        <Ionicons name="send" size={30} color="black" style={styles.sendBtn} onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  messages: {
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',  // Light green for sent messages
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',  // Light gray for received messages
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    marginHorizontal: 10,
    height: 50,
    width: '85%',
    borderWidth: 1,
    borderRadius: 100,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  sendBtn: {
    marginHorizontal: 10,
  }
});
