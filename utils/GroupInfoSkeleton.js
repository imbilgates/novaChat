import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

const SkeletonMember = () => (
  <View style={styles.memberItem}>
    <View style={styles.avatar} />
    <View style={styles.nameBlock} />
  </View>
);

const GroupInfoSkeleton = ({ count = 5 }) => {
  const data = Array.from({ length: count });

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <SkeletonMember />}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.title} />
          <View style={styles.createdAt} />
          <View style={styles.sectionHeader} />
        </View>
      }
      contentContainerStyle={styles.container}
    />
  );
};

export default GroupInfoSkeleton;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    width: 180,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  createdAt: {
    width: 140,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  sectionHeader: {
    width: 100,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
  },
  nameBlock: {
    width: 160,
    height: 18,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
});
