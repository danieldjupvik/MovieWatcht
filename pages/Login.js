import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { detailsMovieUrl, apiKey, basePosterUrl } from '../settings/api';
import { backgroundColor } from './Home';
import axios from 'axios';

const Login = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <Text>Hello World</Text>
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
  },
  main: {
    width: Dimensions.get('window').width,
  },
});

export default Login;
