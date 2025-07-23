import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase-config";

export const addChatToUserPage = async (currentUser, selectedUser) => {
  if (!currentUser || !selectedUser) return;

  const userRef = doc(db, "userPage", currentUser.uid);
  const userSnapshot = await getDoc(userRef);

  const chatData = {
    id: selectedUser.uid,
    name: selectedUser.displayName,
    img: selectedUser.photoURL,
    time: new Date(),
    text: "Say hi!",
  };

  if (userSnapshot.exists()) {
    const data = userSnapshot.data();
    const chats = data.chats || [];

    const alreadyExists = chats.some((chat) => chat.id === selectedUser.uid);
    if (alreadyExists) return; // Don't add again

    await updateDoc(userRef, {
      chats: arrayUnion(chatData),
    });
  } else {
    await setDoc(userRef, {
      chats: [chatData],
    });
  }
};
