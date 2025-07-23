import { View, StyleSheet } from 'react-native';
import WelcomeBanner from '../../src/components/auth/WelcomeBanner';
import GoogleSignInButton from '../../src/components/auth/GoogleSignInButton';

const WelcomeScreen = () => {
  return (
    <View style={styles.container}>
      <WelcomeBanner />
      <GoogleSignInButton />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
  },
});
