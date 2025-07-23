import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useSocialAuth } from '../../hooks/useSocialAuth';

const GoogleSignInButton = () => {
  const { handleSocialAuth, isLoading } = useSocialAuth();

  return (
    <TouchableOpacity
      style={styles.googleBtn}
      onPress={() => handleSocialAuth('oauth_google')}
      disabled={isLoading}
    >
      <Image
        source={require('../../../assets/images/google.png')}
        style={styles.googleIcon}
      />
      <Text style={styles.googleBtnText}>
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({
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
    borderRadius: 10,
  },
  googleBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
});
