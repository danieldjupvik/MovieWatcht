import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Text,
  FlatList,
  View,
  Pressable,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { SearchBar } from '@rneui/themed';
import { useAppearance } from '../components/AppearanceContext';
import axios from 'axios';
import { searchMovieUrl, apiKey } from '../settings/api';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { FontAwesome5 } from '@expo/vector-icons';
import i18n from 'i18n-js';
import logoTransparent from '../assets/icon-transparent.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles as styles } from '../styles/sharedStyles';
import ButtonStyles from '../styles/buttons';

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
  const [whileLoading, setWhileLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(true);
  const isBottomLoadingRef = useRef(false);

  const { colorScheme } = useAppearance();
  const themeSearchbar = colorScheme === 'light' ? true : false;
  const searchBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTabBar = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;
  const themeSearchBarStyle = colorScheme === 'light' ? '#bfc5ce' : '#313337';

  // Initialize Page
  useEffect(() => {
    getAccountAndSession();
  }, [refreshIndicator]);

  const getAccountAndSession = async () => {
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
      sessionId ? getWatchListMovies(accountId, sessionId) : null;
    }
    setAccountId(accountId);
    setSessionId(sessionId);
  };

  const checkIfLoggedIn = async () => {
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
      sessionId ? getWatchListMovies(accountId, sessionId) : null;
    }
  }, [sessionId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkIfLoggedIn();
    });

    return unsubscribe;
  }, [navigation]);

  const getWatchListMovies = async (accountIdParam, sessionIdParam) => {
    setLoader(true);
    isBottomLoadingRef.current = false;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountIdParam}/watchlist/movies${apiKey}&session_id=${sessionIdParam}&sort_by=created_at.desc&page=1`
      );
      setMovies(response.data.results);
      setTotalPageNumberFromApi(response.data.total_pages);
      setPageNumber(2);
      setRefreshing(false);
      setLoader(false);
      console.log('Fetched Watchlist movies');
    } catch (e) {
      console.log(e);
    } finally {
      setWhileLoading(true);
    }
  };

  const onBottomLoad = useCallback(async () => {
    if (
      isBottomLoadingRef.current ||
      !totalPageNumberFromApi ||
      pageNumber > totalPageNumberFromApi
    ) {
      return;
    }

    isBottomLoadingRef.current = true;
    setBottomLoader(true);
    const nextPage = pageNumber;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies${apiKey}&session_id=${sessionId}&sort_by=created_at.desc&page=${nextPage}`
      );
      setMovies((currentMovies) => {
        const currentIds = new Set(currentMovies.map((movie) => movie.id));
        const uniqueNewMovies = response.data.results.filter(
          (movie) => !currentIds.has(movie.id)
        );
        return [...currentMovies, ...uniqueNewMovies];
      });
      setPageNumber((currentPage) => currentPage + 1);
    } catch (e) {
      console.log(e);
    } finally {
      console.log('loaded new page');
      isBottomLoadingRef.current = false;
      setBottomLoader(false);
    }
  }, [accountId, sessionId, totalPageNumberFromApi, pageNumber]);

  // on refresh
  const refreshFetch = async () => {
    isBottomLoadingRef.current = false;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies${apiKey}&session_id=${sessionId}&sort_by=created_at.desc&page=1`
      );
      setMovies(response.data.results);
      setTotalPageNumberFromApi(response.data.total_pages);
      setPageNumber(2);
      setRefreshing(false);
      console.log('Fetched Watchlist movies');
    } catch (e) {
      console.log(e);
    } finally {
      setWhileLoading(true);
    }
  };

  function onRefresh() {
    setRefreshing(true);
    refreshFetch();
    setWhileLoading(true);
    setPageNumber(2);
    isBottomLoadingRef.current = false;
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
    }
  }

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const renderItem = useCallback(({ item }) => (
    <MovieCard
      id={item.id}
      posterPath={item.poster_path}
      title={item.title}
      voteAverage={item.vote_average}
      colorScheme={colorScheme}
    />
  ), [colorScheme]);

  const ListFooter = useCallback(() => (
    <>
      {bottomLoader ? (
        <Loader loadingStyle={{ paddingTop: 0, paddingBottom: 100 }} />
      ) : null}
      <View style={styles.view} />
    </>
  ), [bottomLoader]);

  const ListEmpty = useCallback(() => (
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
  ), [whileLoading, themeTextStyle]);

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        {showWatchList == true ? (
          <>
            <SearchBar
              placeholder={i18n.t('search')}
              onChangeText={(text) => handleSearch(text)}
              lightTheme={themeSearchbar}
              platform={Platform.OS}
              containerStyle={{
                backgroundColor: 'transparent',
                paddingLeft: 0,
                paddingRight: 0,
                height: 10,
                width: '90%',
                paddingTop: 25,
                paddingBottom: 25,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                alignSelf: 'center',
              }}
              inputContainerStyle={{ backgroundColor: themeSearchBarStyle }}
              cancelButtonTitle={i18n.t('cancel')}
              cancelButtonProps={{ color: 'red' }}
              showCancel={showCancel}
              searchIcon={{ size: 25, color: searchBarTheme }}
              placeholderTextColor={searchBarTheme}
              inputStyle={{ color: searchBarTheme }}
              value={search}
              returnKeyType={'search'}
              enablesReturnKeyAutomatically={true}
            />
            <Text style={[styles.heading, themeTextStyle]}>
              {i18n.t('watchList')}
            </Text>
            <Text style={[styles.description, themeTextStyle]}>
              {i18n.t('watchListDescription')}
            </Text>
            {loader ? (
              <Loader loadingStyle={styles.loaderStyle} />
            ) : (
              <FlatList
                data={movies}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={3}
                style={[styles.scrollView, themeContainerStyle]}
                contentContainerStyle={styles.flatListContent}
                columnWrapperStyle={movies.length > 0 ? styles.columnWrapper : undefined}
                keyboardDismissMode='on-drag'
                onEndReached={onBottomLoad}
                onEndReachedThreshold={0.5}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    tintColor='red'
                    onRefresh={onRefresh}
                  />
                }
                ListFooterComponent={ListFooter}
                ListEmptyComponent={ListEmpty}
              />
            )}
          </>
        ) : (
          <View style={[styles.loginSection, themeBoxStyle]}>
            <Image source={logoTransparent} style={styles.loginImage} />
            <Text style={[styles.loginSectionText, themeTextStyle]}>
              {i18n.t('watchListRequirement')}
            </Text>
            <Pressable
              style={[ButtonStyles.mediumButtonStyling, styles.loginButton]}
              onPress={() =>
                navigation.navigate('Login', {
                  headerTitle: i18n.t('login'),
                })
              }
            >
              <Text style={ButtonStyles.buttonText}>{i18n.t('login')}</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default WatchList;
