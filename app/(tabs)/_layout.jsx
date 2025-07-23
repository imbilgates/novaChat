import { Tabs } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import Signout from '../../src/components/auth/Signout';
import CreateGroupModal from '../../src/components/modal/CreateGroupModal';
import { useFireUser } from '../../src/context/UserContext';

const _Layout = () => {
  const { openGrp, setOpenGrp } = useFireUser();

  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            headerTitleAlign: 'left',
            headerRight: () => (
              <MaterialCommunityIcons name="account-group" size={24} color="black" onPress={() => setOpenGrp(true)} style={{ marginRight: 15 }} />
            ),
            title: 'Chats',
            tabBarIcon: ({ focused, color }) => (
              <AntDesign name="home" color={color} size={24} />
            ),
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTintColor: styles.headerTintColor.color,
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            title: 'Search',
            tabBarIcon: ({ focused, color }) => (
              <AntDesign name="search1" color={color} size={24} />
            ),
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTintColor: styles.headerTintColor.color,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerRight: () => <Signout />,
            tabBarIcon: ({ focused, color }) => (
              <AntDesign name="user" color={color} size={24} />
            ),
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerTintColor: styles.headerTintColor.color,
          }}
        />
      </Tabs>

      {/* Group Creation Modal */}
      <CreateGroupModal openGrp={openGrp} setOpenGrp={setOpenGrp} />
    </>
  );
};

export default _Layout;



const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFFFFF',
    height: 100,
  },
  headerTitleStyle: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 25,
  },
  headerTintColor: {
    color: '#FFFFFF',
  },
  search: {
    marginRight: 25,
  }
});



