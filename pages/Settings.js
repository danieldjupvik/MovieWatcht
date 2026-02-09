import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActionSheetIOS
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import i18n from 'i18n-js';
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
import { useAppearance } from '../components/AppearanceContext';

const Settings = ({ navigation }) => {
  const [sessionId, setSessionId] = useState();

  const { colorScheme } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
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

  const openActionSheet = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [i18n.t('cancel'), i18n.t('logout')],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: i18n.t('areYouSure'),
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          logout();
        }
      }
    );

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
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <View style={[styles.container, themeContainerStyle]}>
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
              <TouchableOpacity onPress={openActionSheet}>
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
      </View>
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
