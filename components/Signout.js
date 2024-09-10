import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../config/firebase-config';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';

const Signout = () => {
    const [loading, setLoading] = useState(false);
    const { signOut } = useAuth()

    const handleSignOut = () => {
        setLoading(true);
        try {
            setTimeout(async () => {
                // for firebase
                await auth.signOut();

                // for clerk
                await signOut();

                router.replace('auth');
                console.log('User signed out');
                setLoading(false); 
            }, 3000);
        } catch (error) {
            console.error('Error while signing out from Firebase: ', error);
            setLoading(false); 
        }
    };

    return (
        <View  style={styles.container} >
            {loading ? (
                <ActivityIndicator size="small" color="red" />
            ) : (
                <TouchableOpacity
                    onPress={handleSignOut}
                    disabled={loading}
                >
                    <Icon name="logout" size={24} color="#FF6B6B" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Signout;

const styles = StyleSheet.create({
    container: {
        marginRight: 30,
    },
});
