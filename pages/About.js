import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import i18n from '../language/i18n';
import * as WebBrowser from 'expo-web-browser';
import {
  backgroundColorDark,
  backgroundColorLight,
} from './../colors/colors';
import tmdbLogo from '../assets/tmdb-logo.png';
import { useAppearance } from '../components/AppearanceContext';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const About = () => {
  const { colorScheme } = useAppearance();
  const isDark = colorScheme === 'dark';
  const secondaryText = isDark ? '#98989F' : '#8E8E93';
  const containerBg = isDark ? backgroundColorDark : backgroundColorLight;

  const buildNumber = Platform.OS === 'ios'
    ? Constants.expoConfig?.ios?.buildNumber
    : Constants.expoConfig?.android?.versionCode;

  const year = new Date().getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <SettingsSection header={i18n.t('aboutThisApp')}>
            <SettingsRow
              title={`Copyright \u00A9 ${year} Daniel Djupvik`}
              subtitle={i18n.t('allRightsReserved')}
            />
            <SettingsRow
              title={`${i18n.t('version')} ${Constants.expoConfig?.version} (${buildNumber})`}
            />
          </SettingsSection>

          <SettingsSection header={i18n.t('tmdbPrivacy')}>
            <SettingsRow
              title='The Movie Database'
              accessory='chevron'
              onPress={() => WebBrowser.openBrowserAsync('https://www.themoviedb.org/privacy-policy')}
            />
            <SettingsRow
              title={Constants.expoConfig?.name}
              accessory='chevron'
              onPress={() => WebBrowser.openBrowserAsync('https://danieldjupvik.dev/privacy.html')}
            />
          </SettingsSection>

          <SettingsSection header={i18n.t('poweredBy')}>
            <View style={styles.tmdbSection}>
              <Image
                source={tmdbLogo}
                contentFit='contain'
                style={styles.tmdbLogo}
              />
              <Text style={[styles.disclaimer, { color: secondaryText }]}>
                This product uses the TMDb API but is not endorsed or certified by TMDb.
              </Text>
              <Text style={[styles.disclaimer, { color: secondaryText }]}>
                Images are provided with the help of The Movie Database.
              </Text>
            </View>
          </SettingsSection>

          <SettingsSection header='Info'>
            <SettingsRow
              title='Icon provided by FontAwesome'
              accessory='chevron'
              onPress={() => WebBrowser.openBrowserAsync('https://fontawesome.com/license')}
            />
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  tmdbSection: {
    padding: 16,
  },
  tmdbLogo: {
    width: 100,
    height: 50,
    marginBottom: 12,
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default About;
