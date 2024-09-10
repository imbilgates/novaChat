import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

const useUsersGetLog = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users-log"));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data());
        });
        setUsers(usersList);
      } catch (err) {
        setError(err);
        console.error("Error getting all users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useUsersGetLog;
  