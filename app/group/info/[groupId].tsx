import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import useFetchGroupChats from "../../../src/hooks/useFetchFriendGroup";
import useUsersGetLog from "../../../src/hooks/useUsersGetLog";
import { Avatar } from "react-native-elements";
import { convertTimestamp } from "../../../src/utils/convertTimestamp";
import SkeletonList from "../../../src/components/skeletons/SkeletonList";

const GroupInfoScreen = () => {
  const { groupId } = useLocalSearchParams();
  const { groupChats, loading: loadingGroups } = useFetchGroupChats();
  const { users, loading: loadingUsers } = useUsersGetLog();

  const group = groupChats.find((g) => g.groupId === groupId);
  const groupMembers = users.filter((u) => group?.members?.includes(u.uid));
  const admin = users.find((u) => u.uid === group?.createdBY);

  const isLoading = loadingGroups || loadingUsers;

  if (isLoading) {
    return (
       <SkeletonList variant={"group"} />
    );
  }

  if (!group) {
    return (
      <View style={styles.centered}>
        <Text>Group not found.</Text>
      </View>
    );
  }

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Avatar
        rounded
        size="medium"
        source={item.photoURL ? { uri: item.photoURL } : undefined}
        title={item.displayName?.[0] || "U"}
        containerStyle={{ backgroundColor: "#ccc" }}
      />
      <Text style={styles.memberName}>
        {item.displayName}{" "}
        {admin?.uid === item.uid && (
          <Text style={styles.adminTag}>(Admin)</Text>
        )}
      </Text>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={groupMembers}
      keyExtractor={(item) => item.uid}
      renderItem={renderMember}
      ListHeaderComponent={() => (
        <View>
          <Text style={styles.title}>{group.name}</Text>
          <Text style={styles.createdAt}>
            Created At: {convertTimestamp(group.createdAt)}
          </Text>
          <Text style={styles.sectionHeader}>Members</Text>
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={styles.noMembers}>No members found.</Text>
      )}
    />
  );
};

export default GroupInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  createdAt: {
    color: "#666",
    fontSize: 14,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
  },
  adminTag: {
    fontWeight: "bold",
    color: "red",
    fontSize: 14,
  },
  noMembers: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
  },
});
