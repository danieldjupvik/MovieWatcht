import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, Platform, View, Button, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translationsEN from './language/en/translation.json';
import translationsNB from './language/nb/translation.json';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from './colors/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import Home from './pages/Home';
import Series from './pages/series';
import Details from './pages/Details';
import SeriesDetails from './pages/SeriesDetails';
import SeriesSeason from './pages/SeriesSeason';
import Settings from './pages/Settings';
import Login from './pages/Login';
import About from './pages/About';
import PersonDetails from './pages/PersonDetails';
import Account from './pages/Account';
import watchList from './pages/WatchList';
import Appearance from './pages/Appearance';
import ContentSettings from './pages/ContentSettings';
import Region from './pages/Region';
import Adult from './pages/Adult';
import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { RegionProvider } from './components/RegionContext';

const Tab = createBottomTabNavigator();

i18n.translations = {
  nb: translationsNB,
  en: translationsEN,
};

i18n.locale = Localization.getLocales()[0]?.languageTag;
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
        name='SeriesDetails'
        component={SeriesDetails}
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

const seriesStack = createStackNavigator();

function seriesStackScreen() {
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
    <seriesStack.Navigator>
      <seriesStack.Screen
        name='series'
        component={Series}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <seriesStack.Screen
        name='SeriesDetails'
        component={SeriesDetails}
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
      <seriesStack.Screen
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
      <seriesStack.Screen
        name='SeriesSeason'
        component={SeriesSeason}
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
      <seriesStack.Screen
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
    </seriesStack.Navigator>
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
  const iconColor = colorScheme === 'light' ? 'black' : 'white';

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
        initialParams={{ color: iconColor }}
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
  const iconColor = colorScheme === 'light' ? 'black' : 'white';
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
        initialParams={{ color: iconColor }}
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
      <SettingsStack.Screen
        name='Adult'
        component={Adult}
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
  const themeTabBarStyle =
    colorScheme === 'light' ? styles.tabBarStyleLight : styles.tabBarStyleDark;
  const themeTabBarStyleAndroid =
    colorScheme === 'light'
      ? styles.tabBarStyleLightAndroid
      : styles.tabBarStyleDarkAndroid;

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
      <RegionProvider>
          <StatusBar backgroundColor='black' barStyle={themeStatusBarStyle} />
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName='Home'
              tabBar={TabBar}
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Home') {
                    iconName = focused ? 'film' : 'film-outline';
                  } else if (route.name === 'series') {
                    iconName = focused ? 'tv' : 'tv-outline';
                  } else if (route.name === 'watchList') {
                    iconName = focused
                      ? 'bookmark'
                      : 'bookmark-outline';
                  } else if (route.name === 'settings') {
                    iconName = focused
                      ? 'settings'
                      : 'settings-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle:
                  Platform.OS === 'ios'
                    ? themeTabBarStyle
                    : themeTabBarStyleAndroid,
              })}
            >
              <Tab.Screen
                name='Home'
                options={{
                  tabBarLabel: i18n.t('movies'),
                }}
                component={HomeStackScreen}
                listeners={() => ({
                  tabPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  },
                })}
              />
              <Tab.Screen
                name='series'
                options={{
                  tabBarLabel: i18n.t('series'),
                }}
                component={seriesStackScreen}
                listeners={() => ({
                  tabPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  },
                })}
              />
              <Tab.Screen
                name='watchList'
                options={{
                  tabBarLabel: i18n.t('watchList'),
                }}
                component={watchListStackScreen}
                listeners={() => ({
                  tabPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  },
                })}
              />
              <Tab.Screen
                name='settings'
                options={{
                  tabBarLabel: i18n.t('settings'),
                }}
                component={SettingsStackScreen}
                listeners={() => ({
                  tabPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  },
                })}
              />
            </Tab.Navigator>
          </NavigationContainer>
      </RegionProvider>
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
  tabBarStyleLight: {
    borderTopColor: 'transparent',
    backgroundColor: 'transparent',
  },
  tabBarStyleDark: {
    borderTopColor: 'transparent',
    backgroundColor: 'transparent',
  },
  tabBarStyleLightAndroid: {
    borderTopColor: 'transparent',
    backgroundColor: backgroundColorLight,
  },
  tabBarStyleDarkAndroid: {
    borderTopColor: 'transparent',
    backgroundColor: backgroundColorDark,
    height: 55,
    paddingBottom: 5,
  },
});
