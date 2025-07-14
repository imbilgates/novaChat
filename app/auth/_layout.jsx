import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';


const AuthLayout  = () => {
    

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

export default AuthLayout;

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
