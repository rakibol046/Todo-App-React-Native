import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Incomplete from './Incomplete';
import Complete from './Complete';
// import Home from './Home';
// import Profile from './Profile';
const Tab = createMaterialTopTabNavigator();

export default ({navigation, route}) => {
  console.log('token from props', route.params.token);
  return (
    <>
      <Text style={styles.sectionTitle}>Your tasks</Text>
      <Tab.Navigator
        screenOptions={
          {
            // tabBarShowLabel: false,
            // tabBarStyle: [
            //   {
            //     backgroundColor: 'white',
            //     position: 'absolute',
            //     left: 0,
            //     top: 45,
            //     right: 0,
            //     // elevation: 0,
            //     // borderRadius: 15,
            //     // borderTopLeftRadius: 17,
            //     // borderTopRightRadius: 17,
            //     // height: 90,
            //   },
            //   null,
            // ],
          }
        }>
        <Tab.Screen
          name="Incomplete"
          component={Incomplete}
          initialParams={{token: route.params.token}}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Complete"
          component={Complete}
          initialParams={{token: route.params.token}}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    padding: 15,
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#009387',
    color: 'white',
    // textAlign: 'center'
  },
});
