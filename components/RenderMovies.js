import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';
import { useAppearance } from './AppearanceContext';
import axios from 'axios';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import useResponsive from '../hooks/useResponsive';
import i18n from '../language/i18n';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { useNavigation, useScrollToTop } from '@react-navigation/native';

const RenderMovies = ({ baseUrl }) => {
  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [pageNumber, setPageNumber] = useState(2);
  const [regionsText, setRegionsText] = useState();
  const [regionFinal, setRegionFinal] = useState();
  const isBottomLoadingRef = useRef(false);
  const listRef = useRef(null);
  const navigation = useNavigation();
  useScrollToTop(listRef);

  const { colorScheme } = useAppearance();
  const { numColumns, posterWidth, posterHeight } = useResponsive();
  const defaultRegion = Localization.getLocales()[0]?.regionCode || 'US';

  const getRegion = async () => {
    try {
      const region = await AsyncStorage.getItem('region');
      if (!region) {
        setRegionFinal(defaultRegion);
        await AsyncStorage.setItem('region', 'auto');
        return;
      }
      setRegionFinal(region === 'auto' ? defaultRegion : region);
    } catch (_e) {
      alert('error reading region value');
    }
  };

  useEffect(() => {
    getRegion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getRegion();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const fetchFirstPage = useCallback(async () => {
    const region = regionFinal || defaultRegion;
    isBottomLoadingRef.current = false;
    try {
      const response = await axios.get(
        `${baseUrl + `&region=${region}&page=1`}`
      );
      setMovies(response.data.results);
      setTotalPageNumberFromApi(response.data.total_pages);
      setPageNumber(2);
    } catch (_e) {

    } finally {
      setRefreshing(false);
    }
  }, [regionFinal, defaultRegion, baseUrl]);

  useEffect(() => {
    setRegionsText(regionFinal || defaultRegion);
    setLoader(true);
    fetchFirstPage().then(() => setLoader(false));
  }, [regionFinal, defaultRegion, fetchFirstPage]);

  const onBottomLoad = useCallback(async () => {
    const activeRegion = regionFinal ? regionFinal : defaultRegion;

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
        `${baseUrl + `&region=${activeRegion}&page=${nextPage}`}`
      );
      setMovies((currentMovies) => {
        const currentIds = new Set(currentMovies.map((movie) => movie.id));
        const uniqueNewMovies = response.data.results.filter(
          (movie) => !currentIds.has(movie.id)
        );
        return [...currentMovies, ...uniqueNewMovies];
      });
      setPageNumber((currentPage) => currentPage + 1);
    } catch (_e) {

    } finally {
      isBottomLoadingRef.current = false;
      setBottomLoader(false);
    }
  }, [regionFinal, defaultRegion, totalPageNumberFromApi, pageNumber, baseUrl]);

  function onRefresh() {
    setRefreshing(true);
    fetchFirstPage();
  }

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const renderItem = useCallback(({ item }) => (
    <MovieCard
      id={item.id}
      posterPath={item.poster_path}
      title={item.title}
      voteAverage={item.vote_average}
      colorScheme={colorScheme}
      cardWidth={posterWidth}
      cardHeight={posterHeight}
    />
  ), [colorScheme, posterWidth, posterHeight]);

  const ListFooter = useCallback(() => (
    <>
      {bottomLoader ? (
        <Loader loadingStyle={{ paddingTop: 0, paddingBottom: 100 }} />
      ) : null}
      <View style={styles.view} />
    </>
  ), [bottomLoader]);

  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.description, themeTextStyle]}>
          {i18n.t('moviesIn')} {regionsText}
        </Text>
        {loader ? (
          <Loader loadingStyle={styles.loaderStyle} />
        ) : (
          <FlatList
            ref={listRef}
            key={numColumns}
            data={movies}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            style={[styles.scrollView, themeContainerStyle]}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
            contentInsetAdjustmentBehavior='never'
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
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  view: {
    height: 75,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  flatListContent: {
    paddingHorizontal: 5,
    width: '100%',
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  description: {
    fontSize: 15,
    paddingBottom: 20,
  },
  loaderStyle: {
    paddingTop: 150,
    paddingBottom: 600,
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
});

export default React.memo(RenderMovies);
