import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const useFetchRecentUsersByLastLogin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'users-log');

        // Get the current timestamp
        const currentTimestamp = Timestamp.now();

        // Subtract 24 hours from current timestamp
        const pastTimestamp = new Timestamp(currentTimestamp.seconds - 24 * 60 * 60, 0);

        const q = query(
          usersCollection,
          orderBy('lastLogin', 'desc'),  // Order by lastLogin as Timestamp
          where('lastLogin', '>=', pastTimestamp),  // Users who logged in within the last 24 hours
          where('lastLogin', '<=', currentTimestamp) // Fetch users within the current timestamp
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No recently active users.");
        }

        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users: ', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, loading, error };
};

export default useFetchRecentUsersByLastLogin;
