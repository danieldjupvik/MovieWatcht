import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
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

const Settings = ({ navigation }) => {
  const colorScheme = useColorScheme();

  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={styles.listHeading}>{i18n.t('mainSettings')}</Text>
            </View>
            <TouchableWithoutFeedback
              style={styles.touchableElem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.listElement}>
                <View style={styles.iconElement}>
                  <View style={styles.icon}>
                    <FontAwesome5
                      name={'info-circle'}
                      solid
                      style={{ color: 'grey', fontSize: 25 }}
                    />
                  </View>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('about')}
                    </Text>
                  </View>
                </View>

                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Login')}
            >
              <View style={styles.listElement}>
                <View style={styles.iconElement}>
                  <View style={styles.icon}>
                    <FontAwesome5
                      name={'sign-in-alt'}
                      solid
                      style={{ color: 'grey', fontSize: 25 }}
                    />
                  </View>
                  <View>
                    <Text style={[styles.text, themeTextStyle]}>
                      {i18n.t('login')}
                    </Text>
                  </View>
                </View>
                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
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
  },
  listElement: {
    paddingBottom: 15,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    width: '100%',
  },
  iconElement: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: '300',
  },
  icon: {
    marginRight: 12,
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

export default Settings;
