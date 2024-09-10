import { useUser } from '@clerk/clerk-expo';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useFireUser } from '../../context/UserContext';

export default function Profile() {
  
  const { user } = useUser();
  const { fireUser } = useFireUser();

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: fireUser?.photoURL || user?.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.displayName}>{user?.fullName || fireUser?.displayName || 'No Name Provided'}</Text>
      <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress || fireUser?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#606060',
  },
});
