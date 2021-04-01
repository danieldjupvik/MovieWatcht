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
  Share,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import {
  baseUrl,
  basePosterUrl,
  searchMovieUrl,
  topRatedMovieUrl,
  upcomingMovieUrl,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { primaryButton, secondaryButton } from '../colors/colors';
import * as Localization from 'expo-localization';

const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;

const Home = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(true);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [pageNumber, setPageNumber] = useState(2);
  const [appearance, setAppearance] = useState();
  const [regionsText, setRegionsText] = useState();
  const [regionFinal, setRegionFinal] = useState();

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

  const getRegion = async () => {
    try {
      const region = await AsyncStorage.getItem('region');
      const defaultRegion = Platform.OS === 'ios' ? Localization.region : 'NO';
      console.log('region from localstorage ' + region);
      const regionToll = region === 'auto' ? defaultRegion : region;
      if (region !== null) {
        setRegionFinal(regionToll);
      } else {
        setRegionFinal(defaultRegion);
        console.log('there is no region set');
      }
    } catch (e) {
      alert('error reading region value');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRegion();
    });

    return unsubscribe;
  }, [navigation]);

  const defaultColor = useColorScheme();
  let colorScheme = appearance === 'auto' ? defaultColor : appearance;
  const themeSearchbar = colorScheme === 'light' ? true : false;
  const searchBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTabBar = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const defaultRegion = Platform.OS === 'ios' ? Localization.region : 'NO';

  useEffect(() => {
    const theShit = regionFinal ? regionFinal : defaultRegion;
    setRegionsText(theShit);
    setLoader(true);
    const getMovies = async () => {
      try {
        const response = await axios.get(
          `${baseUrl + `&region=${theShit}&page=1`}`
        );
        setMovies(response.data.results);
        setTotalPageNumberFromApi(response.data.total_pages);
        setLoader(false);
        console.log('fresh update');
      } catch (e) {
        console.log(e);
      } finally {
        setRefreshing(false);
      }
    };
    getMovies();
  }, [regionFinal]);

  useEffect(() => {
    const theShit = regionFinal ? regionFinal : defaultRegion;
    console.log(theShit);
    const onRefresh = async () => {
      try {
        const response = await axios.get(
          `${baseUrl + `&region=${theShit}&page=1`}`
        );
        setMovies(response.data.results);
        setTotalPageNumberFromApi(response.data.total_pages);
        console.log('fresh update');
      } catch (e) {
        console.log(e);
      } finally {
        setRefreshing(false);
      }
    };
    onRefresh();
  }, [refreshIndicator]);

  const onBottomLoad = async () => {
    const theShit = regionFinal ? regionFinal : defaultRegion;
    console.log(theShit);

    if (pageNumber <= totalPageNumberFromApi) {
      setBottomLoader(true);
      setPageNumber(pageNumber + 1);
      try {
        const response = await axios.get(
          `${baseUrl + `&region=${theShit}&page=${pageNumber}`}`
        );
        setMovies((movies) => [...movies, ...response.data.results]);
      } catch (e) {
        console.log(e);
      } finally {
        setBottomLoader(false);
      }
    }
  };

  function onRefresh() {
    setRefreshing(true);
    setRefreshIndicator(!refreshIndicator);
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

  const animatePress = new Animated.Value(1);

  const animateIn = () => {
    Animated.timing(animatePress, {
      toValue: 0.93,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.timing(animatePress, {
      toValue: 1,
      duration: 300,
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
          returnKeyType={'search'}
          enablesReturnKeyAutomatically={true}
        />
        <Text style={[styles.heading, themeTextStyle]}>
          {i18n.t('popular')}
        </Text>
        <Text style={[styles.description, themeTextStyle]}>
          {i18n.t('popularDescription')} {regionsText}
        </Text>
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
                      onPressIn={() => animateIn()}
                      onPressOut={() => animateOut()}
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
      </SafeAreaView>
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
    paddingTop: deviceHeight / 4.5,
    paddingBottom: deviceHeight,
  },
  // Watch list styles
  noMoviesDiv: {
    marginTop: deviceHeight / 4.5,
    flexDirection: 'row',
  },
  noMoviesText: {
    fontSize: 19,
    fontWeight: '600',
    marginRight: 10,
  },
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
    backgroundColor: primaryButton,
    marginTop: 20,
    marginBottom: 10,
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

export default Home;
