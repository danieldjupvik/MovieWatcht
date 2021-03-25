import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  RefreshControl,
  Dimensions,
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

const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;

const Home = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [heading, setHeading] = useState(i18n.t('popular'));
  const [pageDescription, setPageDescription] = useState(
    i18n.t('popularDescription')
  );
  const [btnSelected, setBtnSelected] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

  const colorScheme = useColorScheme();
  const themeSearchbar = colorScheme === 'light' ? true : false;
  const themeTabBar = colorScheme === 'light' ? 'light' : 'dark';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}`);
        setMovies(response.data.results);
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    getMovies();
  }, []);

  const getSearch = async (title) => {
    setLoader(true);
    try {
      const response = await axios.get(`${searchMovieUrl + `&query=${title}`}`);
      setMovies(response.data.results);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 800);
    }
  };

  function handleSearch(inputValue) {
    setSearch(inputValue);
    setLoader(true);
    var title = inputValue.replace(/\d+/g, '').trim();
    if (inputValue.length >= 1) {
      getSearch(title);
    } else {
      if (heading === i18n.t('popular')) {
        getPopular();
      }
      if (heading === i18n.t('topRated')) {
        getTopRated();
      }
      if (heading === i18n.t('upcoming')) {
        getUpcoming();
      }
    }
  }

  const getPopular = async () => {
    setLoader(true);
    setHeading(i18n.t('popular'));
    setPageDescription(i18n.t('popularDescription'));
    try {
      const response = await axios.get(`${baseUrl}`);
      setMovies(response.data.results);
      setBtnSelected(1);
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 800);
    }
  };

  const getTopRated = async () => {
    setLoader(true);
    setHeading(i18n.t('topRated'));
    setPageDescription(i18n.t('topRatedDescription'));
    try {
      const response = await axios.get(`${topRatedMovieUrl}`);
      setMovies(response.data.results);
      setBtnSelected(2);
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 800);
    }
  };

  const getUpcoming = async () => {
    setLoader(true);
    setHeading(i18n.t('upcoming'));
    setPageDescription(i18n.t('upcomingDescription'));
    try {
      const response = await axios.get(`${upcomingMovieUrl}`);
      setMovies(response.data.results);
      setBtnSelected(3);
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 800);
    }
  };

  // const getNowPlaying = async () => {
  //   setLoader(true);
  //   setHeading('Now Playing');
  //   setPageDescription('Movies playing right now');
  //   try {
  //     const response = await axios.get(`${nowPlayingUrl}`);
  //     setMovies(response.data.results);
  //     setBtnSelected(4);
  //     setRefreshing(false);
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setTimeout(() => {
  //       setLoader(false);
  //     }, 800);
  //   }
  // };

  function onRefresh() {
    setRefreshing(true);
    if (heading === i18n.t('popular')) {
      getPopular();
    }
    if (heading === i18n.t('topRated')) {
      getTopRated();
    }
    if (heading === i18n.t('upcoming')) {
      getUpcoming();
    }
  }

  return (
    <>
      <SafeAreaView style={[styles.container, themeContainerStyle]}>
        <SearchBar
          placeholder={i18n.t('search')}
          onChangeText={(text) => handleSearch(text)}
          round={true}
          lightTheme={themeSearchbar}
          containerStyle={{
            backgroundColor: 'transparent',
            width: '90%',
            paddingBottom: 30,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
          }}
          style={{ height: -10 }}
          value={search}
        />
        <Text style={[styles.heading, themeTextStyle]}>{heading}</Text>
        <Text style={[styles.description, themeTextStyle]}>
          {pageDescription}
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
                        <Image
                          source={{
                            uri: `${basePosterUrl + movie.poster_path}`,
                          }}
                          style={styles.image}
                          resizeMode='contain'
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
      <BlurView tint={themeTabBar} intensity={100} style={styles.navbar}>
        <TouchableWithoutFeedback onPress={getPopular}>
          <View style={styles.navbarButton}>
            <Text>
              <FontAwesome5
                name={'fire'}
                solid
                style={
                  btnSelected === 1 ? styles.isActiveIcon : styles.notActiveIcon
                }
              />
            </Text>
            <Text
              style={
                btnSelected === 1
                  ? styles.isActiveNavbarText
                  : styles.notActiveNavbarText
              }
            >
              {i18n.t('popular')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={getTopRated}>
          <View style={styles.navbarButton}>
            <Text>
              <FontAwesome5
                name={'medal'}
                solid
                style={
                  btnSelected === 2 ? styles.isActiveIcon : styles.notActiveIcon
                }
              />
            </Text>
            <Text
              style={
                btnSelected === 2
                  ? styles.isActiveNavbarText
                  : styles.notActiveNavbarText
              }
            >
              {i18n.t('topRated')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={getUpcoming}>
          <View style={styles.navbarButton}>
            <Text>
              {' '}
              <FontAwesome5
                name={'newspaper'}
                solid
                style={
                  btnSelected === 3 ? styles.isActiveIcon : styles.notActiveIcon
                }
              />
            </Text>
            <Text
              style={
                btnSelected === 3
                  ? styles.isActiveNavbarText
                  : styles.notActiveNavbarText
              }
            >
              {i18n.t('upcoming')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {/* <TouchableWithoutFeedback onPress={getNowPlaying}>
          <View style={styles.navbarButton}>
            <Text>
              {' '}
              <FontAwesome5
                name={'play'}
                solid
                style={
                  btnSelected === 4 ? styles.isActiveIcon : styles.notActiveIcon
                }
              />
            </Text>
            <Text
              style={
                btnSelected === 4
                  ? styles.isActiveNavbarText
                  : styles.notActiveNavbarText
              }
            >
              Now Playing
            </Text>
          </View>
        </TouchableWithoutFeedback> */}
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('Settings', {
              headerTitle: i18n.t('settings'),
            })
          }
        >
          <View style={styles.navbarButton}>
            <Text>
              {' '}
              <FontAwesome5
                name={'cogs'}
                solid
                style={
                  btnSelected === 5 ? styles.isActiveIcon : styles.notActiveIcon
                }
              />
            </Text>
            <Text
              style={
                btnSelected === 5
                  ? styles.isActiveNavbarText
                  : styles.notActiveNavbarText
              }
            >
              {i18n.t('settings')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </>
  );
};

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  view: {
    height: 85,
  },
  scrollView: {
    marginHorizontal: 20,
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
    height: deviceHeight / 5,
  },
  cards: {
    width: deviceWidth / 3,
    height: deviceHeight / 4,
    alignItems: 'center',
  },
  rating: {
    marginTop: 8,
  },
  navbar: {
    width: '100%',
    height: 85,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navbarButton: {
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    alignItems: 'center',
  },

  isActiveNavbarText: {
    color: 'red',
    fontSize: 11,
    marginTop: 8,
    fontWeight: 'bold',
  },
  notActiveNavbarText: {
    color: 'grey',
    fontSize: 11,
    marginTop: 8,
    fontWeight: 'bold',
  },
  isActiveIcon: {
    color: 'red',
    fontSize: 21,
  },
  notActiveIcon: {
    color: 'grey',
    fontSize: 21,
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
});

export default Home;
