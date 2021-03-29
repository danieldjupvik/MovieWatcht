import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
  Image,
  Platform,
  Animated,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import {
  baseUrl,
  basePosterUrl,
  searchMovieUrl,
  topRatedMovieUrl,
  upcomingMovieUrl,
  apiKey,
} from '../settings/api';
import Loader from '../components/Loader';
import { BlurView } from 'expo-blur';
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
import testVariable from './Login';

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

  const colorScheme = useColorScheme();
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

    reRenderWhenLoggedIn(fromLocalStorage[1][1]);

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

    reRenderWhenLoggedIn(sessionId);
  };

  const reRenderWhenLoggedIn = () => {
    const subscribed = navigation.addListener('focus', () => {
      getMultipleAgain();
      return subscribed;
    });
  };

  const getMovies = async (accountIdParam, sessionIdParam) => {
    setLoader(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountIdParam}/watchlist/movies${apiKey}&session_id=${sessionIdParam}&sort_by=created_at.asc&page=1`
      );
      setMovies(response.data.results);
      setRefreshing(false);
      setLoader(false);
      console.log('fresh update');
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const onBottomLoad = async () => {
    setBottomLoader(true);
    setPageNumber(pageNumber + 1);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies${apiKey}&session_id=${sessionId}&sort_by=created_at.asc&page=${pageNumber}`
      );
      setMovies((movies) => [...movies, ...response.data.results]);
    } catch (e) {
      console.log(e);
    } finally {
      setBottomLoader(false);
    }
  };

  function onRefresh() {
    setRefreshing(true);
    setRefreshIndicator(!refreshIndicator);
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
    const paddingToBottom = 150;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  // useEffect(() => {
  //   const subscribed = navigation.addListener('focus', () => {
  //     getMultiple();
  //     return subscribed;
  //   });
  // }, [sessionId]);

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
                  onBottomLoad();
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
                  <View style={styles.main}>
                    {movies?.map((movie) => {
                      const posterImage = {
                        uri: `${basePosterUrl + movie.poster_path}`,
                      };
                      return (
                        <TouchableOpacity
                          key={movie.id}
                          style={styles.cards}
                          onPress={() =>
                            navigation.navigate('Details', {
                              id: movie.id,
                              headerTitle: movie.title,
                            })
                          }
                        >
                          <Animated.Image
                            source={movie.poster_path ? posterImage : noImage}
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
              style={styles.loginButton}
              onPress={() =>
                navigation.navigate('Login', {
                  headerTitle: i18n.t('login'),
                })
              }
            >
              <Text style={[styles.loginButtonText, themeTextStyle]}>
                {i18n.t('login')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  loginSection: {
    width: deviceWidth - 50,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },
  loginImage: {
    width: 140,
    height: 140,
  },
  loginSectionText: {
    fontWeight: '500',
    fontSize: 17,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#56b6d6',
    padding: 15,
    paddingLeft: 44,
    paddingRight: 44,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'black',
    fontWeight: '400',
    fontSize: 17,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  view: {
    height: 75,
  },
  scrollView: {
    // marginHorizontal: 20,
    height: '100%',
    width: '100%',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  mainParent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: deviceWidth / 2.23,
  },
  cards: {
    width: deviceWidth / 3,
    height: deviceWidth / 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    marginTop: 8,
  },
  description: {
    fontSize: 15,
    paddingBottom: 20,
  },
  loaderStyle: {
    marginTop: deviceHeight / 4.5,
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

export default WatchList;
