import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const UserHeader = ({ user }) => (
  <View style={styles.headerContainer}>
    <View style={styles.leftSection}>
      <TouchableOpacity onPress={() => router.back()} style={styles.iconWrapper}>
        <Ionicons name="arrow-back" size={24} color="#222" />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <Avatar
          rounded
          source={user.photoURL ? { uri: user.photoURL } : undefined}
          title={user.displayName?.[0] || "U"}
          size="small"
          containerStyle={{ backgroundColor: "#ccc" }}
        />
        <Text style={styles.username} numberOfLines={1}>
          {user.displayName}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      onPress={() => router.push(`/chat/info/${user.uid}`)}
      style={styles.iconWrapper}
    >
      <Entypo name="info-with-circle" size={22} color="#444" />
    </TouchableOpacity>
  </View>
);

export default UserHeader;

const styles = StyleSheet.create({
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 8,
    flexShrink: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    maxWidth: screenWidth * 0.5,
  },
});
