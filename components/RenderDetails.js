import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  detailsMovieUrl,
  apiKey,
  basePosterUrl,
  baseBackdropUrl,
  baseProfileUrl,
} from '../settings/api';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Loader from '../components/Loader';
import * as WebBrowser from 'expo-web-browser';
import i18n from 'i18n-js';
import axios from 'axios';
import { useColorScheme } from 'react-native-appearance';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import posterLoader from '../assets/poster-loader.jpg';
import noImage from '../assets/no-image.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const RenderDetails = ({ navigation, id }) => {
  const [loader, setLoader] = useState(true);
  const [movie, setMovie] = useState([]);
  const [appearance, setAppearance] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
          console.log(value);
          setAppearance(value);
        } else {
          setAppearance('auto');
          console.log('there is no appearance set');
        }
      } catch (e) {
        alert('error reading home value');
      }
    };
    getAppearance();
  }, []);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const scrollBarTheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBtnBackground =
    colorScheme === 'light'
      ? styles.lightThemeBtnBackground
      : styles.darkThemeBtnBackground;

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get(
          `${
            detailsMovieUrl +
            id +
            apiKey +
            '&append_to_response=credits,recommendations'
          }`
        );
        setMovie(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    getMovie();
  }, [id]);

  var d = new Date(movie.release_date);

  var year = d.getFullYear();
  var month = monthNames[d.getMonth()];
  var day = d.getDate();
  var releaseDate = `${day}. ${month} ${year}`;

  let runtime = timeConvert(movie.runtime);
  function timeConvert(num) {
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    let hourNaming = i18n.t('hour');
    if (rhours > 1) {
      hourNaming = i18n.t('hours');
    }
    return rhours + hourNaming + rminutes + ' min';
  }

  const iconStar = (
    <FontAwesome5
      name={'star'}
      solid
      style={{ color: 'red', fontSize: globalFontsize }}
    />
  );

  const goToWebsite = () => {
    WebBrowser.openBrowserAsync(movie.homepage);
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader />
      ) : (
        <ScrollView indicatorStyle={scrollBarTheme}>
          <View style={styles.main}>
            <ImageBackground
              source={{
                uri: `${baseBackdropUrl + movie.backdrop_path}`,
              }}
              style={styles.backdrop}
              blurRadius={2}
              defaultSource={posterLoader}
              ImageCacheEnum={'force-cache'}
            >
              <View style={styles.child} />
            </ImageBackground>
            <Image
              source={{
                uri: `${basePosterUrl + movie.poster_path}`,
              }}
              defaultSource={posterLoader}
              ImageCacheEnum={'force-cache'}
              style={styles.posterImg}
            />
            <Text style={[styles.title, themeTextStyle]} selectable>
              {movie.title} <Text>({year})</Text>
            </Text>
            {movie.tagline ? (
              <Text style={[styles.tagline, themeTextStyle]}>
                {movie.tagline}
              </Text>
            ) : null}
            <Text style={[styles.rating, themeTextStyle]}>
              {iconStar} {movie.vote_average}/10 ({movie.vote_count}{' '}
              {i18n.t('votes')})
            </Text>
            <Text style={[styles.genre, themeTextStyle]}>
              <Text style={styles.category}>{i18n.t('releaseDate')}</Text>{' '}
              {releaseDate}
            </Text>
            <Text style={[styles.genre, styles.runtime, themeTextStyle]}>
              <Text style={styles.category}>{i18n.t('runtime')}</Text> {runtime}
            </Text>
            <Text style={[styles.genre, themeTextStyle]}>
              <Text style={styles.category}>{i18n.t('status')}</Text>{' '}
              {movie.status}
            </Text>
            {movie.budget !== 0 ? (
              <Text style={[styles.genre, themeTextStyle]}>
                <Text style={styles.category}>{i18n.t('budget')}</Text> $
                {movie.budget.toLocaleString()}
              </Text>
            ) : null}
            {movie.revenue !== 0 ? (
              <Text style={[styles.genre, themeTextStyle]}>
                <Text style={styles.category}>{i18n.t('revenue')}</Text> $
                {movie.revenue.toLocaleString()}
              </Text>
            ) : null}

            <Text style={[styles.genre, themeTextStyle]}>
              <Text style={styles.category}>{i18n.t('genres')}</Text>{' '}
              {movie.genres?.map((genre) => genre.name + ' ')}
            </Text>
            {movie.homepage ? (
              <View style={styles.homepageButtonMain}>
                <TouchableOpacity
                  style={styles.homepageButtonDiv}
                  onPress={goToWebsite}
                >
                  <Text
                    style={[
                      styles.homepageButton,
                      themeTextStyle,
                      themeBtnBackground,
                    ]}
                  >
                    {i18n.t('homepage')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <Text style={[styles.overview, themeTextStyle]}>
              {movie.overview}
            </Text>
          </View>
          <View style={styles.castMain}>
            <Text style={[styles.castHeading, themeTextStyle]}>
              {i18n.t('cast')}
            </Text>
            <ScrollView horizontal={true} indicatorStyle={scrollBarTheme}>
              <View style={styles.castDiv}>
                {movie.credits.cast.slice(0, 20).map((cast, idx) => {
                  const profilePicture = {
                    uri: `${baseProfileUrl + cast.profile_path}`,
                  };
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        navigation.push('PersonDetails', {
                          id: cast.id,
                          creditId: cast.credit_id,
                          headerTitle: cast.name,
                        })
                      }
                    >
                      <View style={styles.castCard}>
                        <Image
                          style={styles.profileImage}
                          source={cast.profile_path ? profilePicture : noImage}
                          ImageCacheEnum={'force-cache'}
                        />
                        <Text style={[styles.textName, themeTextStyle]}>
                          {cast.name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[styles.textCharacter, themeTextStyle]}
                        >
                          {cast.character}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
          <View style={styles.moviesMain}>
            <Text style={[styles.moviesHeading, themeTextStyle]}>
              {i18n.t('recommendations')}
            </Text>
            <ScrollView horizontal={true} indicatorStyle={scrollBarTheme}>
              <View style={styles.moviesDiv}>
                {movie.recommendations.results
                  .slice(0, 10)
                  .map((movie, idx) => {
                    if (movie.poster_path !== null) {
                      return (
                        <TouchableOpacity
                          style={styles.moviesCard}
                          key={idx}
                          onPress={() =>
                            navigation.push('Details', {
                              id: movie.id,
                              headerTitle: movie.title,
                            })
                          }
                        >
                          <Image
                            style={styles.posterImage}
                            source={{
                              uri: `${basePosterUrl + movie.poster_path}`,
                            }}
                            ImageCacheEnum={'force-cache'}
                          />
                          <Text style={[styles.textRating, themeTextStyle]}>
                            <FontAwesome5
                              name={'star'}
                              solid
                              style={{ color: 'red', fontSize: 13 }}
                            />{' '}
                            {movie.vote_average}/10
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '300';
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    width: deviceWidth,
    justifyContent: 'center',
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  posterImg: {
    width: 120,
    height: 180,
    marginTop: -250 / 2,
    marginLeft: 20,
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 22,
    marginRight: 22,
    fontSize: 20,
    fontWeight: 'bold',
  },
  overview: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    lineHeight: 29,
  },
  genre: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: globalPadding,
    marginBottom: globalPadding,
    lineHeight: 29,
  },
  runtime: {
    marginBottom: globalPadding * 4,
  },
  child: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  rating: {
    marginLeft: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    marginBottom: globalPadding,
  },
  tagline: {
    marginLeft: 22,
    opacity: 0.7,
    fontSize: 16,
  },
  category: {
    opacity: 0.7,
  },
  castMain: {
    marginTop: 25 + globalPadding,
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  castDiv: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  castCard: {
    alignItems: 'center',
    marginRight: 20,
    width: deviceWidth / 4.5,
    textAlign: 'center',
  },
  profileImage: {
    width: deviceWidth / 4.5,
    height: deviceWidth / 4.5,
    marginBottom: 8,
    borderRadius: 50,
  },
  textName: {
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  textCharacter: {
    paddingTop: 5,
    fontSize: 13,
    textAlign: 'center',
  },
  castHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  homepageButton: {
    fontSize: 17,
    fontWeight: '600',
    padding: 8,
  },
  homepageButtonMain: {
    alignItems: 'flex-start',
  },
  homepageButtonDiv: {
    marginLeft: 22,
    marginTop: globalPadding * 7,
    marginBottom: globalPadding * 3,
  },
  moviesMain: {
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  moviesDiv: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  moviesCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  posterImage: {
    width: deviceWidth / 4.5,
    height: deviceWidth / 3,
    marginBottom: 13,
  },
  textRating: {
    paddingTop: 8,
    fontSize: 12,
  },
  moviesHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
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
  lightThemeBtnBackground: {
    backgroundColor: 'lightgrey',
  },
  darkThemeBtnBackground: {
    backgroundColor: '#4a4b4d',
  },
});

export default RenderDetails;
