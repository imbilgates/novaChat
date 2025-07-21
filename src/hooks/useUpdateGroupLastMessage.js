import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const useUpdateGroupLastMessage = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateLastMessage = async (groupId, newText) => {
    setUpdating(true);
    setError(null);

    try {
      const groupRef = doc(db, 'groupChats', groupId);
      await updateDoc(groupRef, {
        text: newText,
        updatedAt: serverTimestamp(), 
      });
    } catch (err) {
      console.error('Error updating group last message:', err);
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  return { updateLastMessage, updating, error };
};

export default useUpdateGroupLastMessage;
