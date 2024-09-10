import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import useUsersLog from '../hooks/useUsersLog';

const SearchUsers = () => {
    const { users } = useUsersLog();
    const [search, setSearch] = useState('');

    useEffect(() => {
        setFilteredList(users);
    }, [users]);
    


    const [filteredList, setFilteredList] = useState(users);


    const filterList = (text) => {
        setSearch(text);
        const filtered = users.filter((user) =>
            user.displayName.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredList(filtered);
    };

    const renderItem = ({ item, index }) => {

        return (
            <ListItem containerStyle={{ borderBottomWidth: 0} } >
                <Avatar rounded source={{ uri: item.photoURL }} />
                <ListItem.Content>
                    <ListItem.Title style={styles.username}>{item.displayName}</ListItem.Title>
                </ListItem.Content>
                <Ionicons name="person-add" size={24} color="black" />
            </ListItem>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Search Users'
                placeholderTextColor='#000'
                value={search}
                onChangeText={filterList}
            />

            <FlatList
                style={styles.searchList}
                data={filteredList}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default SearchUsers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        marginVertical: 60,
        marginHorizontal: 20,
        height: 50,
        width: '90%',
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 20,
        backgroundColor: '#fff',
        marginBottom: 0,
    },
    searchList: {
        marginLeft: 20,
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
