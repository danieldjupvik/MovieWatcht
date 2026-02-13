import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { baseBackdropUrl, baseBackdropPlaceholderUrl } from '../settings/api';
import { imageBlurhash } from '../settings/imagePlaceholder';
import noImage from '../assets/no-image.jpg';

const ProgressiveBackdrop = ({ backdropPath, height, backgroundColor }) => {
  const blurOpacity = useSharedValue(1);
  const highResOpacity = useSharedValue(0);

  const blurAnimStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

  const highResAnimStyle = useAnimatedStyle(() => ({
    opacity: highResOpacity.value,
  }));

  const onHighResLoad = () => {
    highResOpacity.value = withTiming(1, { duration: 500 });
    blurOpacity.value = withTiming(0, { duration: 500 });
  };

  const source = backdropPath
    ? { uri: `${baseBackdropUrl}${backdropPath}` }
    : noImage;

  const lowResSource = backdropPath
    ? { uri: `${baseBackdropPlaceholderUrl}${backdropPath}` }
    : noImage;

  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={lowResSource}
        style={StyleSheet.absoluteFill}
        placeholder={imageBlurhash}
        placeholderContentFit='cover'
        contentFit='cover'
      />

      <Animated.View style={[StyleSheet.absoluteFill, blurAnimStyle]}>
        <BlurView intensity={40} style={StyleSheet.absoluteFill} tint='dark' />
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, highResAnimStyle]}>
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit='cover'
          onLoad={onHighResLoad}
        />
      </Animated.View>

      <LinearGradient
        colors={[
          'rgba(0,0,0,0.4)',
          'rgba(0,0,0,0.6)',
          backgroundColor,
        ]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default ProgressiveBackdrop;
