import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [fireUser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openGrp, setOpenGrp] = useState(false);
  const [chatWithWho, setChatWithWho] = useState([]);
  const [openNotify, setOpenNotify] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const obj = {
    fireUser,
    setUser,
    loading,
    open,
    setOpen,
    openGrp,
    setOpenGrp,
    chatWithWho,
    setChatWithWho,
    setOpenNotify,
    openNotify,
  };

  return (
    <UserContext.Provider value={obj}>
      {children}
    </UserContext.Provider>
  );
};


// Custom hook to use the UserContext
export const useFireUser = () => useContext(UserContext);
