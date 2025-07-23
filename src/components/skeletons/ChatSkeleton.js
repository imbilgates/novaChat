import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

const ChatSkeleton = () => {
  const animatedValues = Array.from({ length: 6 }, () => new Animated.Value(0));

  useEffect(() => {
    const animations = animatedValues.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach(anim => anim.start());

    return () => animations.forEach(anim => anim.stop());
  }, []);

  const renderItem = ({ item, index }) => {
    const isRight = index % 2 !== 0;
    const translateX = animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: isRight ? [100, 0] : [-100, 0],
    });

    return (
      <Animated.View
        style={[
          styles.row,
          isRight ? styles.rightRow : null,
          { transform: [{ translateX }] },
        ]}
      >
        {!isRight && <View style={styles.avatar} />}
        <View
          style={[
            styles.bubble,
            isRight ? styles.rightBubble : styles.leftBubble,
          ]}
        />
        {isRight && <View style={styles.avatar} />}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Array(6)}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  rightRow: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
  },
  bubble: {
    height: 20,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 10,
  },
  leftBubble: {
    width: screenWidth * 0.6,
  },
  rightBubble: {
    width: screenWidth * 0.45,
  },
});
