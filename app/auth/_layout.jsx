import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

const AuthLayout = () => {

    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href={'/(tabs)'} />
    }

    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        </Stack>
    );
};

export default AuthLayout;

