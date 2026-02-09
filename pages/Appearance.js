import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { useAppearance } from '../components/AppearanceContext';
import {
  ScrollView,
  TouchableWithoutFeedback,
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

const Appearance = ({ navigation }) => {
  const { colorScheme, appearance, updateAppearance } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <ScrollView indicatorStyle={scrollBarTheme}>
        <View style={styles.main}>
          <View style={styles.listHeadingElement}>
            <Text style={[styles.listHeading, themeTextStyle]}>
              {i18n.t('appearance')}
            </Text>
          </View>
          <TouchableWithoutFeedback
            style={styles.touchableElem}
            onPress={() => updateAppearance('auto')}
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
                  name={appearance === 'auto' ? 'check' : ''}
                  solid
                  style={[themeTextStyle, { fontSize: 20 }]}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={styles.touchableElem}
            onPress={() => updateAppearance('dark')}
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
                  name={appearance === 'dark' ? 'check' : ''}
                  solid
                  style={[themeTextStyle, { fontSize: 20 }]}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={styles.touchableElem}
            onPress={() => updateAppearance('light')}
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
                  name={appearance === 'light' ? 'check' : ''}
                  solid
                  style={[themeTextStyle, { fontSize: 20 }]}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
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
