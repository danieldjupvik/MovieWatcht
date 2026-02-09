import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from './AppearanceContext';
import { baseSearchPosterUrl } from '../settings/api';
import Loader from '../components/Loader';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { borderRadius } from '../styles/globalStyles';
import { imageBlurhash } from '../settings/imagePlaceholder';
import noImage from '../assets/no-image.jpg';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

const SearchResults = ({ movies, loader }) => {
  const navigation = useNavigation();

  const { colorScheme } = useAppearance();
  const themeTabBar = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const onShare = async (title, id) => {
    async function impactAsync(style = Haptics.ImpactFeedbackStyle.Heavy) {
      if (!Haptics.impactAsync) {
        throw new UnavailabilityError('Haptic', 'impactAsync');
      }
      await Haptics.impactAsync(style);
    }
    impactAsync();

    const url = 'https://www.themoviedb.org/movie/' + id;

    try {
      const result = await Share.share({
        title: title,
        url: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={[styles.scrollView, themeContainerStyle]}
          keyboardDismissMode={'on-drag'}
          indicatorStyle={themeTabBar}
        >
          <View style={styles.mainParent}>
            {loader ? (
              <Loader loadingStyle={styles.loaderStyle} />
            ) : (
              <View style={styles.main}>
                {movies?.map((movie) => {
                  const posterImage = {
                    uri: `${baseSearchPosterUrl + movie.poster_path}`,
                  };
                  var d = new Date(movie.release_date);

                  var year = d.getFullYear();

                  return (
                    <TouchableOpacity
                      key={movie.id}
                      style={[styles.cards, themeContainerStyle]}
                      onLongPress={() =>
                        onShare(movie.title, movie.id, movie.overview)
                      }
                      onPress={() =>
                        navigation.navigate('Details', {
                          id: movie.id,
                          headerTitle: movie.title,
                        })
                      }
                    >
                      <View style={styles.imageDiv}>
                        <Image
                          source={movie.poster_path ? posterImage : noImage}
                          style={styles.image}
                          placeholder={imageBlurhash}
                            placeholderContentFit='cover'
                          transition={300}
                        />
                      </View>
                      <View style={styles.infoDiv}>
                        <View style={styles.titleDiv}>
                          <Text style={[styles.title, themeTextStyle]}>
                            {movie.original_title} ({year})
                          </Text>
                        </View>
                        <View style={styles.ratingDiv}>
                          <Image
                            source={tmdbLogo}
                            style={styles.tmdbLogo}
                            contentFit='contain'
                          />
                          <Text style={[styles.rating, themeTextStyle]}>
                            {Math.floor((movie.vote_average * 100) / 10)}%
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          <View style={styles.view}></View>
        </ScrollView>
      </View>
    </>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    width: deviceWidth,
  },
  view: {
    height: 75,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    paddingTop: 5,
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  mainParent: {
    flex: 1,
    
  },
  image: {
    width: deviceWidth / 4.3,
    height: deviceWidth / 3.24,
    backgroundColor: 'grey',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  imageDiv: {
 
  },
  cards: {
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    // borderColor: '#000',
    // borderWidth: 1,
    borderRadius: borderRadius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.2,
  },
  infoDiv: {
    flex: 1,
    flexDirection: 'column',
    height: '50%',
  },
  titleDiv: {
    marginLeft: 15,
  },
  title: {
    fontSize: 17,
  },
  rating: {
    marginLeft: 6,
  },
  ratingDiv: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  tmdbLogo: {
    width: 25,
    height: 12,
  },
  loaderStyle: {
    paddingTop: deviceHeight / 4.5,
    paddingBottom: deviceHeight,
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

export default SearchResults;
