import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonItem = ({ variant, index }) => {
  if (variant === "chat") {
    return (
      <View style={styles.chatItemContainer}>
        <View style={styles.chatAvatar} />
        <View style={styles.chatName} />
        <View style={styles.chatLabel} />
        <View style={styles.chatValue} />
        <View style={styles.chatLabel} />
        <View style={styles.chatValue} />
      </View>
    );
  }

  return (
    <View style={styles.memberItem}>
      <View style={styles.avatar} />
      <View style={styles.nameBlock} />
    </View>
  );
};

const SkeletonList = ({ variant, count = 5 }) => {
  return (
    <View style={styles.container}>
      {variant === "group" && (
        <View style={styles.groupHeader}>
          <View style={styles.title} />
          <View style={styles.createdAt} />
          <View style={styles.sectionHeader} />
        </View>
      )}
      {[...Array(count)].map((_, index) => (
        <SkeletonItem key={index} variant={variant} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },

  // Group header
  groupHeader: {
    marginBottom: 24,
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

  // Group member row
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

  // Chat
  chatItemContainer: {
    alignItems: "center",
    paddingTop: 24,
    width: "100%",
  },
  chatAvatar: {
    width: 172,
    height: 172,
    borderRadius: 96,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  chatName: {
    width: 160,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  chatLabel: {
    width: 100,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
    marginBottom: 6,
  },
  chatValue: {
    width: 200,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
});

export default SkeletonList;
