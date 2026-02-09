import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useAppearance } from './AppearanceContext';
import axios from 'axios';
import Loader from '../components/Loader';
import SeriesCard from '../components/SeriesCard';
import i18n from '../language/i18n';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';

const RenderSeries = ({ baseUrl }) => {
  const [series, setSeries] = useState([]);
  const [loader, setLoader] = useState(true);
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(true);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [pageNumber, setPageNumber] = useState(2);
  const isBottomLoadingRef = useRef(false);

  const { colorScheme } = useAppearance();
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  useEffect(() => {
    setLoader(true);
    isBottomLoadingRef.current = false;
    const getSeries = async () => {
      try {
        const response = await axios.get(`${baseUrl + '&page=1'}`);
        setSeries(response.data.results);
        setTotalPageNumberFromApi(response.data.total_pages);
        setPageNumber(2);
        setLoader(false);
        console.log('fresh update');
      } catch (e) {
        console.log(e);
      } finally {
        setRefreshing(false);
      }
    };
    getSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isBottomLoadingRef.current = false;
    const onRefresh = async () => {
      try {
        const response = await axios.get(`${baseUrl + `&page=1`}`);
        setSeries(response.data.results);
        setTotalPageNumberFromApi(response.data.total_pages);
        setPageNumber(2);
        console.log('fresh update');
      } catch (e) {
        console.log(e);
      } finally {
        setRefreshing(false);
      }
    };
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshIndicator]);

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
      const response = await axios.get(`${baseUrl + `&page=${nextPage}`}`);
      setSeries((currentSeries) => {
        const currentIds = new Set(currentSeries.map((item) => item.id));
        const uniqueNewSeries = response.data.results.filter(
          (item) => !currentIds.has(item.id)
        );
        return [...currentSeries, ...uniqueNewSeries];
      });
      setPageNumber((currentPage) => currentPage + 1);
    } catch (e) {
      console.log(e);
    } finally {
      isBottomLoadingRef.current = false;
      setBottomLoader(false);
    }
  }, [totalPageNumberFromApi, pageNumber, baseUrl]);

  function onRefresh() {
    setRefreshing(true);
    setRefreshIndicator(!refreshIndicator);
    setPageNumber(2);
    isBottomLoadingRef.current = false;
  }

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const renderItem = useCallback(({ item }) => (
    <SeriesCard
      id={item.id}
      posterPath={item.poster_path}
      name={item.original_name}
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

  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.description, themeTextStyle]}>
          {i18n.t('series')}
        </Text>
        {loader ? (
          <Loader loadingStyle={styles.loaderStyle} />
        ) : (
          <FlatList
            data={series}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
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

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth,
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
    alignItems: 'center',
    width: deviceWidth,
  },
  columnWrapper: {
    justifyContent: 'center',
  },
  description: {
    fontSize: 15,
    paddingBottom: 20,
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
});

export default RenderSeries;
