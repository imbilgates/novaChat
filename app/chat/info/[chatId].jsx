import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-elements";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import useUsersGetLog from "../../../src/hooks/useUsersGetLog";
import SkeletonList from "../../../src/components/skeletons/SkeletonList";

const ChatInfoScreen = () => {
  const { chatId } = useLocalSearchParams();
  const { isLoaded } = useUser();
  const { users, loading } = useUsersGetLog();

  const isLoading = !isLoaded || loading;
  const otherUser = users.find((u) => u.uid === chatId);

  if (isLoading) return <SkeletonList variant={"chat"} count={1}/>
    ;

  if (!otherUser) {
    return (
      <View style={styles.centered}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="xlarge"
        source={otherUser.photoURL ? { uri: otherUser.photoURL } : undefined}
        title={otherUser.displayName?.[0] || "U"}
        containerStyle={styles.avatar}
      />
      <Text style={styles.name}>{otherUser.displayName}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{otherUser.email}</Text>

      <Text style={styles.label}>Last Login:</Text>
      <Text style={styles.value}>
        {new Date(otherUser.lastLogin).toLocaleString()}
      </Text>
    </View>
  );
};

export default ChatInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    backgroundColor: "#ccc",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: "#444",
  },
});
