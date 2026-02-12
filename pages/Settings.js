import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  ActionSheetIOS,
} from 'react-native';
import i18n from '../language/i18n';
import axios from 'axios';
import { apiKey } from '../settings/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppearance } from '../components/AppearanceContext';
import { backgroundColorDark, backgroundColorLight, primaryButton } from '../colors/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const Settings = ({ navigation }) => {
  const [sessionId, setSessionId] = useState();
  const { colorScheme } = useAppearance();
  const themeContainerStyle = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('sessionId');
      if (value !== null) {
        setSessionId(value);
      } else {
        setSessionId('');
      }
    } catch (_e) {
      alert('error reading value');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const deleteSession = async (sessionIdToDelete) => {
    try {
      await axios({
        method: 'DELETE',
        url: `https://api.themoviedb.org/3/authentication/session${apiKey}`,
        headers: {},
        data: {
          session_id: sessionIdToDelete,
        },
      });
    } catch (e) {
      console.error('Failed to delete session on server:', e);
    }
  };

  const logout = async () => {
    const currentSessionId = sessionId;
    try {
      await AsyncStorage.removeItem('sessionId');
      setSessionId('');
      await deleteSession(currentSessionId);
    } catch (_e) {
      // remove error
    }
  };

  const openActionSheet = () => {
    if (Platform.OS === 'ios') {
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
    } else {
      Alert.alert(i18n.t('areYouSure'), '', [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('logout'), style: 'destructive', onPress: logout },
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeContainerStyle }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <SettingsSection header={i18n.t('mainSettings')}>
            <SettingsRow
              icon='info.circle'
              iconColor='#007AFF'
              title={i18n.t('about')}
              accessory='chevron'
              onPress={() =>
                navigation.navigate('About', {
                  headerTitle: i18n.t('about'),
                })
              }
            />
            <SettingsRow
              icon='paintbrush'
              iconColor='#AF52DE'
              title={i18n.t('appearance')}
              accessory='chevron'
              onPress={() =>
                navigation.navigate('Appearance', {
                  headerTitle: i18n.t('appearance'),
                })
              }
            />
            <SettingsRow
              icon='globe'
              iconColor='#30B0C7'
              title={i18n.t('contentSettings')}
              accessory='chevron'
              onPress={() =>
                navigation.navigate('ContentSettings', {
                  headerTitle: i18n.t('contentSettings'),
                })
              }
            />
          </SettingsSection>

          <SettingsSection header={i18n.t('accountSettings')}>
            {sessionId ? (
              <SettingsRow
                icon='person.crop.circle'
                iconColor='#34C759'
                title={i18n.t('account')}
                accessory='chevron'
                onPress={() =>
                  navigation.navigate('Account', {
                    headerTitle: i18n.t('account'),
                  })
                }
              />
            ) : null}
            {sessionId ? (
              <SettingsRow
                icon='rectangle.portrait.and.arrow.right'
                iconColor='#FF3B30'
                title={i18n.t('logout')}
                onPress={openActionSheet}
              />
            ) : (
              <SettingsRow
                icon='person.crop.circle.badge.plus'
                iconColor={primaryButton}
                title={i18n.t('login')}
                accessory='chevron'
                onPress={() =>
                  navigation.navigate('Login', {
                    headerTitle: i18n.t('login'),
                  })
                }
              />
            )}
          </SettingsSection>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
});

export default Settings;
