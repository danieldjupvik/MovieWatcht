import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Animated,
  Share,
  Image,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import {
  basePosterUrl,
  searchMovieUrl,
  topRatedMovieUrl,
} from '../settings/api';
import Loader from '../components/Loader';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import i18n from 'i18n-js';
import { useColorScheme } from 'react-native-appearance';
import { styles } from './Home';
import posterLoader from '../assets/poster-loader.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import noImage from '../assets/no-image.jpg';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import * as Localization from 'expo-localization';

const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;

const TopRated = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [refreshIndicator, setRefreshIndicator] = useState(true);
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
    getRegion();
  }, []);

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

  const defaultRegion = Localization.region
    ? Platform.OS === 'ios'
      ? Localization.region
      : 'US'
    : 'US';

  useEffect(() => {
    const theShit = regionFinal ? regionFinal : defaultRegion;
    setRegionsText(theShit);
    setLoader(true);
    const getMovies = async () => {
      try {
        const response = await axios.get(
          `${topRatedMovieUrl + `&region=${theShit}&page=1`}`
        );
        setMovies(response.data.results);
        setTotalPageNumberFromApi(response.data.total_pages);
        setRefreshing(false);
        console.log('fresh update');
        setLoader(false);
      } catch (e) {
        console.log(e);
      } finally {
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
          `${topRatedMovieUrl + `&region=${theShit}&page=1`}`
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
          `${topRatedMovieUrl + `&region=${theShit}&page=${pageNumber}`}`
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
    var title = inputValue.replaceAll(' ', '%').trim();
    if (title.length >= 1) {
      getSearch(title);
    } else {
      setRefreshIndicator(!refreshIndicator);
      setLoader(false);
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
        />
        <Text style={[styles.heading, themeTextStyle]}>
          {i18n.t('topRated')}
        </Text>
        <Text style={[styles.description, themeTextStyle]}>
          {i18n.t('topRatedDescription')} {regionsText}
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
                      <View style={styles.imageDiv}>
                        <Animated.Image
                          source={movie.poster_path ? posterImage : noImage}
                          style={[
                            styles.image,
                            {
                              opacity: fadeAnim,
                            },
                          ]}
                          resizeMode='cover'
                          defaultSource={posterLoader}
                          ImageCacheEnum={'force-cache'}
                          onLoad={fadeIn}
                        />
                      </View>
                      <View style={styles.ratingDiv}>
                        <Image
                          source={tmdbLogo}
                          style={styles.tmdbLogo}
                          resizeMode='contain'
                        />
                        <Text style={[styles.rating, themeTextStyle]}>
                          {Math.floor((movie.vote_average * 100) / 10)}%
                        </Text>
                      </View>
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

export default TopRated;
