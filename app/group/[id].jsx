import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import useFetchGroupChats from "../../src/hooks/useFetchFriendGroup";
import GroupChatScreen from "../../src/components/chats/GroupChatScreen";

const screenWidth = Dimensions.get("window").width;

const GroupHeader = ({ group }) => (
  <View style={styles.headerContainer}>
    <View style={styles.leftSection}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconWrapper}>
        <Ionicons name="arrow-back" size={24} color="#222" />
      </TouchableOpacity>

      <View style={styles.groupInfo}>
        <Avatar
          rounded
          source={group.img ? { uri: group.img } : undefined}
          title={!group.img ? group.name?.charAt(0) || "G" : ""}
          size="small"
          containerStyle={{ backgroundColor: "black" }}
        />
        <Text style={styles.groupName} numberOfLines={1}>
          {group.name}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      onPress={() => router.push(`/group/info/${group.groupId}`)}
      style={styles.iconWrapper}
    >
      <Entypo name="info-with-circle" size={22} color="#444" />
    </TouchableOpacity>
  </View>
);

const GroupChat = () => {
  const { id } = useLocalSearchParams();
  const { groupChats, loading } = useFetchGroupChats();
  const group = groupChats.find((chat) => chat.groupId === id);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading group chat...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.centered}>
        <Text>Group not found or you are not a member.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => <GroupHeader group={group} />,
          headerStyle: styles.header,
        }}
      />
      <GroupChatScreen group={group} isGroup />
    </>
  );
};

export default GroupChat;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f9f9f9",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: screenWidth,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  iconWrapper: {
    padding: 6,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 8,
    flexShrink: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    maxWidth: screenWidth * 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
