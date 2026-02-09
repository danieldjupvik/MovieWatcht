import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translationsEN from './language/en/translation.json';
import translationsNB from './language/nb/translation.json';
import {
  backgroundColorDark,
  backgroundColorLight,
} from './colors/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Home from './pages/Home';
import Series from './pages/series';
import Search from './pages/Search';
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

import { RegionProvider } from './components/RegionContext';
import { AppearanceProvider, useAppearance } from './components/AppearanceContext';

const Tab = createNativeBottomTabNavigator();

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
        name='HomeScreen'
        component={Home}
        options={{
          title: i18n.t('movies'),
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: themeContainerStyle },
          headerTintColor: themeHeaderTintColor,
          animation: 'none',
        }}
      />
      <HomeStack.Screen
        name='Details'
        component={Details}
        options={({ route }) => ({
          title: route.params.headerTitle,
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
        name='SeriesScreen'
        component={Series}
        options={{
          title: i18n.t('series'),
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: themeContainerStyle },
          headerTintColor: themeHeaderTintColor,
          animation: 'none',
        }}
      />
      <SeriesStack.Screen
        name='SeriesDetails'
        component={SeriesDetails}
        options={({ route }) => ({
          title: route.params.headerTitle,
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

const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  const { colorScheme } = useAppearance();
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name='SearchScreen'
        component={Search}
        options={{
          title: i18n.t('searchAll'),
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: themeContainerStyle },
          headerTintColor: themeHeaderTintColor,
          animation: 'none',
        }}
      />
      <SearchStack.Screen
        name='Details'
        component={Details}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SearchStack.Screen
        name='SeriesDetails'
        component={SeriesDetails}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SearchStack.Screen
        name='SeriesSeason'
        component={SeriesSeason}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
      <SearchStack.Screen
        name='PersonDetails'
        component={PersonDetails}
        options={({ route }) => ({
          title: route.params.headerTitle,
          headerStyle: {
            backgroundColor: themeContainerStyle,
          },
          headerShadowVisible: false,
          headerTintColor: themeHeaderTintColor,
        })}
      />
    </SearchStack.Navigator>
  );
}

const WatchListStack = createNativeStackNavigator();

function WatchListStackScreen() {
  const { colorScheme } = useAppearance();
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;
  const iconColor = colorScheme === 'light' ? 'black' : 'white';

  return (
    <WatchListStack.Navigator>
      <WatchListStack.Screen
        name='WatchListScreen'
        component={watchList}
        options={{
          title: i18n.t('watchList'),
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: themeContainerStyle },
          headerTintColor: themeHeaderTintColor,
          animation: 'none',
        }}
      />
      <WatchListStack.Screen
        name='Details'
        component={Details}
        options={({ route }) => ({
          title: route.params.headerTitle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
  const iconColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={Settings}
        options={() => ({
          title: i18n.t('settings'),
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
  const themeStatusBarStyle =
    colorScheme === 'light' ? 'dark-content' : 'light-content';

  const isDark = colorScheme === 'dark';
  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: isDark ? backgroundColorDark : backgroundColorLight,
      card: isDark ? backgroundColorDark : backgroundColorLight,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RegionProvider>
          <StatusBar backgroundColor='black' barStyle={themeStatusBarStyle} />
          <NavigationContainer theme={navTheme}>
            <Tab.Navigator
              initialRouteName='Home'
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'gray',
                tabBarMinimizeBehavior: 'onScrollDown',
              }}
            >
              <Tab.Screen
                name='Home'
                options={{
                  tabBarIcon: ({ focused }) => ({
                    type: 'sfSymbol',
                    name: focused ? 'movieclapper.fill' : 'movieclapper',
                  }),
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
                  tabBarIcon: ({ focused }) => ({
                    type: 'sfSymbol',
                    name: focused ? 'tv.fill' : 'tv',
                  }),
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
                name='search'
                options={{
                  tabBarSystemItem: 'search',
                }}
                component={SearchStackScreen}
                listeners={() => ({
                  tabPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  },
                })}
              />
              <Tab.Screen
                name='watchList'
                options={{
                  tabBarSystemItem: 'bookmarks',
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
                  tabBarSystemItem: 'more',
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
