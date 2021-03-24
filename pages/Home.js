import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
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
const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;

const Home = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [heading, setHeading] = useState('Popular');
  const [pageDescription, setPageDescription] = useState(
    'Popular movies right now'
  );
  const [btnSelected, setBtnSelected] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);

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
      }, 1000);
    }
  };

  function handleSearch(inputValue) {
    setSearch(inputValue);
    setLoader(true);
    var title = inputValue.replace(/\d+/g, '').trim();
    if (inputValue.length >= 1) {
      getSearch(title);
    } else {
      if (heading === 'Popular') {
        getPopular();
      }
      if (heading === 'Top Rated') {
        getTopRated();
      }
      if (heading == 'Upcoming') {
        getUpcoming();
      }
    }
  }

  const getPopular = async () => {
    setLoader(true);
    setHeading('Popular');
    setPageDescription('Popular movies right now');
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
      }, 1000);
    }
  };

  const getTopRated = async () => {
    setLoader(true);
    setHeading('Top Rated');
    setPageDescription('All time top rated movies');
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
      }, 1000);
    }
  };

  const getUpcoming = async () => {
    setLoader(true);
    setHeading('Upcoming');
    setPageDescription('Upcoming movies in near future');
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
      }, 1000);
    }
  };

  function onRefresh() {
    setRefreshing(true);
    if (heading === 'Popular') {
      getPopular();
    }
    if (heading === 'Top Rated') {
      getTopRated();
    }
    if (heading == 'Upcoming') {
      getUpcoming();
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <SearchBar
          placeholder='Search Movies'
          onChangeText={(text) => handleSearch(text)}
          round={true}
          containerStyle={{
            backgroundColor: 'transparent',
            width: '90%',
            paddingBottom: 30,
            borderTopColor: backgroundColor,
            borderBottomColor: backgroundColor,
          }}
          style={{ height: -10 }}
          value={search}
        />
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.description}>{pageDescription}</Text>
        <SafeAreaView style={styles.container}></SafeAreaView>
        <ScrollView
          style={styles.scrollView}
          keyboardDismissMode={'on-drag'}
          indicatorStyle={'white'}
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
                        <Text style={styles.rating}>
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
      <BlurView tint='dark' intensity={100} style={styles.navbar}>
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
              Popular
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
              Top Rated
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
              Upcoming
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.navbarButton}>
            <Text>
              {' '}
              <FontAwesome5
                name={'cogs'}
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
              Settings
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </>
  );
};

export const backgroundColor = '#1D1D1C';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    color: 'white',
  },
  heading: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  view: {
    height: 85,
  },
  scrollView: {
    backgroundColor: backgroundColor,
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
    color: 'white',
    marginTop: 8,
  },
  navbar: {
    width: '100%',
    height: 85,
    backgroundColor: 'black',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
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
    fontSize: 13,
    marginTop: 8,
    fontWeight: 'bold',
  },
  notActiveNavbarText: {
    color: 'grey',
    fontSize: 13,
    marginTop: 8,
    fontWeight: 'bold',
  },
  isActiveIcon: {
    color: 'red',
    fontSize: 23,
  },
  notActiveIcon: {
    color: 'grey',
    fontSize: 23,
  },
  description: {
    color: 'white',
    fontSize: 15,
    paddingBottom: 20,
  },
  loaderStyle: {
    marginTop: deviceHeight / 4.5,
  },
});

export default Home;
