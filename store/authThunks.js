import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase-config";

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, thunkAPI) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const register = createAsyncThunk(
    'auth/register',
    async ({ email, password, username }, thunkAPI) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update user profile
            await updateProfile(userCredential.user, {
                displayName: username,
                photoURL: "https://firebasestorage.googleapis.com/v0/b/chat-app-react-native-d4890.appspot.com/o/images%2Fimages.png?alt=media&token=191ac2f5-97c9-440b-a8a6-d52053e98c74"
            });

            return userCredential.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
