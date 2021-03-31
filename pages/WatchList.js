import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  Image,
  Animated,
  Share,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import { basePosterUrl, searchMovieUrl, apiKey } from '../settings/api';
import Loader from '../components/Loader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import i18n from 'i18n-js';
import { useColorScheme } from 'react-native-appearance';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import posterLoader from '../assets/poster-loader.jpg';
import noImage from '../assets/no-image.jpg';
import logoTransparent from '../assets/icon-transparent.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { styles } from './Home';
import ButtonStyles from '../styles/buttons';

const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;

const WatchList = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState();
  const [accountId, setAccountId] = useState();
  const [sessionId, setSessionId] = useState();
  const [loader, setLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(true);
  const [showWatchList, setShowWatchList] = useState(false);
  const [pageNumber, setPageNumber] = useState(2);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [appearance, setAppearance] = useState();
  const [whileLoading, setWhileLoading] = useState(true);

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
  const themeSearchbar = colorScheme === 'light' ? true : false;
  const searchBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTabBar = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  useEffect(() => {
    getMultiple();
  }, [refreshIndicator]);

  const getMultiple = async () => {
    let fromLocalStorage;
    try {
      fromLocalStorage = await AsyncStorage.multiGet([
        'accountId',
        'sessionId',
      ]);
    } catch (e) {
      console.log(e);
    }
    const accountId = fromLocalStorage[0][1];
    const sessionId = fromLocalStorage[1][1];

    {
      sessionId ? getMovies(accountId, sessionId) : null;
    }
    setAccountId(accountId);
    setSessionId(sessionId);
  };

  const getMultipleAgain = async () => {
    let fromLocalStorage;
    try {
      fromLocalStorage = await AsyncStorage.multiGet([
        'accountId',
        'sessionId',
      ]);
    } catch (e) {
      console.log(e);
    }
    const sessionId = fromLocalStorage[1][1];
    {
      sessionId ? setShowWatchList(true) : setShowWatchList(false);
    }

    setAccountId(accountId);
    setSessionId(sessionId);
  };

  useEffect(() => {
    {
      sessionId ? getMovies(accountId, sessionId) : null;
    }
  }, [sessionId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMultipleAgain();
    });

    return unsubscribe;
  }, [navigation]);

  const getMovies = async (accountIdParam, sessionIdParam) => {
    setLoader(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountIdParam}/watchlist/movies${apiKey}&session_id=${sessionIdParam}&sort_by=created_at.desc&page=1`
      );
      setMovies(response.data.results);
      setTotalPageNumberFromApi(response.data.total_pages);
      setRefreshing(false);
      setLoader(false);
      console.log('Fetched Watchlist movies');
    } catch (e) {
      console.log(e);
    } finally {
      setWhileLoading(true);
    }
  };

  const onBottomLoad = async () => {
    if (pageNumber <= totalPageNumberFromApi) {
      setBottomLoader(true);
      setPageNumber(pageNumber + 1);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies${apiKey}&session_id=${sessionId}&sort_by=created_at.desc&page=${pageNumber}`
        );
        setMovies((movies) => [...movies, ...response.data.results]);
      } catch (e) {
        console.log(e);
      } finally {
        console.log('loaded new page');
        setBottomLoader(false);
      }
    }
  };

  function onRefresh() {
    setRefreshing(true);
    setRefreshIndicator(!refreshIndicator);
    setWhileLoading(true);
    setPageNumber(2);
  }

  const getSearch = async (title) => {
    setLoader(true);
    try {
      const response = await axios.get(`${searchMovieUrl + `&query=${title}`}`);
      setMovies(response.data.results);
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  function handleSearch(inputValue) {
    setSearch(inputValue);
    setLoader(true);
    var title = inputValue.replace(/\d+/g, '').trim();
    if (inputValue.length >= 1) {
      getSearch(title);
    } else {
      setRefreshIndicator(!refreshIndicator);
    }
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 0;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

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
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        {showWatchList == true ? (
          <>
            <SearchBar
              placeholder={i18n.t('search')}
              onChangeText={(text) => handleSearch(text)}
              lightTheme={themeSearchbar}
              containerStyle={{
                backgroundColor: 'transparent',
                paddingLeft: 0,
                paddingRight: 0,
                width: '90%',
                paddingBottom: 30,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
              }}
              searchIcon={{ size: 25, color: searchBarTheme }}
              placeholderTextColor={searchBarTheme}
              inputStyle={{ color: searchBarTheme }}
              round
              value={search}
            />
            <Text style={[styles.heading, themeTextStyle]}>
              {i18n.t('watchList')}
            </Text>
            <Text style={[styles.description, themeTextStyle]}>
              {i18n.t('watchListDescription')}
            </Text>
            <SafeAreaView style={styles.container}></SafeAreaView>
            <ScrollView
              style={[styles.scrollView, themeContainerStyle]}
              keyboardDismissMode={'on-drag'}
              indicatorStyle={themeTabBar}
              onScroll={({ nativeEvent }) => {
                if (isCloseToBottom(nativeEvent)) {
                  console.log('load bottom');
                  if (movies.length >= 1) {
                    onBottomLoad();
                  }
                }
              }}
              scrollEventThrottle={400}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  tintColor='red'
                  onRefresh={onRefresh}
                />
              }
            >
              <View style={styles.mainParent}>
                {loader ? (
                  <Loader loadingStyle={styles.loaderStyle} />
                ) : (
                  <>
                    {movies.length >= 1 ? (
                      <View style={styles.main}>
                        {movies?.map((movie) => {
                          const posterImage = {
                            uri: `${basePosterUrl + movie.poster_path}`,
                          };
                          return (
                            <TouchableOpacity
                              key={movie.id}
                              style={styles.cards}
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
                              <Animated.Image
                                source={
                                  movie.poster_path ? posterImage : noImage
                                }
                                style={[
                                  styles.image,
                                  {
                                    opacity: fadeAnim,
                                  },
                                ]}
                                resizeMode='contain'
                                defaultSource={posterLoader}
                                ImageCacheEnum={'force-cache'}
                                onLoad={fadeIn}
                              />
                              <Text style={[styles.rating, themeTextStyle]}>
                                {iconStar} {movie.vote_average}/10
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <>
                        {whileLoading ? (
                          <View style={styles.noMoviesDiv}>
                            <Text style={[styles.noMoviesText, themeTextStyle]}>
                              {i18n.t('noMoviesInWatchlist')}
                            </Text>
                            <FontAwesome5
                              name={'heart-broken'}
                              style={{ color: 'red', fontSize: 22 }}
                            />
                          </View>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </View>
              {bottomLoader ? (
                <Loader loadingStyle={{ paddingTop: 0, paddingBottom: 100 }} />
              ) : null}
              <View style={styles.view}></View>
            </ScrollView>
          </>
        ) : (
          <View style={[styles.loginSection, themeBoxStyle]}>
            <Image source={logoTransparent} style={styles.loginImage} />
            <Text style={[styles.loginSectionText, themeTextStyle]}>
              {i18n.t('watchListRequirement')}
            </Text>
            <TouchableOpacity
              style={[ButtonStyles.mediumButtonStyling, styles.loginButton]}
              onPress={() =>
                navigation.navigate('Login', {
                  headerTitle: i18n.t('login'),
                })
              }
            >
              <Text style={ButtonStyles.buttonText}>{i18n.t('login')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default WatchList;
