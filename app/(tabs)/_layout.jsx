import { router, Tabs } from 'expo-router';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Pressable } from 'react-native';
import Signout from '../../components/Signout';

export default function TabLayout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerTitleAlign: 'left',
          headerRight: () => <Search />,
          title: 'Chats',
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name={focused ? 'home' : 'home'} color={color} size={24} />
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
            <AntDesign name={focused ? 'search1' : 'search1'} color={color} size={24} />
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
          headerRight: ()=> <Signout /> ,
          tabBarIcon: ({ focused, color }) => (
            <AntDesign name={focused ? 'user' : 'user'} color={color} size={24} />
          ),

          headerStyle: styles.headerStyle,
          headerTitleStyle: styles.headerTitleStyle,
          headerTintColor: styles.headerTintColor.color,
        }}
      />
    </Tabs>
  );
}

const Search = () => {
    
  return (
      <View style={styles.search}>
          <Pressable onPress={() => router.replace('search')}>
              <AntDesign name="search1" size={23} color="black" />
          </Pressable>
      </View>
  )
}


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



