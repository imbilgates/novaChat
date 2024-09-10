import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

const useCurrentUserChatList = () => {
    
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "userPage"));
                const usersList = [];
                querySnapshot.forEach((doc) => {
                    usersList.push(doc.data());
                });
                setChatList(usersList);
            } catch (err) {
                setError(err);
                console.error("Error getting all users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { chatList, loading, error };
};

export default useCurrentUserChatList;
