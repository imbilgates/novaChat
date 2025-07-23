import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-react'; 
import { db } from '../config/firebase-config'

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useUser(); 
  const [fireUser, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openGrp, setOpenGrp] = useState(false);
  const [chatWithWho, setChatWithWho] = useState([]);
  const [openNotify, setOpenNotify] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        const customUser = {
          uid: user.id,
          displayName: user.fullName ?? '',
          email: user.primaryEmailAddress?.emailAddress ?? '',
          photoURL: user.imageUrl ?? '',
          lastLogin: new Date().toISOString(),
        };

        setUser(customUser);

        try {
          await setDoc(doc(db, 'users-log', user.id), customUser, { merge: true });
        } catch (err) {
          console.error('Error syncing user to Firestore:', err);
        }
      }
    };

    syncUser();
  }, [user]);

  const obj = {
    fireUser,
    setUser,
    loading,
    setLoading,
    open,
    setOpen,
    openGrp,
    setOpenGrp,
    chatWithWho,
    setChatWithWho,
    openNotify,
    setOpenNotify,
  };

  return <UserContext.Provider value={obj}>{children}</UserContext.Provider>;
};

export const useFireUser = () => useContext(UserContext);
