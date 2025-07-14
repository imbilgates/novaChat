import { View, StyleSheet, TextInput, Button, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/authThunks';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();
    const authStatus = useSelector((state) => state.auth.status);
    const authError = useSelector((state) => state.auth.error);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const result = await dispatch(register({ email, password, username })).unwrap();
            console.log("REGISTER SUCCESS", result);
            router.replace("/(tabs)");
        } catch (err) {
            console.error('❌ Registration failed:', err);
            alert(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={styles.avoidingView}>

                <TextInput
                    style={styles.input}
                    placeholder='username'
                    placeholderTextColor="#aaa"
                    autoCapitalize='none'
                    keyboardType='default'
                    onChangeText={setUsername}
                    value={username}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    placeholderTextColor="#aaa"
                    autoCapitalize='none'
                    keyboardType='email-address'
                    onChangeText={setEmail}
                    value={email}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor="#aaa"
                    autoCapitalize='none'
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />
                <Button title="Create Account" onPress={handleRegister} />
                {authStatus === 'loading' && <Text>Loading...</Text>}
                {authError && <Text>Error: {authError}</Text>}
                <View style={styles.linkContainer}>
                    <Text style={styles.text}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity onPress={() => router.replace('/auth')}>
                        <Text style={styles.link}>login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
    },
    avoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 20,
        backgroundColor: '#fff',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    text: {
        textAlign: 'center',
    },
    link: {
        color: '#0066cc',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
