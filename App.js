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
import About from './pages/About';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translationsEN from './language/en/translation.json';
import translationsNB from './language/nb/translation.json';

const Stack = createStackNavigator();

i18n.translations = {
  nb: translationsNB,
  en: translationsEN,
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

export default function App() {
  return (
    <>
      <NavigationContainer>
        <StatusBar barStyle='light-content' />
        <Stack.Navigator initialRouteName='Home'>
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
              headerBackTitle: i18n.t('back'),
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
            options={({ route }) => ({
              title: route.params.headerTitle,
              headerBackTitle: i18n.t('back'),
              headerStyle: {
                backgroundColor: backgroundColor,
                shadowColor: 'transparent',
              },
              headerTransparent: false,
              headerTintColor: 'white',
            })}
          />
          <Stack.Screen
            name='About'
            component={About}
            options={{
              headerBackTitle: i18n.t('back'),
              headerStyle: {
                backgroundColor: backgroundColor,
                shadowColor: 'transparent',
              },
              headerTransparent: false,
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name='Login'
            component={Login}
            options={{
              headerBackTitle: i18n.t('back'),
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
