import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

const Index = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  return <Redirect href={isSignedIn ? '/(tabs)' : '/auth'} />;
};

export default Index;
