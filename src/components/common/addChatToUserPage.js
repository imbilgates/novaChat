import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase-config";

// Add each user to the other's userPage chat list
export const addChatToUserPage = async (currentUser, selectedUser) => {
  if (!currentUser || !selectedUser) return;

  const selectedUserRef = doc(db, "userPage", selectedUser.uid);
  const currentUserRef = doc(db, "userPage", currentUser.uid);

  const chatForSelectedUser = {
    id: currentUser.uid,
    name: currentUser.displayName,
    img: currentUser.photoURL,
    time: new Date(),
    text: "Say hi!",
  };

  const chatForCurrentUser = {
    id: selectedUser.uid,
    name: selectedUser.displayName,
    img: selectedUser.photoURL,
    time: new Date(),
    text: "Say hi!",
  };

  // ---- Update selectedUser's userPage
  const selectedSnapshot = await getDoc(selectedUserRef);
  if (selectedSnapshot.exists()) {
    const data = selectedSnapshot.data();
    const chats = data.chats || [];
    const exists = chats.some((chat) => chat.id === currentUser.uid);
    if (!exists) {
      await updateDoc(selectedUserRef, {
        chats: arrayUnion(chatForSelectedUser),
      });
    }
  } else {
    await setDoc(selectedUserRef, {
      chats: [chatForSelectedUser],
    });
  }

  // ---- Update currentUser's userPage
  const currentSnapshot = await getDoc(currentUserRef);
  if (currentSnapshot.exists()) {
    const data = currentSnapshot.data();
    const chats = data.chats || [];
    const exists = chats.some((chat) => chat.id === selectedUser.uid);
    if (!exists) {
      await updateDoc(currentUserRef, {
        chats: arrayUnion(chatForCurrentUser),
      });
    }
  } else {
    await setDoc(currentUserRef, {
      chats: [chatForCurrentUser],
    });
  }
};
