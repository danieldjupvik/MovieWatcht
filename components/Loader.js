import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loader = ({ loadingStyle, color, size }) => {
  return (
    <View style={loadingStyle ? loadingStyle : null}>
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator
          size={size ? size : 'large'}
          color={color ? color : 'red'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: deviceHeight / 4.5,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding: 10,
  },
});

export default Loader;
