import React from 'react';
import { StyleSheet, StatusBar, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from 'expo-blur';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

i18n.translations = {
  nb: translationsNB,
  en: translationsEN,
};
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  const colorScheme = useColorScheme();
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
  const colorScheme = useColorScheme();
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
  const colorScheme = useColorScheme();
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

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  const colorScheme = useColorScheme();
  const themeHeaderTintColor = colorScheme === 'light' ? 'black' : 'white';
  const themeContainerStyle =
    colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={Settings}
        options={() => ({
          title: i18n.t('settings'),
          headerBackTitle: i18n.t('back'),
          headerStyle: {
            backgroundColor: themeContainerStyle,
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
            backgroundColor: themeContainerStyle,
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
            backgroundColor: themeContainerStyle,
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
  const colorScheme = useColorScheme();
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
        <View style={[styles.androidNavBar, themeContainerStyle]}>
          <BottomTabBar {...props} />
        </View>
      );
    }
  };
  return (
    <>
      <AppearanceProvider>
        <StatusBar barStyle={themeStatusBarStyle} />
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

    // opacity: 0.9,
  },
});
