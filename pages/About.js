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
  systemColors,
} from './../colors/colors';
import tmdbLogo from '../assets/tmdb-logo.png';
import { useAppearance } from '../components/AppearanceContext';
import SettingsSection from '../components/SettingsSection';
import SettingsRow from '../components/SettingsRow';

const About = () => {
  const { colorScheme } = useAppearance();
  const colors = systemColors[colorScheme] || systemColors.light;
  const containerBg = colorScheme === 'light' ? backgroundColorLight : backgroundColorDark;

  const version = Constants.expoConfig?.version;
  const buildNumber = Platform.OS === 'ios'
    ? Constants.expoConfig?.ios?.buildNumber
    : Constants.expoConfig?.android?.versionCode;

  const year = new Date().getFullYear();

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.content}>
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: colors.label }]}>
              {Constants.expoConfig?.name}
            </Text>
            <Text style={[styles.versionText, { color: colors.secondaryLabel }]}>
              {`${i18n.t('version')} ${version}${buildNumber ? ` (${buildNumber})` : ''}`}
            </Text>
            <Text style={[styles.copyright, { color: colors.tertiaryLabel }]}>
              {`\u00A9 ${year} Daniel Djupvik \u00B7 ${i18n.t('allRightsReserved')}`}
            </Text>
          </View>

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
              <Text style={[styles.disclaimer, { color: colors.tertiaryLabel }]}>
                This product uses the TMDb API but is not endorsed or certified by TMDb. Images are provided with the help of The Movie Database.
              </Text>
            </View>
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
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 4,
    gap: 6,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  versionText: {
    fontSize: 15,
    fontWeight: '400',
  },
  copyright: {
    fontSize: 13,
    fontWeight: '400',
  },
  tmdbSection: {
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  tmdbLogo: {
    width: 100,
    height: 50,
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default About;
