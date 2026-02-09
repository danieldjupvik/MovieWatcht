import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { useAppearance } from '../components/AppearanceContext';
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
import { borderRadius } from '../styles/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContentSettings = ({ navigation }) => {
  const [sessionId, setSessionId] = useState();

  const { colorScheme } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;
  const themeButtonStyle =
    colorScheme === 'light' ? styles.darkThemeBox : styles.lightThemeBox;
  const themeButtonTextStyle =
    colorScheme === 'light' ? styles.darkThemeText : styles.lightThemeText;

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
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <View style={[styles.container, themeContainerStyle]}>
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={[styles.listHeading, themeTextStyle]}>
                {i18n.t('languageAndRegion')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.touchableElem}
              onPress={() =>
                navigation.navigate('Region', {
                  headerTitle: i18n.t('region'),
                })
              }
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('region')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('regionDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'globe-europe'}
                    solid
                    style={[themeTextStyle, { fontSize: iconSize }]}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.listHeadingElement}>
              <Text style={[styles.listHeading, themeTextStyle]}>
                {i18n.t('content')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.touchableElem}
              onPress={() =>
                navigation.navigate('Adult', {
                  headerTitle: i18n.t('adult'),
                })
              }
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('adult')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('adultContentDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'ban'}
                    solid
                    style={[themeTextStyle, { fontSize: iconSize }]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const iconSize = 21;

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
    borderRadius: borderRadius,
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 18.5,
    fontWeight: '400',
  },
  textDescription: {
    opacity: 0.7,
    marginTop: 5,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#01b4e4',
  },

  icon: {
    marginRight: 12,
  },
  listHeading: {
    opacity: 0.7,
    fontSize: 20,
    fontWeight: '600',
  },
  listHeadingElement: {
    marginTop: 20,
    paddingBottom: 15,
  },
  rightArrow: {
    paddingRight: 15,
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

export default ContentSettings;
