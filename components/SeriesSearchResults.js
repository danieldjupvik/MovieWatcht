import React, { useEffect, useState, useRef, useContext } from 'react';
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
  Platform,
  Animated,
  Share,
  useColorScheme,
} from 'react-native';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import { baseSearchPosterUrl, searchMovieUrl } from '../settings/api';
import Loader from '../components/Loader';
import i18n from 'i18n-js';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { borderRadius } from '../styles/globalStyles';
import posterLoader from '../assets/poster-loader.jpg';
import noImage from '../assets/no-image.jpg';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { primaryButton, secondaryButton } from '../colors/colors';
import * as Localization from 'expo-localization';
import { useNavigation } from '@react-navigation/native';

const SeriesSearchResults = ({ series, loader }) => {
  const [search, setSearch] = useState();
  const [bottomLoader, setBottomLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(true);
  const [totalPageNumberFromApi, setTotalPageNumberFromApi] = useState();
  const [pageNumber, setPageNumber] = useState(2);
  const [appearance, setAppearance] = useState();
  const [regionsText, setRegionsText] = useState();
  const [regionFinal, setRegionFinal] = useState();
  const navigation = useNavigation();

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
  const themeTabBar = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onShare = async (title, id) => {
    async function impactAsync(style = Haptics.ImpactFeedbackStyle.Heavy) {
      if (!Haptics.impactAsync) {
        throw new UnavailabilityError('Haptic', 'impactAsync');
      }
      await Haptics.impactAsync(style);
    }
    impactAsync();

    const url = 'https://www.themoviedb.org/tv/' + id;

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

  const onBottomLoad = async () => {
    if (pageNumber <= totalPageNumberFromApi) {
      setBottomLoader(true);
      setPageNumber(pageNumber + 1);
      try {
        const response = await axios.get(`${baseUrl + `&page=${pageNumber}`}`);
        setSeries((series) => [...series, ...response.data.results]);
      } catch (e) {
        console.log(e);
      } finally {
        setBottomLoader(false);
      }
    }
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

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={[styles.scrollView, themeContainerStyle]}
          keyboardDismissMode={'on-drag'}
          indicatorStyle={themeTabBar}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              console.log('load bottom');
              if (series.length >= 1) {
                onBottomLoad();
              }
            }
          }}
          scrollEventThrottle={400}
        >
          <View style={styles.mainParent}>
            {loader ? (
              <Loader loadingStyle={styles.loaderStyle} />
            ) : (
              <View style={styles.main}>
                {series?.map((serie) => {
                  const posterImage = {
                    uri: `${baseSearchPosterUrl + serie.poster_path}`,
                  };
                  var d = new Date(serie.first_air_date);

                  var year = d.getFullYear();

                  return (
                    <TouchableOpacity
                      key={serie.id}
                      style={[styles.cards, themeContainerStyle]}
                      onLongPress={() =>
                        onShare(serie.original_name, serie.id, serie.overview)
                      }
                      onPress={() =>
                        navigation.navigate('SeriesDetails', {
                          id: serie.id,
                          headerTitle: serie.original_name,
                        })
                      }
                    >
                      <View style={styles.imageDiv}>
                        <Animated.Image
                          source={serie.poster_path ? posterImage : noImage}
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
                      <View style={styles.infoDiv}>
                        <View style={styles.titleDiv}>
                          <Text style={[styles.title, themeTextStyle]}>
                            {serie.original_name} ({year})
                          </Text>
                        </View>
                        <View style={styles.ratingDiv}>
                          <Image
                            source={tmdbLogo}
                            style={styles.tmdbLogo}
                            resizeMode='contain'
                          />
                          <Text style={[styles.rating, themeTextStyle]}>
                            {Math.floor((serie.vote_average * 100) / 10)}%
                          </Text>
                        </View>
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
      </View>
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
    paddingTop: 15,
    width: deviceWidth,
  },
  view: {
    height: 75,
  },
  scrollView: {
    height: '100%',
    width: '100%',
    paddingTop: 5,
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  mainParent: {
    flex: 1,
  },
  image: {
    width: deviceWidth / 4.3,
    height: deviceWidth / 3.24,
    backgroundColor: 'grey',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  imageDiv: {},
  cards: {
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    // borderColor: '#000',
    // borderWidth: 1,
    borderRadius: borderRadius,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.2,
  },
  infoDiv: {
    flex: 1,
    flexDirection: 'column',
    height: '50%',
  },
  titleDiv: {
    marginLeft: 15,
  },
  title: {
    fontSize: 17,
  },
  rating: {
    marginLeft: 6,
  },
  ratingDiv: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  tmdbLogo: {
    width: 25,
    height: 12,
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
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
});

export default SeriesSearchResults;
