import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { UserContext } from "../context/UserContext";

const useFetchFriends = () => {
  const [userPageData, setUserPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fireUser: user } = useContext(UserContext);

  useEffect(() => {
    if (user?.uid) {
      const chatRef = doc(db, "userPage", user.uid);

      const unsubscribe = onSnapshot(
        chatRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setUserPageData(Array.isArray(data.chats) ? data.chats : []);
          } else {
            console.log("No such document!");
            setUserPageData([]);
          }
          setLoading(false);
        },
        (error) => {
          setError(error);
          console.error("Error fetching user page data:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  return { userPageData, loading, error };
};

export default useFetchFriends;
