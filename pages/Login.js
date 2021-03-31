import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import {
  detailsMovieUrl,
  apiKey,
  basePosterUrl,
  getTokenUrl,
  loginUrl,
  getSessionUrl,
  accountUrl,
} from '../settings/api';
import axios from 'axios';
import { useColorScheme } from 'react-native-appearance';
import i18n from 'i18n-js';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
  primaryButton,
  secondaryButton,
} from '../colors/colors';
import { TextInput } from 'react-native';
import { Image } from 'react-native';
import tmdbLogo from '../assets/tmdb-logo.png';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ButtonStyles from '../styles/buttons';

const goToRegister = () => {
  WebBrowser.openBrowserAsync('https://www.themoviedb.org/signup');
};

const goToForgotPassword = () => {
  WebBrowser.openBrowserAsync('https://www.themoviedb.org/reset-password');
};

export let testVariable = true;

const Login = ({ navigation }) => {
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [showError, setShowError] = useState(false);
  const [usernameInput, setUsernameInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
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
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;
  const placeHolderText = colorScheme === 'light' ? 'black' : 'white';

  const getToken = async () => {
    try {
      const response = await axios.get(`${getTokenUrl}`);
      getRequestToken(response.data.request_token);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const getRequestToken = async (initToken) => {
    try {
      const response = await axios({
        method: 'POST',
        url:
          'https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=0e336e0a85a0361c6c6ce28bdce52748',
        headers: {},
        data: {
          username: username,
          password: password,
          request_token: initToken,
        },
      });
      getSessionId(response.data.request_token);
    } catch (e) {
      setShowError(true);
      usernameInput.clear();
      passwordInput.clear();
    } finally {
    }
  };

  const getSessionId = async (authorizedToken) => {
    try {
      const response = await axios({
        method: 'POST',
        url:
          'https://api.themoviedb.org/3/authentication/session/new?api_key=0e336e0a85a0361c6c6ce28bdce52748',
        headers: {},
        data: {
          request_token: authorizedToken,
        },
      });
      storeSessionId(response.data.session_id);
      console.log(response.data.session_id);
      getAccount(response.data.session_id);
      testVariable = false;
      navigation.goBack();
    } catch (e) {
      setShowError(true);
      usernameInput.clear();
      passwordInput.clear();
      console.log(e);
    } finally {
    }
  };

  const getAccount = async (id) => {
    try {
      const response = await axios.get(`${accountUrl + `&session_id=${id}`}`);
      storeAccountId(JSON.stringify(response.data.id));
      console.log(response.data.id);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const storeAccountId = async (accountID) => {
    try {
      await AsyncStorage.setItem('accountId', accountID);
    } catch (e) {
      alert('Error saving login session, contact developer');
    }
  };

  const storeSessionId = async (value) => {
    try {
      await AsyncStorage.setItem('sessionId', value);
    } catch (e) {
      alert('Error saving login session, contact developer');
    }
  };

  const handleUsername = (username) => {
    setShowError(false);
    setUsername(username);
  };
  const handlePassword = (password) => {
    setShowError(false);
    setPassword(password);
  };

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <ScrollView style={styles.main}>
          <View style={styles.loginWrap}>
            <Image
              source={tmdbLogo}
              style={{
                resizeMode: 'contain',
                width: 150,
              }}
            />
            <View style={[styles.loginBox, themeBoxStyle]}>
              <View style={[styles.loginViewEmail, themeContainerStyle]}>
                <FontAwesome5
                  name={'user'}
                  solid
                  style={{ color: 'grey', fontSize: 17, padding: 10 }}
                />
                <TextInput
                  style={[styles.loginInput, themeTextStyle]}
                  placeholder={i18n.t('username')}
                  placeholderTextColor={placeHolderText}
                  onChangeText={(username) => handleUsername(username)}
                  value={username}
                  clearButtonMode='always'
                  returnKeyType={'next'}
                  ref={(input) => {
                    setUsernameInput(input);
                  }}
                  onSubmitEditing={() => {
                    passwordInput.focus();
                  }}
                  blurOnSubmit={false}
                  autoCompleteType={'username'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  enablesReturnKeyAutomatically={true}
                />
              </View>
              <View style={[styles.loginViewPassword, themeContainerStyle]}>
                <FontAwesome5
                  name={'key'}
                  solid
                  style={{ color: 'grey', fontSize: 17, padding: 10 }}
                />
                <TextInput
                  style={[styles.loginInput, themeTextStyle]}
                  placeholder={i18n.t('password')}
                  secureTextEntry
                  placeholderTextColor={placeHolderText}
                  onChangeText={(password) => handlePassword(password)}
                  value={password}
                  clearButtonMode='always'
                  ref={(input) => {
                    setPasswordInput(input);
                  }}
                  returnKeyType={'go'}
                  autoCompleteType={'password'}
                  onSubmitEditing={getToken}
                />
              </View>
            </View>
            {showError ? (
              <View style={styles.errorDiv}>
                <Text style={[styles.wrongPassword, themeTextStyle]}>
                  {i18n.t('wrongPassword')}
                </Text>
              </View>
            ) : null}
            <View style={styles.buttonWrap}>
              <TouchableOpacity
                style={[
                  ButtonStyles.mediumButtonStyling,
                  styles.buttonStylingLeft,
                ]}
                onPress={goToRegister}
              >
                <Text style={[ButtonStyles.buttonText]}>
                  {i18n.t('register')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  ButtonStyles.mediumButtonStyling,
                  styles.buttonStylingRight,
                ]}
                onPress={getToken}
              >
                <Text style={[ButtonStyles.buttonText]}>{i18n.t('login')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={goToForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, themeTextStyle]}>
                {i18n.t('forgotPassword')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  main: {
    width: Dimensions.get('window').width,
  },
  loginBox: {
    marginTop: 20,
    padding: 15,
    width: deviceWidth - 50,
    borderRadius: 10,
  },
  loginViewEmail: {
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginViewPassword: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginInput: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 7,
  },
  loginWrap: {
    marginTop: 40,
    alignItems: 'center',
  },
  wrongPassword: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  errorDiv: {
    borderBottomWidth: 2,
    paddingBottom: 6,
    borderBottomColor: 'red',
  },
  buttonWrap: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonStylingLeft: {
    marginRight: 10,
    backgroundColor: secondaryButton,
  },
  buttonStylingRight: {
    backgroundColor: primaryButton,
  },
  forgotPassword: {
    marginTop: 20,
  },
  forgotPasswordText: {
    fontWeight: '500',
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

export default Login;
