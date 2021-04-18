import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView,ActionSheetIOS } from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import i18n from 'i18n-js';
import { useColorScheme } from 'react-native-appearance';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
  primaryButton,
  secondaryButton,
} from '../colors/colors';
import axios from 'axios';
import { apiKey } from '../settings/api';
import { borderRadius } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const [sessionId, setSessionId] = useState();
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          console.log(value);
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
  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;
  const themeButtonStyle =
    colorScheme === 'light' ? styles.darkThemeBox : styles.lightThemeBox;
  const themeButtonTextStyle =
    colorScheme === 'light' ? styles.darkThemeText : styles.lightThemeText;

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('sessionId');
        if (value !== null) {
          setSessionId(value);
        } else {
          console.log('there is no login credit');
        }
      } catch (e) {
        alert('error reading value');
      }
    };
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('sessionId');
      if (value !== null) {
        setSessionId(value);
      } else {
        setSessionId('');
        console.log('there is no login credit');
      }
    } catch (e) {
      alert('error reading value');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('sessionId');
      setSessionId('');
      deleteSession();
    } catch (e) {
      // remove error
    }
    console.log('Done.');
  };

  const deleteSession = async () => {
    console.log('logged out');
    try {
      const response = await axios({
        method: 'DELETE',
        url: `https://api.themoviedb.org/3/authentication/session${apiKey}`,
        headers: {},
        data: {
          session_id: sessionId,
        },
      });
      console.log(response.data);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  useEffect(() => {
    const subscribed = navigation.addListener('focus', () => {
      console.log(sessionId);
      getData();
      return subscribed;
    });
  }, [sessionId]);

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={[styles.listHeading, themeTextStyle]}>
                {i18n.t('mainSettings')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.touchableElem}
              onPress={() =>
                navigation.navigate('About', {
                  headerTitle: i18n.t('about'),
                })
              }
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('about')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('aboutDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'question-circle'}
                    solid
                    style={[themeTextStyle, { fontSize: iconSize }]}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchableElem}
              onPress={() =>
                navigation.navigate('Appearance', {
                  headerTitle: i18n.t('appearance'),
                })
              }
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('appearance')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('appearanceDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'paint-brush'}
                    solid
                    style={[themeTextStyle, { fontSize: iconSize }]}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchableElem}
              onPress={() =>
                navigation.navigate('ContentSettings', {
                  headerTitle: i18n.t('contentSettings'),
                })
              }
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('contentSettings')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('contentDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'globe'}
                    solid
                    style={[themeTextStyle, { fontSize: iconSize }]}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.listHeadingElement}>
              <Text style={[styles.listHeading, themeTextStyle]}>
                {i18n.t('accountSettings')}
              </Text>
            </View>

            {sessionId ? (
              <TouchableOpacity
                style={styles.touchableElem}
                onPress={() =>
                  navigation.navigate('Account', {
                    headerTitle: i18n.t('account'),
                  })
                }
              >
                <View style={[styles.listElement, themeBoxStyle]}>
                  <View style={styles.iconElement}>
                    <View>
                      <Text style={[styles.text, themeTextStyle]}>
                        {i18n.t('account')}
                      </Text>
                      <Text style={[styles.textDescription, themeTextStyle]}>
                        {i18n.t('accountDescription')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightArrow}>
                    <FontAwesome5
                      name={'user-circle'}
                      solid
                      style={[themeTextStyle, { fontSize: iconSize }]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}

            {sessionId ? (
              <TouchableOpacity onPress={logout}>
                <View style={[styles.listElement, styles.logoutButton]}>
                  <View style={styles.iconElement}>
                    <View>
                      <Text style={[styles.text]}>{i18n.t('logout')}</Text>
                    </View>
                  </View>

                  <View style={styles.rightArrow}>
                    <FontAwesome5
                      name={'sign-in-alt'}
                      solid
                      style={[{ color: 'black' }, { fontSize: iconSize }]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Login', {
                    headerTitle: i18n.t('login'),
                  })
                }
              >
                <View style={[styles.listElement, styles.logoutButton]}>
                  <View style={styles.iconElement}>
                    <View>
                      <Text style={[styles.text]}>{i18n.t('login')}</Text>
                    </View>
                  </View>

                  <View style={styles.rightArrow}>
                    <FontAwesome5
                      name={'sign-in-alt'}
                      solid
                      style={[{ color: 'black' }, { fontSize: iconSize }]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const iconSize = 21;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  listElement: {
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius,
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 18.5,
    fontWeight: '400',
  },
  textDescription: {
    opacity: 0.7,
    marginTop: 5,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: primaryButton,
  },

  icon: {
    marginRight: 12,
  },
  listHeading: {
    opacity: 0.7,
    fontSize: 20,
    fontWeight: '600',
  },
  listHeadingElement: {
    marginTop: 20,
    paddingBottom: 15,
  },
  rightArrow: {
    paddingRight: 15,
  },
  touchableElem: {
    width: '100%',
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
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
});

export default Settings;
