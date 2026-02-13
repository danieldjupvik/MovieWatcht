import React, { useCallback } from 'react';
import { Text, View, Pressable, Share, StyleSheet, Linking, ActionSheetIOS, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { basePosterUrl } from '../settings/api';
import { imageBlurhash } from '../settings/imagePlaceholder';
import noImage from '../assets/no-image.jpg';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import { borderRadius } from '../styles/globalStyles';
import { textColorDark, textColorLight } from '../colors/colors';
import * as Haptics from 'expo-haptics';

const SeriesCard = ({ id, posterPath, name, voteAverage, colorScheme, cardWidth, cardHeight }) => {
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  const posterImage = posterPath
    ? { uri: `${basePosterUrl}${posterPath}` }
    : noImage;

  const tmdbUrl = `https://www.themoviedb.org/tv/${id}`;

  const handlePress = useCallback(() => {
    navigation.navigate('SeriesDetails', { id, headerTitle: name });
  }, [id, name, navigation]);

  const showActionSheet = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Share', 'Open on TMDb'],
          cancelButtonIndex: 0,
          title: name,
        },
        (buttonIndex) => {
          scale.value = withSpring(1, { duration: 500, dampingRatio: 0.7 });
          if (buttonIndex === 1) {
            Share.share({ title: name, url: tmdbUrl });
          } else if (buttonIndex === 2) {
            Linking.openURL(tmdbUrl);
          }
        }
      );
    } else {
      const resetScale = () => scale.value = withSpring(1, { duration: 500, dampingRatio: 0.7 });
      Alert.alert(name, '', [
        { text: 'Cancel', style: 'cancel', onPress: resetScale },
        {
          text: 'Share',
          onPress: () => {
            resetScale();
            Share.share({ title: name, message: `${name} ${tmdbUrl}`, url: tmdbUrl });
          },
        },
        {
          text: 'Open on TMDb',
          onPress: () => {
            resetScale();
            Linking.openURL(tmdbUrl);
          },
        },
      ]);
    }
  }, [name, tmdbUrl, scale]);

  const handleLongPress = useCallback(() => {
    scale.value = withSpring(1.04, { duration: 350, dampingRatio: 0.85 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(showActionSheet, 250);
  }, [scale, showActionSheet]);

  return (
    <Pressable onPress={handlePress} onLongPress={handleLongPress}>
      <Animated.View style={[styles.cards, animatedStyle]}>
        <View style={styles.imageDiv}>
          <Image
            source={posterImage}
            style={cardWidth ? [styles.image, { width: cardWidth, height: cardHeight }] : styles.image}
            placeholder={imageBlurhash}
            placeholderContentFit='cover'
            transition={300}
          />
        </View>
        <View style={styles.ratingDiv}>
          <Image
            source={tmdbLogo}
            style={styles.tmdbLogo}
            contentFit='contain'
          />
          <Text style={[styles.rating, themeTextStyle]}>
            {Math.floor(((voteAverage || 0) * 100) / 10)}%
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 180,
    backgroundColor: 'grey',
    borderRadius: borderRadius,
  },
  imageDiv: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
    shadowRadius: 3.2,
  },
  cards: {
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
  },
  rating: {
    marginLeft: 6,
  },
  ratingDiv: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tmdbLogo: {
    width: 25,
    height: 12,
  },
  lightThemeText: {
    color: textColorLight,
  },
  darkThemeText: {
    color: textColorDark,
  },
});

export default React.memo(SeriesCard);
