import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useFireUser } from '../context/UserContext';
import { useUser } from '@clerk/clerk-expo';


export const UserProfile = () => {

  const { fireUser } = useFireUser();
  const { user } = useUser();


  const isLoaded = true;

  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.imageUrl || fireUser?.photoURL }}
          style={styles.profileImage}
        />
        <Text style={styles.displayName}>{user?.fullName || fireUser?.displayName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  displayName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
