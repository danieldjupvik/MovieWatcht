import React from 'react';
import { ActivityIndicator, StyleSheet, View, Dimensions } from 'react-native';
// import { deviceHeight } from '../pages/Home';

const deviceHeight = Dimensions.get('window').height;
const Loader = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size='large' color='red' />
  </View>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignContent: 'center',
    // backgroundColor: 'blue',
    // height: '100%',
    marginTop: deviceHeight / 4.5,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Loader;
