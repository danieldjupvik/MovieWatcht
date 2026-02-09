import React, { useCallback } from 'react';
import { Text, View, Pressable, Share, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { basePosterUrl } from '../settings/api';
import { imageBlurhash } from '../settings/imagePlaceholder';
import noImage from '../assets/no-image.jpg';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import { borderRadius } from '../styles/globalStyles';
import { textColorDark, textColorLight } from '../colors/colors';
import * as Haptics from 'expo-haptics';

const deviceWidth = Dimensions.get('window').width;

const MovieCard = ({ id, posterPath, title, voteAverage, colorScheme }) => {
  const navigation = useNavigation();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  const posterImage = posterPath
    ? { uri: `${basePosterUrl}${posterPath}` }
    : noImage;

  const handlePress = useCallback(() => {
    navigation.navigate('Details', { id, headerTitle: title });
  }, [id, title, navigation]);

  const handleLongPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const url = 'https://www.themoviedb.org/movie/' + id;
    try {
      await Share.share({ title, url });
    } catch (error) {
      alert(error.message);
    }
  }, [id, title]);

  return (
    <Pressable onPress={handlePress} onLongPress={handleLongPress}>
      <View style={styles.cards}>
        <View style={styles.imageDiv}>
          <Image
            source={posterImage}
            style={styles.image}
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
            {Math.floor((voteAverage * 100) / 10)}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: deviceWidth / 3.3,
    height: deviceWidth / 2.24,
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

export default React.memo(MovieCard);
