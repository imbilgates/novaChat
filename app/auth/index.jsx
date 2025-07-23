import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useSocialAuth } from '../../src/hooks/useSocialAuth';

const WelcomeScreen = () => {
  const { handleSocialAuth, isLoading } = useSocialAuth();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/image.png')}
        style={styles.bannerImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>NovaChat</Text>
      <Text style={styles.subtitle}>
        Welcome to the future{'\n'}of private conversations
      </Text>

      <TouchableOpacity
        style={styles.googleBtn}
        onPress={() => handleSocialAuth('oauth_google')}
        disabled={isLoading}
      >
        <Image
          source={require('../../assets/images/google.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleBtnText}>
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // light gray
    paddingHorizontal: 20,
  },
  bannerImage: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827', // dark text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 10
  },
  googleBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
});
