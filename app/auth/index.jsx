import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import * as WebBrowser from 'expo-web-browser';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authThunks';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {

  useWarmUpBrowser();


  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      })

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      } else {
        console.log("Clerk failed to create a session");
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);


  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.avoidingView} >
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

        <View style={styles.linkContainer}>
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('auth/signup')}>
            <Text style={styles.link}>Signup</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{ marginTop: 20 }}>
            <Button title="Login" onPress={handleLogin} />
            {authStatus === 'loading' && <Text>Loading...</Text>}
            {authError && <Text>Error: {authError}</Text>}
          </View>
        )}

        <View style={styles.googleBtnContainer}>
          <Text>Or Continue with</Text>
          <TouchableOpacity style={styles.googleBtn} onPress={onPress}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleBtnText}>Signin with Google</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

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
    marginTop: 30,
  },
  text: {
    textAlign: 'center',
  },
  link: {
    color: '#0066cc',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  googleBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  googleBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
  },
  googleBtnText: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '500',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    borderRadius: 100,
  },

});
