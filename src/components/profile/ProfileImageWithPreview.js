import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const ProfileImageWithPreview = ({ uri, name, size = "medium" }) => {
  const [visible, setVisible] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const initials = name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Avatar
          rounded
          source={uri ? { uri } : null}
          title={initials}
          size={size}
          renderPlaceholderContent={
            <Text style={styles.placeholderText}>{initials}</Text>
          }
          containerStyle={styles.avatar}
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.fullScreen}
            onPress={() => {
              setVisible(false);
              setLoadingImage(true); // reset loader
            }}
          >
            <View style={styles.imageWrapper}>
              {loadingImage && (
                <ActivityIndicator size="large" color="#fff" style={styles.loader} />
              )}
              <Image
                source={{ uri }}
                style={[styles.fullImage, loadingImage && { opacity: 0.2 }]}
                resizeMode="cover"
                onLoadEnd={() => setLoadingImage(false)}
              />
            </View>

            <Text style={styles.closeText}>Tap anywhere to close</Text>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </>
  );
};

export default ProfileImageWithPreview;

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#000",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.35, // Make it fully rounded
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
  closeText: {
    marginTop: 20,
    color: "#ccc",
    fontSize: 14,
  },
});
