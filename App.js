import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import * as Haptics from 'expo-haptics';
import i18n from './language/i18n';
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
import WatchList from './pages/WatchList';
import Appearance from './pages/Appearance';
import ContentSettings from './pages/ContentSettings';
import Region from './pages/Region';
import Adult from './pages/Adult';

import { RegionProvider } from './components/RegionContext';
import { AppearanceProvider, useAppearance } from './components/AppearanceContext';
import ErrorBoundary from './components/ErrorBoundary';

const Tab = createNativeBottomTabNavigator();

function useHeaderTheme() {
  const { colorScheme } = useAppearance();
  const headerTintColor = colorScheme === 'light' ? 'black' : 'white';
  const headerBg = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;
  return { headerTintColor, headerBg };
}

function themedScreenOptions(headerBg, headerTintColor) {
  return {
    headerShadowVisible: false,
    headerStyle: { backgroundColor: headerBg },
    headerTintColor,
  };
}

function themedRouteOptions(headerBg, headerTintColor) {
  return ({ route, navigation }) => {
    const state = navigation.getState();
    const idx = state.routes.findIndex((r) => r.key === route.key);
    const prevTitle = idx > 0 ? state.routes[idx - 1]?.params?.headerTitle : undefined;
    return {
      title: route.params.headerTitle,
      ...(prevTitle?.length > 20 && { headerBackTitle: prevTitle.slice(0, 18) + '…' }),
      ...themedScreenOptions(headerBg, headerTintColor),
    };
  };
}

const HomeStack = createNativeStackNavigator();
function HomeStackScreen() {
  const { headerTintColor, headerBg } = useHeaderTheme();
  const baseOptions = themedScreenOptions(headerBg, headerTintColor);
  const routeOptions = themedRouteOptions(headerBg, headerTintColor);

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name='HomeScreen'
        component={Home}
        options={{ title: i18n.t('movies'), headerTitleAlign: 'left', ...baseOptions, animation: 'none' }}
      />
      <HomeStack.Screen name='Details' component={Details} options={routeOptions} />
      <HomeStack.Screen name='SeriesDetails' component={SeriesDetails} options={routeOptions} />
      <HomeStack.Screen name='PersonDetails' component={PersonDetails} options={routeOptions} />
    </HomeStack.Navigator>
  );
}

const SeriesStack = createNativeStackNavigator();

function SeriesStackScreen() {
  const { headerTintColor, headerBg } = useHeaderTheme();
  const baseOptions = themedScreenOptions(headerBg, headerTintColor);
  const routeOptions = themedRouteOptions(headerBg, headerTintColor);

  return (
    <SeriesStack.Navigator>
      <SeriesStack.Screen
        name='SeriesScreen'
        component={Series}
        options={{ title: i18n.t('series'), headerTitleAlign: 'left', ...baseOptions, animation: 'none' }}
      />
      <SeriesStack.Screen name='SeriesDetails' component={SeriesDetails} options={routeOptions} />
      <SeriesStack.Screen name='Details' component={Details} options={routeOptions} />
      <SeriesStack.Screen name='SeriesSeason' component={SeriesSeason} options={routeOptions} />
      <SeriesStack.Screen name='PersonDetails' component={PersonDetails} options={routeOptions} />
    </SeriesStack.Navigator>
  );
}

const SearchStack = createNativeStackNavigator();

function SearchStackScreen() {
  const { headerTintColor, headerBg } = useHeaderTheme();
  const baseOptions = themedScreenOptions(headerBg, headerTintColor);
  const routeOptions = themedRouteOptions(headerBg, headerTintColor);

  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name='SearchScreen'
        component={Search}
        options={{
          title: '',
          headerLargeTitle: false,
          headerSearchBarOptions: {
            placeholder: i18n.t('searchAll'),
            placement: 'automatic',
            allowToolbarIntegration: true,
          },
          ...baseOptions,
          animation: 'none',
        }}
      />
      <SearchStack.Screen name='Details' component={Details} options={routeOptions} />
      <SearchStack.Screen name='SeriesDetails' component={SeriesDetails} options={routeOptions} />
      <SearchStack.Screen name='SeriesSeason' component={SeriesSeason} options={routeOptions} />
      <SearchStack.Screen name='PersonDetails' component={PersonDetails} options={routeOptions} />
    </SearchStack.Navigator>
  );
}

const WatchListStack = createNativeStackNavigator();

function WatchListStackScreen() {
  const { headerTintColor, headerBg } = useHeaderTheme();
  const baseOptions = themedScreenOptions(headerBg, headerTintColor);
  const routeOptions = themedRouteOptions(headerBg, headerTintColor);

  return (
    <WatchListStack.Navigator>
      <WatchListStack.Screen
        name='WatchListScreen'
        component={WatchList}
        options={{ title: i18n.t('watchList'), headerLargeTitle: true, ...baseOptions, animation: 'none' }}
      />
      <WatchListStack.Screen name='Details' component={Details} options={routeOptions} />
      <WatchListStack.Screen name='PersonDetails' component={PersonDetails} options={routeOptions} />
      <WatchListStack.Screen
        name='Login'
        component={Login}
        initialParams={{ color: headerTintColor }}
        options={routeOptions}
      />
    </WatchListStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  const { headerTintColor, headerBg } = useHeaderTheme();
  const baseOptions = themedScreenOptions(headerBg, headerTintColor);
  const routeOptions = themedRouteOptions(headerBg, headerTintColor);

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={Settings}
        options={{ title: i18n.t('settings'), headerLargeTitle: true, ...baseOptions }}
      />
      <SettingsStack.Screen name='About' component={About} options={routeOptions} />
      <SettingsStack.Screen
        name='Login'
        component={Login}
        initialParams={{ color: headerTintColor }}
        options={routeOptions}
      />
      <SettingsStack.Screen name='Account' component={Account} options={routeOptions} />
      <SettingsStack.Screen name='Appearance' component={Appearance} options={routeOptions} />
      <SettingsStack.Screen name='ContentSettings' component={ContentSettings} options={routeOptions} />
      <SettingsStack.Screen name='Region' component={Region} options={routeOptions} />
      <SettingsStack.Screen name='Adult' component={Adult} options={routeOptions} />
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
      <ErrorBoundary>
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
      </ErrorBoundary>
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
