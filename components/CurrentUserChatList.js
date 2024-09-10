import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { users } from '../utils/users';
import { auth, db } from '../config/firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';


const UsersChatList = () => {

  const user  = auth.currentUser?.uid;

  const [ currentUserChatList, setCurrentUserChatList ] = useState([]);

  useEffect(() => {
    if (user) {
        const chatRef = doc(db, 'userPage', user);

        const unsubscribe = onSnapshot(chatRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setCurrentUserChatList(Array.isArray(data.chats) ? data.chats : []);
            } else {
                console.log('No such document!');
                setCurrentUserChatList([]);
            }
        }, (error) => {
            console.error('Error fetching user page data:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }
}, []);


  const renderItem = ({ item, index }) => {
    const isLastItem = index === users.length - 1;

    return (
      <TouchableOpacity onPress={()=> router.push(`/chat/${item.id}`)}>
        <ListItem
          bottomDivider={!isLastItem}
          containerStyle={isLastItem ? { borderBottomWidth: 0 } : null}
        >
          <Avatar rounded source={{ uri: item.img }} />
          <ListItem.Content>
            <ListItem.Title style={styles.name}>{item.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.lastMessage}>{item.text}</ListItem.Subtitle>
          </ListItem.Content>
          <Text style={styles.time}>{item.time}</Text>
        </ListItem>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={currentUserChatList.slice().reverse()}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

export default UsersChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  username: {
    fontWeight: 'bold',
  },
  lastMessage: {
    color: 'gray',
  },
  time: {
    color: 'gray',
    fontSize: 12,
  },
});

