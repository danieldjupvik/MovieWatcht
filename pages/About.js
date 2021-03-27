import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { useColorScheme } from 'react-native-appearance';
import i18n from 'i18n-js';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';

const About = () => {
  const colorScheme = useColorScheme();

  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  let d = new Date();
  let year = d.getFullYear();
  return (
    <>
      <SafeAreaView
        style={[styles.container, themeContainerStyle]}
        indicatorStyle={scrollBarTheme}
      >
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
            <View>
              <View style={styles.listElement}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('version')} {Constants.manifest.version} (
                      {Platform.OS === 'ios'
                        ? Constants.manifest.ios.buildNumber
                        : Constants.manifest.android.versionCode}
                      )
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: '300',
  },
  icon: {},
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
