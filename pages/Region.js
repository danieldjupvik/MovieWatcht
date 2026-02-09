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
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonStyles from '../styles/buttons';
import { borderRadius } from '../styles/globalStyles';
import { primaryButton, secondaryButton } from '../colors/colors';

const Region = ({ navigation }) => {
  const [buttonPressed, setButtonPressed] = useState(1);
  const [savedRegion, setSavedRegion] = useState();

  const { colorScheme } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  useEffect(() => {
    getRegion();
  }, []);

  const getRegion = async () => {
    try {
      const value = await AsyncStorage.getItem('region');
      if (value !== null) {
        if (!value) {
          setButtonPressed(2);
        }
        if (value === 'auto') {
          setButtonPressed(2);
        }
        if (value === 'NO') {
          setButtonPressed(3);
        }
        if (value === 'US') {
          setButtonPressed(4);
        }
      } else {
        setButtonPressed(2);
      }
    } catch (e) {
      alert('error reading value');
    }
  };

  const saveAndGoBack = (regionValue) => {
    storeRegion(regionValue);
    navigation.goBack();
  };

  const storeRegion = async (regionValue) => {
    try {
      await AsyncStorage.setItem('region', regionValue);
    } catch (e) {
      alert('Error saving region value, contact developer');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRegion();
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
                {i18n.t('region')}
              </Text>
            </View>
            <TouchableWithoutFeedback
              style={styles.touchableElem}
              onPress={() => (setButtonPressed(2), saveAndGoBack('auto'))}
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('deviceRegion')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('deviceRegionDescription')}
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
              onPress={() => (setButtonPressed(3), saveAndGoBack('NO'))}
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('norway')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('norwayDescription')}
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
              onPress={() => (setButtonPressed(4), saveAndGoBack('US'))}
            >
              <View style={[styles.listElement, themeBoxStyle]}>
                <View style={styles.iconElement}>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('unitedState')}
                    </Text>
                    <Text style={[styles.textDescription, themeTextStyle]}>
                      {i18n.t('unitedStateDescription')}
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
        </ScrollView>
      </View>
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

export default Region;
