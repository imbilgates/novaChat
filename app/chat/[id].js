import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import ChatScreen from '../../components/chats/ChatScreen';
import useUsersLog from '../../hooks/useUsersLog';

const Left = () => {
    const { id } = useLocalSearchParams();
    const { users } = useUsersLog();

    const findUserById = (id) => {
        return users.find(user => user.uid === id);
    };

    const clickedUser = findUserById(id);

    return (
        <View style={styles.leftContainer}>
            <Ionicons onPress={() => router.back()} name="arrow-back" size={24} color="black" />
            {clickedUser ? (
                <View style={styles.leftContainer}>
                    <Avatar rounded source={{ uri: clickedUser.photoURL }} />
                    <Text style={{ fontSize: 24 }}>{clickedUser.displayName}</Text>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const Right = () => {

    return (
        <View style={styles.rightContainer}>
            <Feather name="video" size={24} color="black" />
            <Ionicons name="call-outline" size={24} color="black" />
        </View>
    );
}


const Chat = () => {

    const { id } = useLocalSearchParams();
    const { users } = useUsersLog();

    const findUserById = (id) => {
        return users.find(user => user.uid === id);
    };

    const clickedUser = findUserById(id);
    
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "",
                    headerLeft: () => <Left />,
                    headerRight: () => <Right />
                }}
            />
            <ChatScreen clickedUser={clickedUser}/>
        </>
    );
}

export default Chat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 13,
    },
    rightContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    }
});
