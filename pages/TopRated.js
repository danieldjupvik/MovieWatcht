import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  RefreshControl,
  Image,
  Animated,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import axios from 'axios';
import {
  basePosterUrl,
  searchMovieUrl,
  topRatedMovieUrl,
} from '../settings/api';
import Loader from '../components/Loader';
import { BlurView } from 'expo-blur';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import i18n from 'i18n-js';
import { useColorScheme } from 'react-native-appearance';
import { styles } from './Home';
import posterLoader from '../assets/poster-loader.jpg';

const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;

const TopRated = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshIndicator, setRefreshIndicator] = useState(true);

  const colorScheme = useColorScheme();
  const themeSearchbar = colorScheme === 'light' ? true : false;
  const searchBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTabBar = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  useEffect(() => {
    setLoader(true);
    const getMovies = async () => {
      try {
        const response = await axios.get(`${topRatedMovieUrl}`);
        setMovies(response.data.results);
        setRefreshing(false);
        console.log('fresh update');
        setLoader(false);
      } catch (e) {
        console.log(e);
      } finally {
      }
    };
    getMovies();
  }, [refreshIndicator]);

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
          {i18n.t('topRatedDescription')}
        </Text>
        <SafeAreaView style={styles.container}></SafeAreaView>
        <ScrollView
          style={[styles.scrollView, themeContainerStyle]}
          keyboardDismissMode={'on-drag'}
          indicatorStyle={themeTabBar}
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
                {movies.map((movie) => {
                  if (movie.poster_path !== null) {
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
                          source={{
                            uri: `${basePosterUrl + movie.poster_path}`,
                          }}
                          style={[
                            styles.image,
                            {
                              opacity: fadeAnim,
                            },
                          ]}
                          onLoad={fadeIn}
                          resizeMode='contain'
                          defaultSource={posterLoader}
                          ImageCacheEnum={'force-cache'}
                        />
                        <Text style={[styles.rating, themeTextStyle]}>
                          {iconStar} {movie.vote_average}/10
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            )}
          </View>
          <View style={styles.view}></View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default TopRated;
