import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../config/firebase-config";
import { useUser } from "@clerk/clerk-expo";
import { useFireUser } from "../context/UserContext";

export const UserProfile = () => {
  const { user, isLoaded } = useUser(); // Clerk user
  const { fireUser } = useFireUser(); // Your mapped format from context

  const [displayName, setDisplayName] = useState(fireUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(fireUser?.photoURL || "");
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permission required", "Allow access to gallery.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      const imageUri = selectedAsset.uri;

      try {
        setUploading(true);
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const imageRef = ref(storage, `profile_images/${fireUser.uid}`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        setPhotoURL(downloadURL);
      } catch (err) {
        Alert.alert("Error", "Failed to upload image.");
        console.error("Image Upload Error:", err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!user || !fireUser?.uid) {
      return Alert.alert("Error", "User is not loaded.");
    }

    try {
      setUploading(true);

      const trimmedName = displayName.trim();
      const userData = {
        displayName: trimmedName,
        photoURL,
        uid: fireUser.uid,
        email: fireUser.email,
        lastLogin: new Date().toISOString(),
      };

      // 🔹 1. Update Firestore
      await setDoc(doc(db, "users-log", fireUser.uid), userData, {
        merge: true,
      });


      Alert.alert("Success", "Profile updated.");
    } catch (err) {
      console.error("Update Error:", err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  if (!isLoaded || !fireUser) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage}>
        <Image
          source={{ uri: photoURL || "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />
        <Text style={styles.editIcon}>✏️</Text>
      </TouchableOpacity>

      <Text>{fireUser?.email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TouchableOpacity
        style={[styles.saveButton, uploading && { opacity: 0.6 }]}
        onPress={handleUpdateProfile}
        disabled={uploading}
      >
        <Text style={styles.saveText}>
          {uploading ? "Updating..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 2,
    fontSize: 18,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#F9FAFB",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
