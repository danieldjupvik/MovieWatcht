import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  FlatList,
  View,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from '../components/AppearanceContext';
import axios from 'axios';
import { apiKey } from '../settings/api';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { FontAwesome5 } from '@expo/vector-icons';
import i18n from '../language/i18n';
import logoTransparent from '../assets/icon-transparent.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharedStyles as styles } from '../styles/sharedStyles';
import ButtonStyles from '../styles/buttons';

const WatchList = ({ navigation }) => {
  const [allMovies, setAllMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountId, setAccountId] = useState();
  const [sessionId, setSessionId] = useState();
  const [loader, setLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showWatchList, setShowWatchList] = useState(false);
  const [pageNumber, setPageNumber] = useState(2);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [whileLoading, setWhileLoading] = useState(true);
  const isBottomLoadingRef = useRef(false);

  const { colorScheme } = useAppearance();
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeBoxStyle =
    colorScheme === 'light' ? styles.lightThemeBox : styles.darkThemeBox;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: showWatchList
        ? {
            placeholder: i18n.t('search'),
            hideWhenScrolling: false,
            onChangeText: (e) => handleSearch(e.nativeEvent.text ?? ''),
            onCancelButtonPress: () => {
              setSearchQuery('');
            },
          }
        : undefined,
    });
  }, [navigation, showWatchList, handleSearch]);

  useEffect(() => {
    getAccountAndSession();
  }, [getAccountAndSession]);

  const getAccountAndSession = useCallback(async () => {
    let fromLocalStorage;
    try {
      fromLocalStorage = await AsyncStorage.multiGet([
        'accountId',
        'sessionId',
      ]);
    } catch (e) {
      console.log(e);
      return;
    }
    const accountId = fromLocalStorage[0][1];
    const sessionId = fromLocalStorage[1][1];

    if (sessionId) {
      getWatchListMovies(accountId, sessionId);
    }
    setAccountId(accountId);
    setSessionId(sessionId);
  }, [getWatchListMovies]);

  const checkIfLoggedIn = useCallback(async () => {
    let fromLocalStorage;
    try {
      fromLocalStorage = await AsyncStorage.multiGet([
        'accountId',
        'sessionId',
      ]);
    } catch (e) {
      console.log(e);
      return;
    }
    const storedAccountId = fromLocalStorage[0][1];
    const storedSessionId = fromLocalStorage[1][1];
    setShowWatchList(!!storedSessionId);

    setAccountId(storedAccountId);
    setSessionId(storedSessionId);
  }, []);

  useEffect(() => {
    if (sessionId) {
      getWatchListMovies(accountId, sessionId);
    }
  }, [sessionId, accountId, getWatchListMovies]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkIfLoggedIn();
    });

    return unsubscribe;
  }, [navigation, checkIfLoggedIn]);

  const getWatchListMovies = useCallback(async (accountIdParam, sessionIdParam) => {
    setLoader(true);
    isBottomLoadingRef.current = false;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountIdParam}/watchlist/movies${apiKey}&session_id=${sessionIdParam}&sort_by=created_at.desc&page=1`
      );
      setAllMovies(response.data.results);
      setTotalPageNumberFromApi(response.data.total_pages);
      setPageNumber(2);
      setRefreshing(false);
      setLoader(false);
    } catch (e) {
      console.log(e);
    } finally {
      setWhileLoading(true);
    }
  }, []);

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
      const newResults = response.data.results;
      setAllMovies((current) => {
        const currentIds = new Set(current.map((movie) => movie.id));
        const unique = newResults.filter((movie) => !currentIds.has(movie.id));
        return [...current, ...unique];
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

  const refreshFetch = async () => {
    isBottomLoadingRef.current = false;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies${apiKey}&session_id=${sessionId}&sort_by=created_at.desc&page=1`
      );
      setAllMovies(response.data.results);
      setTotalPageNumberFromApi(response.data.total_pages);
      setPageNumber(2);
      setRefreshing(false);
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

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 1) return allMovies;
    return allMovies.filter((movie) =>
      movie.title?.toLowerCase().includes(query)
    );
  }, [allMovies, searchQuery]);

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
    <View style={[styles.container, themeContainerStyle]}>
      {showWatchList ? (
        <>
          {loader ? (
            <Loader loadingStyle={styles.loaderStyle} />
          ) : (
            <FlatList
              data={filteredMovies}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              numColumns={3}
              style={[styles.scrollView, themeContainerStyle]}
              contentContainerStyle={styles.flatListContent}
              contentInsetAdjustmentBehavior='automatic'
              columnWrapperStyle={filteredMovies.length > 0 ? styles.columnWrapper : undefined}
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
    </View>
  );
};

export default WatchList;
