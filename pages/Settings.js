import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { detailsMovieUrl, apiKey, basePosterUrl } from '../settings/api';
import { backgroundColor } from './Home';
import axios from 'axios';
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Settings = ({ navigation }) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.listHeadingElement}>
              <Text style={styles.listHeading}>Main Settings</Text>
            </View>
            <TouchableOpacity
              style={styles.touchableElem}
              onPress={() => navigation.navigate('About')}
            >
              <View style={styles.listElement}>
                <View>
                  <Text style={styles.text}>
                    <View style={styles.icon}>
                      <FontAwesome5
                        name={'info-circle'}
                        solid
                        style={{ color: 'grey', fontSize: 20 }}
                      />
                    </View>
                    About
                  </Text>
                </View>
                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <View style={styles.listElement}>
                <View>
                  <Text style={styles.text}>
                    <View style={styles.icon}>
                      <FontAwesome5
                        name={'sign-in-alt'}
                        solid
                        style={{ color: 'grey', fontSize: 20 }}
                      />
                    </View>
                    Login
                  </Text>
                </View>
                <View style={styles.rightArrow}>
                  <FontAwesome5
                    name={'chevron-right'}
                    solid
                    style={{ color: 'grey', fontSize: 20 }}
                  />
                </View>
              </View>
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
    backgroundColor: backgroundColor,
  },
  main: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
  },
  listElement: {
    paddingBottom: 15,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  icon: {
    marginRight: 10,
  },
  listHeading: {
    color: 'grey',
    fontSize: 20,
  },
  listHeadingElement: {
    borderBottomWidth: 1,
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
});

export default Settings;
