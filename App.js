import React from 'react';
import { StyleSheet, StatusBar, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
} from './colors/colors';
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

import { RegionProvider } from './components/RegionContext';
import { AppearanceProvider, useAppearance } from './components/AppearanceContext';

const Tab = createBottomTabNavigator();

i18n.translations = {
  nb: translationsNB,
  en: translationsEN,
};

i18n.locale = Localization.getLocales()[0]?.languageTag;
i18n.fallbacks = true;

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  const { colorScheme } = useAppearance();
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
          animation: 'none',
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </HomeStack.Navigator>
  );
}

const SeriesStack = createNativeStackNavigator();

function SeriesStackScreen() {
  const { colorScheme } = useAppearance();
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <SeriesStack.Navigator>
      <SeriesStack.Screen
        name='series'
        component={Series}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <SeriesStack.Screen
        name='SeriesDetails'
        component={SeriesDetails}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SeriesStack.Screen
        name='Details'
        component={Details}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SeriesStack.Screen
        name='SeriesSeason'
        component={SeriesSeason}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SeriesStack.Screen
        name='PersonDetails'
        component={PersonDetails}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </SeriesStack.Navigator>
  );
}

const WatchListStack = createNativeStackNavigator();

function WatchListStackScreen() {
  const { colorScheme } = useAppearance();
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;
  const themeBoxStyle =
    colorScheme === 'light'
      ? styles.lightThemeBox.backgroundColor
      : styles.darkThemeBox.backgroundColor;
  const iconColor = colorScheme === 'light' ? 'black' : 'white';

  return (
    <WatchListStack.Navigator>
      <WatchListStack.Screen
        name='watchList'
        component={watchList}
        options={{
          headerShown: false,
          animation: 'none',
        }}
      />
      <WatchListStack.Screen
        name='Details'
        component={Details}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <WatchListStack.Screen
        name='PersonDetails'
        component={PersonDetails}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <WatchListStack.Screen
        name='Login'
        component={Login}
        initialParams={{ color: iconColor }}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeBoxStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </WatchListStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  const { colorScheme } = useAppearance();
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
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
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </SettingsStack.Navigator>
  );
}

function AppContent() {
  const { colorScheme } = useAppearance();
  const themeTabBar = colorScheme === 'light' ? 'light' : 'dark';
  const themeStatusBarStyle =
    colorScheme === 'light' ? 'dark-content' : 'light-content';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                component={SeriesStackScreen}
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
                component={WatchListStackScreen}
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
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AppContent />
    </AppearanceProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  lightContainer: {
    backgroundColor: backgroundColorLight,
  },
  darkContainer: {
    backgroundColor: backgroundColorDark,
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
