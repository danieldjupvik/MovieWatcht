import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActionSheetIOS,
} from 'react-native';
import { Image } from 'expo-image';
import i18n from '../language/i18n';
import {
  backgroundColorDark,
  backgroundColorLight,
} from '../colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppearance } from '../components/AppearanceContext';
import { accountUrl, baseProfileUrl , apiKey } from './../settings/api';
import axios from 'axios';
import noAvatar from '../assets/no-avatar.jpg';
import Loader from '../components/Loader';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const Account = ({ navigation }) => {
  const [accountInfo, setAccountInfo] = useState();
  const [sessionId, setSessionId] = useState();
  const [loader, setLoader] = useState(true);

  const { colorScheme } = useAppearance();
  const containerBg = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  useEffect(() => {
    const getData = async () => {
      try {
        const sessionId = await AsyncStorage.getItem('sessionId');
        const response = await axios.get(
          `${accountUrl + `&session_id=${sessionId}`}`
        );
        setAccountInfo(response.data);
        setSessionId(sessionId);
      } catch (_e) {
        alert('error reading login credentials');
      } finally {
        setLoader(false);
      }
    };
    getData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('sessionId');
      await deleteSession();
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
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
        if (buttonIndex === 1) {
          logout();
        }
      }
    );

  const deleteSession = async () => {
    try {
      await axios({
        method: 'DELETE',
        url: `https://api.themoviedb.org/3/authentication/session${apiKey}`,
        headers: {},
        data: {
          session_id: sessionId,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const profilePicture = {
    uri: `${baseProfileUrl + accountInfo?.avatar?.tmdb?.avatar_path}`,
  };

  const deviceHeight = Dimensions.get('window').height;

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {loader ? (
        <Loader loadingStyle={{ marginTop: deviceHeight / 2.5 }} />
      ) : (
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  accountInfo?.avatar?.tmdb?.avatar_path
                    ? profilePicture
                    : noAvatar
                }
                contentFit='cover'
                style={styles.profileImage}
              />
            </View>

            <SettingsSection header={i18n.t('accountInfo')}>
              <SettingsRow
                title={i18n.t('username')}
                rightText={accountInfo?.username}
              />
              <SettingsRow
                title={i18n.t('name')}
                rightText={accountInfo?.name ? accountInfo?.name : i18n.t('noName')}
              />
            </SettingsSection>

            <SettingsSection>
              <SettingsRow
                icon='rectangle.portrait.and.arrow.right.fill'
                iconColor='#FF3B30'
                title={i18n.t('logout')}
                onPress={openActionSheet}
              />
            </SettingsSection>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default Account;
