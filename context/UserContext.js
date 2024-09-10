import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [fireUser, setFireUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFireUser(user);
            setLoading(false);  
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ fireUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useFireUser = () => useContext(UserContext);
