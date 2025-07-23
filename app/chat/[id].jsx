import { StyleSheet, View, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import ChatScreen from "../../src/components/chats/ChatScreen";
import useUsersLog from "../../src/hooks/useUsersGetLog";
import UserHeader from "../../src/components/headers/UserHeader";

const Chat = () => {
  const { id } = useLocalSearchParams();
  const { users } = useUsersLog();
  const clickedUser = users.find((user) => user.uid === id);

  if (!clickedUser) {
    return (
      <View style={styles.centered}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <UserHeader user={clickedUser} />,
          headerStyle: styles.header,
        }}
      />
      <ChatScreen clickedUser={clickedUser} />
    </>
  );
};

export default Chat;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f9f9f9",
    elevation: 0,
    shadowOpacity: 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
