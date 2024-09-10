import { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-expo';

const useClerkUsers = () => {
  const { client } = useClerk();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await client.users.getUserList();
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [client]);

  return { users, loading, error };
};

export default useClerkUsers;
