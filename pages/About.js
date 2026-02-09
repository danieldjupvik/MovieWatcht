import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Constants from 'expo-constants';
import i18n from 'i18n-js';
import * as WebBrowser from 'expo-web-browser';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from './../colors/colors';
import tmdbLogo from '../assets/tmdb-logo.png';
import { Button } from 'react-native';
import { color } from 'react-native-reanimated';
import { useAppearance } from '../components/AppearanceContext';

const About = () => {
  const { colorScheme } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const goToTheMovieDb = () => {
    WebBrowser.openBrowserAsync('https://www.themoviedb.org/privacy-policy');
  };

  const goToAppPrivacy = () => {
    WebBrowser.openBrowserAsync('https://danieldjupvik.dev/privacy.html');
  };

  const goFontAwesomeLicense = () => {
    WebBrowser.openBrowserAsync('https://fontawesome.com/license');
  };

  const goToTheMovieDbLicense = () => {
    WebBrowser.openBrowserAsync('https://www.themoviedb.org/documentation/api');
  };

  let d = new Date();
  let year = d.getFullYear();
  return (
    <>
      <SafeAreaView
        style={[styles.container, themeContainerStyle]}
        indicatorStyle={scrollBarTheme}
      >
        <View style={styles.scrollViewWrapper}>
          <ScrollView>
            <View style={styles.main}>
              <View style={styles.listHeadingElement}>
                <Text style={styles.listHeading}>{i18n.t('aboutThisApp')}</Text>
              </View>
              <View style={styles.touchableElem}>
                <View style={styles.listElement}>
                  <View style={styles.iconElement}>
                    <View>
                      <Text style={[styles.text, themeTextStyle]}>
                        Copyright © {year} Daniel Djupvik
                      </Text>
                      <Text style={[styles.text, themeTextStyle]}>
                        {i18n.t('allRightsReserved')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.listElement}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('version')} {Constants.expoConfig?.version} (
                      {Platform.OS === 'ios'
                        ? Constants.expoConfig?.ios?.buildNumber
                        : Constants.expoConfig?.android?.versionCode}
                      )
                    </Text>
                    <Text style={[styles.text, themeTextStyle]}>
                      Release Channel {Constants.expoConfig?.extra?.releaseChannel ?? 'default'}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View>
                  <View>
                    <Text style={[styles.subHeading, themeTextStyle]}>
                      {i18n.t('tmdbPrivacy')}
                    </Text>
                  </View>
                  <View style={styles.privacyBtn}>
                    <Button
                      onPress={goToTheMovieDb}
                      title='The Movie Database'
                    />
                  </View>
                  <View style={styles.privacyBtn}>
                    <Button
                      onPress={goToAppPrivacy}
                      title={Constants.expoConfig?.name}
                    />
                  </View>
                </View>
              </View>
              <View>
                <Text
                  style={[styles.subHeading, { marginTop: 15 }, themeTextStyle]}
                >
                  {i18n.t('poweredBy')}
                </Text>
                <Image
                  source={tmdbLogo}
                  contentFit='contain'
                  style={{
                    width: 100,
                    height: 100,
                    marginLeft: 2,
                    marginTop: 5,
                  }}
                />

                <Text style={[styles.text, themeTextStyle]}>
                  Note: This product uses the TMDb API but is not endorsed or
                  certified by TMDb.
                </Text>
                <Text style={[styles.text, themeTextStyle]}>
                  Images are provided with the help of The Movie Database.
                </Text>
              </View>
              <Text
                style={[styles.subHeading, { marginTop: 25 }, themeTextStyle]}
              >
                Info
              </Text>
              <Text style={[styles.text, themeTextStyle]}>
                Icon provided by{' '}
                <Text
                  onPress={goFontAwesomeLicense}
                  style={[{ color: 'blue' }]}
                >
                  FontAwesome
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
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
    paddingBottom: 50,
  },
  scrollViewWrapper: {
    marginBottom: 45,
  },
  listElement: {
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  privacyBtn: {
    alignItems: 'flex-start',
    marginLeft: -8,
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '400',
  },
  subHeading: {
    fontSize: 17,
    fontWeight: '500',
  },
  listHeading: {
    color: 'grey',
    fontSize: 20,
  },
  listHeadingElement: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    marginTop: 20,
    paddingBottom: 15,
  },
  rightArrow: {
    paddingRight: 8,
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
});

export default About;
