import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
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
import { Restart } from 'fiction-expo-restart';
import ButtonStyles from '../styles/buttons';
import { borderRadius } from '../styles/globalStyles';
import { primaryButton, secondaryButton } from '../colors/colors';

const Appearance = ({ navigation }) => {
  const [appearance, setAppearance] = useState();
  const [buttonPressed, setButtonPressed] = useState(1);
  const [savedAppearance, setSavedAppearance] = useState();

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  useEffect(() => {
    getAppearance();
  }, []);

  const getAppearance = async () => {
    try {
      const value = await AsyncStorage.getItem('appearance');
      if (value !== null) {
        setAppearance(value);
        if (!value) {
          setButtonPressed(2);
        }
        if (value === 'auto') {
          setButtonPressed(2);
        }
        if (value === 'dark') {
          setButtonPressed(3);
        }
        if (value === 'light') {
          setButtonPressed(4);
        }
      } else {
        setAppearance('auto');
        setButtonPressed(2);
      }
    } catch (e) {
      alert('error reading value');
    }
  };

  const saveAndClose = () => {
    storeAppearance(savedAppearance);
    Restart();
  };

  const storeAppearance = async (appearanceValue) => {
    try {
      await AsyncStorage.setItem('appearance', appearanceValue);
    } catch (e) {
      alert('Error saving login session, contact developer');
    }
  };

  useEffect(() => {
    const subscribed = navigation.addListener('focus', () => {
      getAppearance();
      return subscribed;
    });
  }, [buttonPressed]);
  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={[styles.listHeading, themeTextStyle]}>
                {i18n.t('appearance')}
              </Text>
            </View>
            <TouchableWithoutFeedback
              style={styles.touchableElem}
              onPress={() => (setSavedAppearance('auto'), setButtonPressed(2))}
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('auto')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('autoDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={buttonPressed === 2 ? 'check' : ''}
                    solid
                    style={[themeTextStyle, { fontSize: 20 }]}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.touchableElem}
              onPress={() => (setSavedAppearance('dark'), setButtonPressed(3))}
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('dark')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('darkDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={buttonPressed === 3 ? 'check' : ''}
                    solid
                    style={[themeTextStyle, { fontSize: 20 }]}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.touchableElem}
              onPress={() => (setSavedAppearance('light'), setButtonPressed(4))}
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('light')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('lightDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={buttonPressed === 4 ? 'check' : ''}
                    solid
                    style={[themeTextStyle, { fontSize: 20 }]}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.buttonWrap}>
            <TouchableOpacity
              style={[ButtonStyles.mediumButtonStyling, styles.saveBtn]}
              onPress={() => saveAndClose()}
            >
              <Text style={[ButtonStyles.buttonText]}>
                {i18n.t('saveAndReload')}
              </Text>
            </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: '#01b4e4',
  },
  textDescription: {
    opacity: 0.7,
    marginTop: 5,
    fontSize: 14,
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
  buttonWrap: {
    marginTop: 30,
    alignSelf: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: primaryButton,
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

export default Appearance;
