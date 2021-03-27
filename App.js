import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Details from './pages/Details';
import Settings from './pages/Settings';
import Login from './pages/Login';
import About from './pages/About';
import TopRated from './pages/TopRated';
import upcoming from './pages/Upcoming';
import PersonDetails from './pages/PersonDetails';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translationsEN from './language/en/translation.json';
import translationsNB from './language/nb/translation.json';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from './colors/colors';

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
  const colorScheme = useColorScheme();
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeStatusBarStyle =
    colorScheme === 'light' ? 'dark-content' : 'light-content';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <>
      <AppearanceProvider>
        <NavigationContainer>
          <StatusBar barStyle={themeStatusBarStyle} />
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen
              name='Home'
              component={Home}
              options={{
                headerShown: false,
                animationEnabled: false,
              }}
            />
            <Stack.Screen
              name='topRated'
              component={TopRated}
              options={{
                headerShown: false,
                animationEnabled: false,
              }}
            />
            <Stack.Screen
              name='upcoming'
              component={upcoming}
              options={{
                headerShown: false,
                animationEnabled: false,
              }}
            />
            <Stack.Screen
              name='Details'
              component={Details}
              options={({ route }) => ({
                title: route.params.headerTitle,
                headerBackTitle: i18n.t('back'),
                headerStyle: {
                  backgroundColor: themeContainerStyle,
                  shadowColor: 'transparent',
                },
                headerTransparent: false,
                headerTintColor: themeHeaderTintColor,
              })}
            />
            <Stack.Screen
              name='PersonDetails'
              component={PersonDetails}
              options={({ route }) => ({
                title: route.params.headerTitle,
                headerBackTitle: i18n.t('back'),
                headerStyle: {
                  backgroundColor: themeContainerStyle,
                  shadowColor: 'transparent',
                },
                headerTransparent: false,
                headerTintColor: themeHeaderTintColor,
              })}
            />
            <Stack.Screen
              name='Settings'
              component={Settings}
              options={({ route }) => ({
                title: route.params.headerTitle,
                headerBackTitle: i18n.t('back'),
                headerStyle: {
                  backgroundColor: themeContainerStyle,
                  shadowColor: 'transparent',
                },
                headerTransparent: false,
                headerTintColor: themeHeaderTintColor,
              })}
            />
            <Stack.Screen
              name='About'
              component={About}
              options={({ route }) => ({
                title: route.params.headerTitle,
                headerBackTitle: i18n.t('back'),
                headerStyle: {
                  backgroundColor: themeContainerStyle,
                  shadowColor: 'transparent',
                },
                headerTransparent: false,
                headerTintColor: themeHeaderTintColor,
              })}
            />
            <Stack.Screen
              name='Login'
              component={Login}
              options={({ route }) => ({
                title: route.params.headerTitle,
                headerBackTitle: i18n.t('back'),
                headerStyle: {
                  backgroundColor: themeContainerStyle,
                  shadowColor: 'transparent',
                },
                headerTransparent: false,
                headerTintColor: themeHeaderTintColor,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppearanceProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: backgroundColorLight,
  },
  darkContainer: {
    backgroundColor: backgroundColorDark,
  },
  lightThemeText: {
    color: textColorLight,
  },
  darkThemeText: {
    color: textColorDark,
  },
});
