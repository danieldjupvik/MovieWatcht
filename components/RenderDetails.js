import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
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
  primaryButton,
} from '../colors/colors';
import { borderRadius, boxShadow } from '../styles/globalStyles';
import ButtonStyles from '../styles/buttons';
import posterLoader from '../assets/poster-loader.jpg';
import noImage from '../assets/no-image.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import imdbLogo from '../assets/imdb-logo.png';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import freshNegative from '../assets/freshNegative.png';
import freshPositive from '../assets/freshPositive.png';

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
  const [videos, setVideos] = useState([]);
  const [appearance, setAppearance] = useState();
  const [movieExist, setMovieExist] = useState();
  const [sessionId, setSessionId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [stateFinish, setStateFinish] = useState(true);
  const [digitalRelease, setDigitalRelease] = useState();
  const [releaseNote, setReleaseNote] = useState();
  const [omdb, setOmdb] = useState();
  const [rottenTomato, setRottenTomato] = useState();
  const [imdbVotes, setImdbVotes] = useState();

  useEffect(() => {
    const getAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('appearance');
        if (value !== null) {
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
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;
  const themeButtonStyle =
    colorScheme === 'light' ? styles.darkThemeBox : styles.lightThemeBox;
  const themeButtonTextStyle =
    colorScheme === 'light' ? styles.darkThemeText : styles.lightThemeText;

  useEffect(() => {
    let isCancelled = false;
    setStateFinish(false);
    const getMovie = async () => {
      try {
        const videos = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos${apiKey}&language=en-US'
          }`
        );
        const sessionId = await AsyncStorage.getItem('sessionId');
        const response = await axios.get(
          `${
            detailsMovieUrl +
            id +
            apiKey +
            '&append_to_response=translations,recommendations,similar,credits,release_dates'
          }`
        );
        setVideos(videos.data.results);
        getOmdbInfo(response.data.imdb_id);
        setMovie(response.data);
        setSessionId(sessionId);
        {
          response.data.release_dates.results
            .filter((region) => region.iso_3166_1 === 'US')[0]
            .release_dates.filter((type) => type.type === 4)[0]
            ? (setDigitalRelease(
                response.data.release_dates.results
                  .filter((region) => region.iso_3166_1 === 'US')[0]
                  .release_dates.filter((type) => type.type === 4)[0]
                  .release_date
              ),
              setReleaseNote(
                response.data.release_dates.results
                  .filter((region) => region.iso_3166_1 === 'US')[0]
                  .release_dates.filter((type) => type.type === 4)[0].note
              ))
            : null;
        }

        {
          sessionId ? getMovieState(sessionId) : null;
        }
      } catch (e) {
        console.log(e);
      } finally {
      }
    };
    getMovie();
    return () => {
      isCancelled = true;
    };
  }, []);

  const getOmdbInfo = async (imdbId) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=f2b37edc&i=${imdbId}`
      );
      setOmdb(response.data);
      setImdbVotes(JSON.parse(response.data.imdbVotes.replaceAll(',', '')));
      setRottenTomato(
        JSON.parse(
          response.data.Ratings.filter(
            (source) => source.Source === 'Rotten Tomatoes'
          )
            .map((type) => type.Value)[0]
            .replace('%', '')
        )
      );
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  const getMovieState = async (session) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/account_states${apiKey}&session_id=${session}`
      );
      console.log(response.data.watchlist);
      setMovieExist(response.data.watchlist);
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      setStateFinish(true);
    }
  };

  const watchListFunction = () => {
    if (sessionId) {
      setMovieExist(!movieExist);
      if (movieExist) {
        removeMovieToWatchlist();
        console.log('movie was removed');
      } else {
        setMovieToWatchlist();
        console.log('movie was added');
      }
    } else {
      setModalVisible(true);
    }
  };

  const setMovieToWatchlist = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.themoviedb.org/3/account/${id}/watchlist${apiKey}&session_id=${sessionId}`,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          media_type: 'movie',
          media_id: movie.id,
          watchlist: true,
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    } finally {
    }
    return response;
  };

  const removeMovieToWatchlist = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.themoviedb.org/3/account/${id}/watchlist${apiKey}&session_id=${sessionId}`,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          media_type: 'movie',
          media_id: movie.id,
          watchlist: false,
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    } finally {
    }
    return response;
  };

  // premiere
  var d = new Date(movie.release_date);

  var year = d.getFullYear();
  var month = monthNames[d.getMonth()];
  var day = d.getDate();
  var releaseDate = `${day}. ${month} ${year}`;

  var dd = new Date(digitalRelease);
  var yearDigital = dd.getFullYear();
  var monthDigital = monthNames[dd.getMonth()];
  var dayDigital = dd.getDate();
  var digitalReleaseDate = `${dayDigital}. ${monthDigital} ${yearDigital}`;

  // Runtime
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

  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed() + 'k';
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num < 900) {
      return num;
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <View style={modal.centeredView}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={[
              modal.centeredView,
              modalVisible ? { backgroundColor: 'rgba(0,0,0,0.5)' } : '',
            ]}
          >
            <View style={[modal.modalView, themeBoxStyle]}>
              <Text style={[modal.modalText, themeTextStyle]}>
                {i18n.t('watchlistModalTex')}
              </Text>
              <TouchableOpacity
                style={[
                  ButtonStyles.smallButtonStyling,
                  { backgroundColor: primaryButton },
                ]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={modal.textStyle}>{i18n.t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {loader ? (
        <Loader loadingStyle={styles.Loader} />
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme}>
            <View style={styles.main}>
              <ImageBackground
                source={{
                  uri: `${baseBackdropUrl + movie.backdrop_path}`,
                }}
                style={styles.backdrop}
                defaultSource={posterLoader}
                ImageCacheEnum={'force-cache'}
              >
                <View style={styles.child} />
              </ImageBackground>
              <View style={[styles.imageDiv, boxShadow]}>
                <Image
                  source={{
                    uri: `${basePosterUrl + movie.poster_path}`,
                  }}
                  defaultSource={posterLoader}
                  ImageCacheEnum={'force-cache'}
                  style={styles.posterImg}
                />
                {!stateFinish && sessionId ? (
                  <Loader
                    loadingStyle={styles.watchListLoader}
                    color={'white'}
                    size={'small'}
                  />
                ) : (
                  <Pressable onPress={watchListFunction}>
                    <View style={styles.watchListDiv}>
                      <FontAwesome5
                        name={'bookmark'}
                        solid={movieExist}
                        style={{ color: 'red', fontSize: 25 }}
                      />
                      <Text style={styles.watchListText}>
                        {i18n.t('watchlistBtn')}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>
              <Text style={[styles.title, themeTextStyle]} selectable>
                {movie.title}
              </Text>
              <View style={styles.underTitleDiv}>
                <View style={styles.underTitleElem}>
                  <Text style={[styles.underTitle, themeTextStyle]}>
                    {year}
                  </Text>
                </View>
                <Text style={[styles.separators, themeTextStyle]}>•</Text>
                <View style={styles.underTitleElem}>
                  <Text style={[styles.underTitle, themeTextStyle]}>
                    {runtime}
                  </Text>
                </View>
                <Text style={[styles.separators, themeTextStyle]}>•</Text>
                <View style={styles.underTitleElem}>
                  <Text style={[styles.underTitle, themeTextStyle]}>
                    {omdb?.Rated}
                  </Text>
                </View>
              </View>
              <Text style={[styles.rating, themeTextStyle]}>
                <Text style={styles.category}>{i18n.t('releaseDate')}</Text>{' '}
                {releaseDate}
              </Text>
              {digitalRelease ? (
                <Text style={[styles.genre, styles.runtime, themeTextStyle]}>
                  <Text style={styles.category}>
                    {i18n.t('digitalReleaseDate')}
                  </Text>{' '}
                  {digitalReleaseDate} {releaseNote ? `(${releaseNote})` : null}
                </Text>
              ) : null}
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
              <Text
                style={[styles.genre, themeTextStyle]}
                onPress={() =>
                  navigation.push('PersonDetails', {
                    id: movie.credits.crew.filter(
                      (crew) => crew.job === 'Director'
                    )[0].id,
                    creditId: movie.credits.crew.filter(
                      (crew) => crew.job === 'Director'
                    )[0].credit_id,
                    headerTitle: movie.credits.crew.filter(
                      (crew) => crew.job === 'Director'
                    )[0].name,
                  })
                }
              >
                <Text style={styles.category}>{i18n.t('director')}</Text>{' '}
                {
                  movie.credits.crew.filter(
                    (crew) => crew.job === 'Director'
                  )[0].name
                }
              </Text>
              <Text style={[styles.genre, themeTextStyle]}>
                <Text style={styles.category}>{i18n.t('genres')}</Text>{' '}
                {movie.genres?.map((genre) => genre.name).join(', ')}
              </Text>

              <View style={[styles.rating, styles.ratingDiv]}>
                {movie.vote_average !== 0 ? (
                  <View style={[styles.ratingWrapper]}>
                    <Image
                      source={tmdbLogo}
                      style={styles.tmdbLogo}
                      resizeMode='contain'
                    />
                    <View style={styles.ratingElem}>
                      <Text style={[themeTextStyle]}>
                        {Math.floor((movie.vote_average * 100) / 10)}%{' '}
                      </Text>
                      <Text style={[styles.ratingCounter, themeTextStyle]}>
                        {numFormatter(movie.vote_count)}
                      </Text>
                    </View>
                  </View>
                ) : null}

                {omdb.imdbRating !== 'N/A' ? (
                  <View style={[styles.ratingWrapper]}>
                    <Image
                      source={imdbLogo}
                      style={styles.imdbLogo}
                      resizeMode='contain'
                    />
                    <View style={styles.ratingElem}>
                      <Text style={[themeTextStyle]}>
                        {omdb?.imdbRating}/10
                      </Text>
                      <Text style={[styles.ratingCounter, themeTextStyle]}>
                        {numFormatter(imdbVotes)}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {rottenTomato ? (
                  <View style={[styles.ratingWrapper]}>
                    <Image
                      source={rottenTomato > 60 ? freshPositive : freshNegative}
                      style={styles.rottenLogo}
                      resizeMode='cover'
                    />
                    <View style={styles.ratingElem}>
                      <Text style={[themeTextStyle]}>{rottenTomato}% </Text>
                      <Text style={[styles.ratingCounter, themeTextStyle]}>
                        {rottenTomato > 60 ? 'Fresh' : 'Rotten'}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.overview, themeTextStyle]}>
                {movie.overview}
              </Text>
            </View>
            <View style={styles.trailerMain}>
              <Text style={[styles.trailerHeading, themeTextStyle]}>
                {i18n.t('extras')}
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.trailerDiv}>
                  {videos
                    .filter(
                      (type) =>
                        type.type === 'Trailer' && type.site === 'YouTube'
                    )
                    .map((video, idx) => {
                      var maxLimit = 32;
                      return (
                        <View style={styles.videoDiv} key={idx}>
                          <View style={boxShadow}>
                            <WebView
                              allowsFullscreenVideo
                              useWebKit
                              allowsInlineMediaPlayback
                              mediaPlaybackRequiresUserAction
                              javaScriptEnabled
                              scrollEnabled={false}
                              style={styles.videoElem}
                              source={{
                                uri: `https://www.youtube.com/embed/${video.key}`,
                              }}
                            />
                          </View>
                          <Text style={[styles.videoText, themeTextStyle]}>
                            {video.name.length > maxLimit
                              ? video.name.substring(0, maxLimit - 3) + '...'
                              : video.name}
                          </Text>
                          <Text style={[styles.typeText, themeTextStyle]}>
                            {video.type}
                          </Text>
                        </View>
                      );
                    })}
                </View>
              </ScrollView>
            </View>
            <View style={styles.castMain}>
              <Text style={[styles.castHeading, themeTextStyle]}>
                {i18n.t('cast')}
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
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
                          <View style={boxShadow}>
                            <Image
                              style={styles.profileImage}
                              source={
                                cast.profile_path ? profilePicture : noImage
                              }
                              ImageCacheEnum={'force-cache'}
                            />
                          </View>
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
            {movie.recommendations.results.length > 0 ? (
              <View style={styles.moviesMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('recommendations')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.moviesDiv}>
                    {movie.recommendations.results
                      .slice(0, 50)
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
                              <View style={boxShadow}>
                                <Image
                                  style={styles.posterImage}
                                  source={{
                                    uri: `${basePosterUrl + movie.poster_path}`,
                                  }}
                                  ImageCacheEnum={'force-cache'}
                                />
                              </View>
                              <View style={styles.ratingDivRec}>
                                <Image
                                  source={tmdbLogo}
                                  style={styles.tmdbLogoRec}
                                  resizeMode='contain'
                                />
                                <Text
                                  style={[styles.textRating, themeTextStyle]}
                                >
                                  {Math.floor((movie.vote_average * 100) / 10)}%
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        }
                      })}
                  </View>
                </ScrollView>
              </View>
            ) : null}
            {movie.similar.results.length > 0 ? (
              <View style={styles.moviesMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('similar')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.moviesDiv}>
                    {movie.similar.results.slice(0, 50).map((movie, idx) => {
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
                            <View style={boxShadow}>
                              <Image
                                style={styles.posterImage}
                                source={{
                                  uri: `${basePosterUrl + movie.poster_path}`,
                                }}
                                ImageCacheEnum={'force-cache'}
                              />
                            </View>
                            <View style={styles.ratingDivRec}>
                              <Image
                                source={tmdbLogo}
                                style={styles.tmdbLogoRec}
                                resizeMode='contain'
                              />
                              <Text style={[styles.textRating, themeTextStyle]}>
                                {Math.floor((movie.vote_average * 100) / 10)}%
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    })}
                  </View>
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '300';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchListLoader: {
    marginTop: -48,
    marginRight: 65,
  },
  scrollViewWrapper: {
    marginBottom: 45,
  },
  main: {
    width: deviceWidth,
    justifyContent: 'center',
  },
  Loader: {
    marginBottom: deviceHeight / 2.2,
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  child: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  posterImg: {
    width: 120,
    height: 180,
    marginTop: -250 / 2,
    marginLeft: 20,
    borderRadius: borderRadius,
  },
  imageDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  watchListDiv: {
    marginTop: -40,
    marginRight: 50,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchListText: {
    fontWeight: '600',
    fontSize: 19,
    color: 'white',
    marginLeft: 10,
  },
  title: {
    marginTop: 30,
    marginBottom: 12,
    marginLeft: 22,
    marginRight: 22,
    fontSize: 19,
    fontWeight: 'bold',
  },
  underTitleDiv: {
    marginLeft: 22,
    marginRight: 22,
    flex: 1,
    flexDirection: 'row',
  },
  underTitleElem: {},
  separators: {
    opacity: 0.6,
    marginRight: 7.5,
    marginLeft: 7.5,
  },
  underTitle: {
    opacity: 0.6,
    fontWeight: '400',
    fontSize: 14.5,
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
  rating: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    marginBottom: globalPadding,
  },
  ratingDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingElem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 4,
  },
  ratingCounter: {
    opacity: 0.7,
  },
  imdbLogo: {
    width: 40,
    height: 18,
    marginRight: 7,
  },
  tmdbLogo: {
    width: 40,
    height: 17,
    marginRight: 7,
  },
  rottenLogo: {
    width: 25,
    height: 25,
    marginRight: 7,
  },
  tagline: {
    marginLeft: 22,
    opacity: 0.7,
    fontSize: 16,
  },
  category: {
    opacity: 0.7,
  },
  trailerMain: {
    marginTop: 35 + globalPadding,
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  trailerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  trailerDiv: {
    flex: 1,
    flexDirection: 'row',
  },
  videoDiv: {
    textAlign: 'center',
  },
  videoText: {
    fontWeight: '600',
    fontSize: 13,
  },
  typeText: {
    paddingTop: 5,
    opacity: 0.7,
  },
  videoElem: {
    marginBottom: 10,
    width: deviceWidth / 1.9,
    height: deviceWidth / 3.4,
    marginRight: 30,
    borderRadius: borderRadius,
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
    opacity: 0.7,
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
    borderRadius: borderRadius,
  },
  textRating: {
    // paddingTop: 8,
    marginLeft: 6,
    fontSize: 12,
  },
  ratingDivRec: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tmdbLogoRec: {
    width: 25,
    height: 12,
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
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
});

export const modal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: borderRadius,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 25,
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 22,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 25,
  },
});
export default RenderDetails;
