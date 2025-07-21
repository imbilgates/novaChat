import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { db } from "../config/firebase-config";
import { UserContext } from "../context/UserContext";

const useUpdateLastMessage = () => {
  const { fireUser: user } = useContext(UserContext);

  const updateLastMessage = async (friendId, newText) => {
    if (!user?.uid || !friendId || !newText) return;

    try {
      const chatRef = doc(db, "userPage", user.uid);
      const docSnap = await getDoc(chatRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const updatedChats = data.chats.map((chat) =>
          chat.id === friendId
            ? { ...chat, text: newText, time: new Date().toString() }
            : chat
        );

        await updateDoc(chatRef, { chats: updatedChats });

        console.log("Last message and timestamp updated");
      }
    } catch (err) {
      console.error("Error updating last message:", err);
    }
  };

  return updateLastMessage;
};

export default useUpdateLastMessage;
