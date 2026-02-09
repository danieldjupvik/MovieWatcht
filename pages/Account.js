import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActionSheetIOS
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
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
} from '../colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppearance } from '../components/AppearanceContext';
import { accountUrl, baseProfileUrl } from './../settings/api';
import axios from 'axios';
import { apiKey } from '../settings/api';
import noAvatar from '../assets/no-avatar.jpg';
import Loader from '../components/Loader';
import ButtonStyles from '../styles/buttons';
import { borderRadius } from '../styles/globalStyles';
import { primaryButton, secondaryButton } from '../colors/colors';

const Account = ({ navigation }) => {
  const [accountInfo, setAccountInfo] = useState();
  const [sessionId, setSessionId] = useState();
  const [loader, setLoader] = useState(true);

  const { colorScheme } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  useEffect(() => {
    let isCancelled = false;
    const getData = async () => {
      try {
        const sessionId = await AsyncStorage.getItem('sessionId');
        const response = await axios.get(
          `${accountUrl + `&session_id=${sessionId}`}`
        );
        setAccountInfo(response.data);
        console.log(response.data);
        console.log(sessionId);
        setSessionId(sessionId);
      } catch (e) {
        alert('error reading login credentials');
      } finally {
        setLoader(false);
      }
    };
    getData();
    return () => {
      isCancelled = true;
    };
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('sessionId');
      deleteSession();
      navigation.goBack();
    } catch (e) {
      console.log(e);
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

  const profilePicture = {
    uri: `${baseProfileUrl + accountInfo?.avatar.tmdb.avatar_path}`,
  };

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        {loader ? (
          <Loader loadingStyle={styles.loaderStyle} />
        ) : (
          <ScrollView indicatorStyle={scrollBarTheme}>
            <View style={styles.main}>
              <Image
                source={
                  accountInfo?.avatar.tmdb.avatar_path
                    ? profilePicture
                    : noAvatar
                }
                contentFit='contain'
                style={[
                  {
                    width: 150,
                    height: 150,
                  },
                  styles.profileImage,
                ]}
              />
            </View>
            <View style={styles.headingElement}>
              <Text style={[styles.headingText, themeTextStyle]}>
                {i18n.t('accountInfo')}
              </Text>
            </View>
            <View style={[styles.userInfoWrap, themeBoxStyle]}>
              <View style={[styles.userInfoDiv]}>
                <View style={styles.usernameInfo}>
                  <View style={styles.topElem}>
                    <Text style={[styles.topElemText, themeTextStyle]}>
                      {i18n.t('username')}
                    </Text>
                  </View>
                  <View style={styles.bottomElem}>
                    <Text style={[styles.bottomElemText, themeTextStyle]}>
                      {accountInfo?.username}
                    </Text>
                  </View>
                </View>

                <View style={styles.nameInfo}>
                  <View style={styles.topElem}>
                    <Text style={[styles.topElemText, themeTextStyle]}>
                      {i18n.t('name')}
                    </Text>
                  </View>
                  <View style={styles.bottomElem}>
                    <Text style={[styles.bottomElemText, themeTextStyle]}>
                      {accountInfo?.name ? accountInfo?.name : i18n.t('noName')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.buttonWrap}>
              <TouchableOpacity
                style={[ButtonStyles.mediumButtonStyling, styles.logoutBtn]}
                onPress={openActionSheet}
              >
                <Text style={[ButtonStyles.buttonText]}>
                  {i18n.t('logout')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '400';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    width: '100%',
    marginTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
  },
  profileImage: {
    borderRadius: 150,
    marginBottom: 40,
  },
  headingText: {
    opacity: 0.7,
    fontSize: 20,
    fontWeight: '600',
  },
  headingElement: {
    paddingBottom: 25,
    alignSelf: 'center',
  },
  userInfoWrap: {
    alignSelf: 'center',
    flex: 1,
    padding: 50,
    borderRadius: borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth - 70,
  },
  userInfoDiv: {},
  usernameInfo: {
    marginBottom: 15,
  },
  topElem: {},
  bottomElem: { marginTop: 5 },
  topElemText: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomElemText: {
    fontSize: 17,
    fontWeight: '400',
  },
  buttonWrap: {
    marginTop: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: primaryButton,
  },

  loaderStyle: {
    marginTop: deviceHeight / 2.5,
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

export default Account;
