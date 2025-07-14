import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useFireUser } from '../context/UserContext';

export const UserProfile = () => {
  const { fireUser: user } = useFireUser();

  const isLoaded = !!user;

  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: user?.photoURL || user?.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.displayName}>
          {user?.displayName || user?.fullName || 'Anonymous User'}
        </Text>
        <Text style={styles.email}>{user?.email || 'No email available'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    width: '85%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
