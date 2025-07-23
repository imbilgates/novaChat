import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const useSaveUserLog = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const saveUser = async () => {
      try {
        const userRef = doc(db, 'users-log', user.id);
        await setDoc(userRef, {
          uid: user.id,
          displayName: user.fullName ?? '',
          email: user.primaryEmailAddress?.emailAddress ?? '',
          photoURL: user.imageUrl ?? '',
          lastLogin: new Date().toISOString(),
        });
        console.log('✅ User log saved to Firestore');
      } catch (error) {
        console.error('❌ Error saving user log:', error);
      }
    };

    saveUser();
  }, [isLoaded, isSignedIn, user]);
};

export default useSaveUserLog;
