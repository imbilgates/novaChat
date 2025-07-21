import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

const SkeletonItem = () => (
  <View style={styles.chatItem}>
    <View style={styles.avatar} />
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <View style={styles.username} />
        <View style={styles.time} />
      </View>
      <View style={styles.lastMessage} />
    </View>
  </View>
);

const SkeletonLoader = ({ count = 6 }) => {
  const data = Array.from({ length: count });

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <SkeletonItem />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default SkeletonLoader;


const styles = StyleSheet.create({
  chatItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  username: {
    width: 120,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  time: {
    width: 60,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  lastMessage: {
    width: "90%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
});

