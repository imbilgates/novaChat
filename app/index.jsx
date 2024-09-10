import { Redirect, router } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from '@firebase/auth';
import { auth } from '../config/firebase-config';

const Index = () => {
  

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
    <View style={styles.container}>
      {isSignedIn ?
        <Redirect href={'/'}
        />
        :
        <Redirect href={'/auth/'}
        />
      }
    </View>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})