import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from 'expo-blur';

import Home from './pages/Home';
import Details from './pages/Details';
import Settings from './pages/Settings';
import Login from './pages/Login';
import About from './pages/About';
import TopRated from './pages/TopRated';
import upcoming from './pages/Upcoming';
import PersonDetails from './pages/PersonDetails';
import Account from './pages/Account';
import watchList from './pages/WatchList';
import Appearance from './pages/Appearance';
import ContentSettings from './pages/ContentSettings';
import Region from './pages/Region';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

i18n.translations = {
  nb: translationsNB,
  en: translationsEN,
};

// Localization.locale;

i18n.locale = 'en';
i18n.fallbacks = true;

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <HomeStack.Screen
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
      <HomeStack.Screen
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
    </HomeStack.Navigator>
  );
}

const topRatedStack = createStackNavigator();

function topRatedStackScreen() {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <topRatedStack.Navigator>
      <topRatedStack.Screen
        name='topRated'
        component={TopRated}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <topRatedStack.Screen
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
      <topRatedStack.Screen
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
    </topRatedStack.Navigator>
  );
}

const upcomingStack = createStackNavigator();

function upcomingStackScreen() {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <upcomingStack.Navigator>
      <upcomingStack.Screen
        name='upcoming'
        component={upcoming}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <upcomingStack.Screen
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
      <upcomingStack.Screen
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
    </upcomingStack.Navigator>
  );
}

const watchListStack = createStackNavigator();

function watchListStackScreen() {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;
  const themeBoxStyle =
    colorScheme === 'light'
      ? styles.lightThemeBox.backgroundColor
      : styles.darkThemeBox.backgroundColor;

  return (
    <watchListStack.Navigator>
      <watchListStack.Screen
        name='watchList'
        component={watchList}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <watchListStack.Screen
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
      <watchListStack.Screen
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
      <watchListStack.Screen
        name='Login'
        component={Login}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </watchListStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeBoxStyle =
    colorScheme === 'light'
      ? styles.lightThemeBox.backgroundColor
      : styles.darkThemeBox.backgroundColor;

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={Settings}
        options={() => ({
          title: i18n.t('settings'),
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SettingsStack.Screen
        name='About'
        component={About}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SettingsStack.Screen
        name='Login'
        component={Login}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SettingsStack.Screen
        name='Account'
        component={Account}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SettingsStack.Screen
        name='Appearance'
        component={Appearance}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SettingsStack.Screen
        name='ContentSettings'
        component={ContentSettings}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SettingsStack.Screen
        name='Region'
        component={Region}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
            shadowColor: 'transparent',
          },
          headerTransparent: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeTabBar = colorScheme === 'light' ? 'light' : 'dark';
  const themeStatusBarStyle =
    colorScheme === 'light' ? 'dark-content' : 'light-content';
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const TabBar = (props) => {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          tint={themeTabBar}
          intensity={100}
        >
          <BottomTabBar {...props} />
        </BlurView>
      );
    } else {
      return (
        <View style={styles.androidNavBar}>
          <BottomTabBar {...props} />
        </View>
      );
    }
  };

  return (
    <>
      <AppearanceProvider>
        <StatusBar backgroundColor='black' barStyle={themeStatusBarStyle} />
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName='Home'
            tabBar={TabBar}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = 'fire';
                } else if (route.name === 'topRated') {
                  iconName = 'medal';
                } else if (route.name === 'upcoming') {
                  iconName = 'newspaper';
                } else if (route.name === 'settings') {
                  iconName = 'sliders-h';
                } else if (route.name === 'watchList') {
                  iconName = 'bookmark';
                }

                return (
                  <FontAwesome5
                    name={iconName}
                    solid
                    style={{ color: color, fontSize: size }}
                  />
                );
              },
            })}
            tabBarOptions={{
              activeTintColor: 'red',
              inactiveTintColor: 'gray',
              showLabel: Platform.OS !== 'android',
              style: {
                borderTopColor: 'transparent',
                backgroundColor: 'transparent',
              },
            }}
          >
            <Tab.Screen
              name='Home'
              options={{
                tabBarLabel: i18n.t('popular'),
              }}
              component={HomeStackScreen}
            />
            <Tab.Screen
              name='topRated'
              options={{
                tabBarLabel: i18n.t('topRated'),
              }}
              component={topRatedStackScreen}
            />
            <Tab.Screen
              name='upcoming'
              options={{
                tabBarLabel: i18n.t('upcoming'),
              }}
              component={upcomingStackScreen}
            />
            <Tab.Screen
              name='watchList'
              options={{
                tabBarLabel: i18n.t('watchList'),
              }}
              component={watchListStackScreen}
            />
            <Tab.Screen
              name='settings'
              options={{
                tabBarLabel: i18n.t('settings'),
              }}
              component={SettingsStackScreen}
            />
          </Tab.Navigator>
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
  androidNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
});
