import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Switch } from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
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
import ButtonStyles from '../styles/buttons';
import { borderRadius } from '../styles/globalStyles';
import { primaryButton, secondaryButton } from '../colors/colors';

const Adult = ({ navigation }) => {
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          console.log(value);
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    getAdult();
  }, []);

  const getAdult = async () => {
    try {
      const value = await AsyncStorage.getItem('adult');
      if (value !== null) {
        setIsEnabled(JSON.parse(value));
      } else {
        setIsEnabled(false);
      }
    } catch (e) {
      alert('error reading value');
    }
  };

  // console.log(isEnabled);
  const toggleSwitch = (e) => {
    console.log(e);
    setIsEnabled((previousState) => !previousState);
    storeAdult(JSON.stringify(e));
  };

  const storeAdult = async (adultValue) => {
    try {
      await AsyncStorage.setItem('adult', adultValue);
    } catch (e) {
      alert('Error saving adult value, contact developer');
    }
  };

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={[styles.listHeading, themeTextStyle]}>
                {i18n.t('adult')}
              </Text>
            </View>
            <TouchableWithoutFeedback style={styles.touchableElem}>
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('adultContent')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('adultButtonDescription')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor='#3e3e3e'
                    onValueChange={(e) => toggleSwitch(e)}
                    value={isEnabled}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
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

export default Adult;
