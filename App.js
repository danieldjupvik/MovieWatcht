import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { backgroundColor } from './pages/Home';

import Home from './pages/Home';
import Details from './pages/Details';
import Settings from './pages/Settings';
import Login from './pages/Login';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='Details'
            component={Details}
            options={({ route }) => ({
              title: route.params.headerTitle,
              headerBackTitle: '',
              headerStyle: {
                backgroundColor: backgroundColor,
                shadowColor: 'transparent',
              },
              headerTransparent: false,
              headerTintColor: 'white',
            })}
          />
          <Stack.Screen
            name='Settings'
            component={Settings}
            options={{
              headerBackTitle: '',
              headerStyle: {
                backgroundColor: backgroundColor,
                shadowColor: 'transparent',
              },
              headerTransparent: false,
              headerTintColor: 'white',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    // justifyContent: 'center',
    color: 'white',
  },
});
