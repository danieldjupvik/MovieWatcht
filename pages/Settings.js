import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
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
} from '../colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {
  const [sessionId, setSessionId] = useState();
  const colorScheme = useColorScheme();
  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

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
    } catch (e) {
      // remove error
    }
    console.log('Done.');
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
              <Text style={styles.listHeading}>{i18n.t('mainSettings')}</Text>
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
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
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
                    </View>
                  </View>

                  <View style={styles.rightArrow}>
                    <FontAwesome5
                      name={'chevron-right'}
                      solid
                      style={{ color: 'grey', fontSize: 20 }}
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
                      <Text style={[styles.text, themeTextStyle]}>
                        {i18n.t('logout')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightArrow}>
                    <FontAwesome5
                      name={'chevron-right'}
                      solid
                      style={{ color: 'grey', fontSize: 20 }}
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
                <View style={[styles.listElement, themeBoxStyle]}>
                  <View style={styles.iconElement}>
                    <View>
                      <Text style={[styles.text, themeTextStyle]}>
                        {i18n.t('login')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightArrow}>
                    <FontAwesome5
                      name={'chevron-right'}
                      solid
                      style={{ color: 'grey', fontSize: 20 }}
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
    borderRadius: 15,
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 19,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#01b4e4',
  },

  icon: {
    marginRight: 12,
  },
  listHeading: {
    color: 'grey',
    fontSize: 20,
  },
  listHeadingElement: {
    marginTop: 20,
    paddingBottom: 15,
  },
  rightArrow: {
    paddingRight: 0,
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
