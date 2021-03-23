import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { detailsMovieUrl, apiKey, basePosterUrl } from '../settings/api';
import { backgroundColor } from './Home';
import axios from 'axios';

const About = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <Text style={{ color: 'white', fontSize: 30 }}>
            About page coming soon
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
});

export default About;
