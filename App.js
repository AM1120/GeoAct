import React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Statistics from './screens/Statistics';
import Search from './screens/Search';
import Settings from './screens/Settings';
import MetaPOA from './screens/MetaPOA';


export default function App() {
  const Tab = createBottomTabNavigator();
  function MyTab() {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen 
      name="Statistics" 
      component={Statistics} 
      options={{
        tabBarIcon: ({color, size})=>(
          <Image source={require('./assets/Icongrafic.png')} style={{tintColor: color, width: size, height: size}} />
        )}} />

      <Tab.Screen 
      name="MetaPOA" 
      component={MetaPOA}
      options={{
        tabBarIcon: ({color, size})=>(
          <Image source={require('./assets/IconPOA.png')} style={{tintColor: color, width: size, height: size}} />
        )}} /> 

      <Tab.Screen 
      name="Home" 
      component={Home}
      options={{
        tabBarIcon: ({color, size})=>(
          <Image source={require('./assets/IconSuma.png')} style={{tintColor: color, width: size, height: size}} />
        )}} />
      
      <Tab.Screen 
      name="Search" 
      component={Search}
      options={{
        tabBarIcon: ({color, size})=>(
          <Image source={require('./assets/IconLupa.png')} style={{tintColor: color, width: size, height: size}} />
        )}} />

      <Tab.Screen 
      name="Settings" 
      component={Settings}
      options={{
        tabBarIcon: ({color, size})=>(
          <Image source={require('./assets/IconAjuste.png')} style={{tintColor: color, width: size, height: size}} />
        )}} /> 
    </Tab.Navigator>
  );
}

return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}

