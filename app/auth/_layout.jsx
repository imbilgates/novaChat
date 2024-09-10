import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { auth } from '../../config/firebase-config';
import { onAuthStateChanged } from '@firebase/auth';

const Page = () => {
    const { isSignedIn } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (isSignedIn) {
            navigation.navigate('(tabs)');
        } else {
            console.log("Not signed in");
        }
    }, [isSignedIn, navigation]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            navigation.navigate('(tabs)');
          }
        });
    
        return () => unsubscribe();
      }, [navigation, auth]);
    

    return (
        <Stack screenOptions={{ headerShown: true, gestureEnabled: false }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Login Page',
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.headerTitleStyle,
                    headerTintColor: styles.headerTintColor.color,
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    title: 'Register Page',
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.headerTitleStyle,
                    headerTintColor: styles.headerTintColor.color,
                }}
            />
        </Stack>
    );
};

export default Page;

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#6200EE',
    },
    headerTitleStyle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    headerTintColor: {
        color: '#FFFFFF',
    },
});
