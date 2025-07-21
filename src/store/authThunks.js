import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, setDoc, Timestamp } from "firebase/firestore";


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, username);
      const user = userCredential.user;

      // Define default photoURL if not provided
      const profilePhotoURL = pfp;

      // Update Auth profile with displayName and photoURL
      await updateProfile(user, {
        displayName: username || user.displayName || '',
        photoURL: profilePhotoURL,
      });

      // Update Firestore document
      const userRef = doc(db, "users-log", user.uid);
      await setDoc(userRef, {
        displayName: username || user.displayName || "",
        email: user.email,
        photoURL: profilePhotoURL,
        uid: user.uid,
        lastLogin: Timestamp.now()
      }, { merge: true });

      return user;

    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const pfp = "https://firebasestorage.googleapis.com/v0/b/chatwithme-f4d3b.appspot.com/o/profile_images%2Fdefault-img.jpg?alt=media&token=1ba78e09-fe52-41d2-b403-e1c46a0677cb";

