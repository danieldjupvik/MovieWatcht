import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image } from 'react-native';
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
import { accountUrl, baseProfileUrl } from './../settings/api';
import axios from 'axios';
import noAvatar from '../assets/no-avatar.jpg';

const Account = ({ navigation }) => {
  const [sessionId, setSessionId] = useState();
  const [accountInfo, setAccountInfo] = useState();

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
          getAccount(value);
        } else {
          console.log('there is no login credit');
        }
      } catch (e) {
        alert('error reading login credentials');
      }
    };
    getData();
  }, []);

  const getAccount = async (id) => {
    console.log(id);
    try {
      const response = await axios.get(`${accountUrl + `&session_id=${id}`}`);
      setAccountInfo(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('sessionId');
      navigation.goBack();
    } catch (e) {
      // remove error
    }
    console.log('Done.');
  };

  const profilePicture = {
    uri: `${baseProfileUrl + accountInfo?.avatar.tmdb.avatar_path}`,
  };
  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <Image
              source={
                accountInfo?.avatar.tmdb.avatar_path ? profilePicture : noAvatar
              }
              style={[
                {
                  resizeMode: 'contain',
                  width: 150,
                  height: 150,
                },
                styles.profileImage,
              ]}
            />
          </View>
          <Text style={[styles.genre, themeTextStyle]}>
            <Text style={styles.category}>{i18n.t('username')}</Text>{' '}
            {accountInfo?.username}
          </Text>
          <Text style={[styles.genre, themeTextStyle]}>
            <Text style={styles.category}>{i18n.t('name')}</Text>{' '}
            {accountInfo?.name}
          </Text>
          <View style={styles.buttonWrap}>
            <TouchableOpacity style={[styles.buttonStyling]} onPress={logout}>
              <Text style={[styles.buttonText]}>{i18n.t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '400';

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
  genre: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: globalPadding,
    marginBottom: globalPadding,
  },
  category: {
    opacity: 0.7,
  },
  buttonWrap: {
    marginTop: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonStyling: {
    backgroundColor: '#01b4e4',
    padding: 15,
    paddingLeft: 44,
    paddingRight: 44,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
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
