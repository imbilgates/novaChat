import { useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../context/UserContext';
import { db } from '../config/firebase-config';

// Custom hook to fetch group chats based on current user membership
const useFetchGroupChats = () => {
    const [groupChats, setGroupChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  const { fireUser: user } = useContext(UserContext);

    useEffect(() => {
        if (!user?.uid) return;

        // Reference to the 'chats' collection in Firestor
        const chatsRef = collection(db, 'groupChats');

        // Query to find all group chats where the current user's UID is in the 'members' array
        const q = query(chatsRef, where('members', 'array-contains', user.uid));

        // Subscribe to changes in the query result
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const groups = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGroupChats(groups);
                setLoading(false);
            },
            (err) => {
                setError(err);
                console.error('Error fetching group chats:', err);
                setLoading(false);
            }
        );

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, [user]);

    return { groupChats, loading, error };
};

export default useFetchGroupChats;
