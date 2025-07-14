import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAwd8r3qWC6hbwYkeUfPpbLutQazSxIBsM",
  authDomain: "chatwithme-f4d3b.firebaseapp.com",
  databaseURL: "https://chatwithme-f4d3b-default-rtdb.firebaseio.com",
  projectId: "chatwithme-f4d3b",
  storageBucket: "chatwithme-f4d3b.appspot.com",
  messagingSenderId: "1063708558827",
  appId: "1:1063708558827:web:11def669906227e329c5ae"
};


const app = initializeApp(firebaseConfig);

// Use this for React Native apps to ensure persistence across sessions
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export { auth };
