import { Text, Image, StyleSheet } from 'react-native';

const WelcomeBanner = () => {
  return (
    <>
      <Image
        source={require('../../../assets/images/image.png')}
        style={styles.bannerImage}
        resizeMode="contain"
      />
      <Text style={styles.title}>NovaChat</Text>
      <Text style={styles.subtitle}>
        Welcome to the future{'\n'}of private conversations
      </Text>
    </>
  );
};

export default WelcomeBanner;

const styles = StyleSheet.create({
  bannerImage: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
});
