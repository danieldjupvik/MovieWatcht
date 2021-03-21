import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Loader from '../components/Loader';
import { BlurView } from 'expo-blur';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const iconStar = <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />;
const iconFilm = (
  <FontAwesome5 name={'film'} solid style={{ color: 'red', fontSize: 38 }} />
);
const iconPopular = (
  <FontAwesome5 name={'fire'} solid style={{ color: 'red', fontSize: 23 }} />
);
const iconTopRated = (
  <FontAwesome5 name={'medal'} solid style={{ color: 'red', fontSize: 23 }} />
);
const iconUpcoming = (
  <FontAwesome5
    name={'newspaper'}
    solid
    style={{ color: 'red', fontSize: 23 }}
  />
);
const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(true);
  const [search, setSearch] = useState();
  const [loader, setLoader] = useState(true);
  const [heading, setHeading] = useState('Popular');

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}`);
        setMovies(response.data.results);
        setLoader(true);
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    getMovies();
  }, []);

  const getSearch = async (title) => {
    try {
      const response = await axios.get(`${searchMovieUrl + `&query=${title}`}`);
      setMovies(response.data.results);
      setQuery(!query);
      setLoader(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  function handleSearch(inputValue) {
    setSearch(inputValue);
    setQuery(!query);
    setLoader(true);
    var title = inputValue.replace(/\d+/g, '').trim();
    if (inputValue.length >= 1) {
      // setHeading('Searching');
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
    try {
      const response = await axios.get(`${baseUrl}`);
      setMovies(response.data.results);
      setHeading('Popular');
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  const getTopRated = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${topRatedMovieUrl}`);
      setMovies(response.data.results);
      setQuery(!query);
      setHeading('Top Rated');
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  const getUpcoming = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${upcomingMovieUrl}`);
      setMovies(response.data.results);
      setQuery(!query);
      setHeading('Upcoming');
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='light-content' />
        <SearchBar
          // style={styles.searchBar}
          placeholder='Search'
          onChangeText={(text) => handleSearch(text)}
          round={true}
          containerStyle={{
            backgroundColor: 'transparent',
            width: '90%',
            paddingBottom: 30,
          }}
          style={{ height: -10 }}
          value={search}
        />
        <Text style={styles.subheading}>{heading}</Text>
        <ScrollView style={styles.scrollView}>
          {loader ? (
            <Loader />
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
          <View style={styles.view}></View>
        </ScrollView>
      </SafeAreaView>
      <BlurView tint='dark' intensity={100} style={styles.navbar}>
        <TouchableWithoutFeedback onPress={getPopular}>
          <View style={styles.navbarButton}>
            <Text>{iconPopular}</Text>
            <Text style={styles.navbarText}>Popular</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={getTopRated}>
          <View style={styles.navbarButton}>
            <Text>{iconTopRated}</Text>
            <Text style={styles.navbarText}>Top Rated</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={getUpcoming}>
          <View style={styles.navbarButton}>
            <Text>{iconUpcoming}</Text>
            <Text style={styles.navbarText}>Upcoming</Text>
          </View>
        </TouchableWithoutFeedback>
      </BlurView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    color: 'white',
  },
  heading: {
    fontSize: 40,
    color: 'red',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 30,
    color: 'white',
    marginBottom: 20,
  },
  view: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: 'black',
    marginHorizontal: 20,
    width: '100%',
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cards: {
    width: 140,
    alignItems: 'center',
    padding: 8,
  },
  rating: {
    color: 'white',
    marginTop: 8,
  },
  searchBar: {
    // height: 35,
    // borderWidth: 1,
    // borderRadius: 10,
    // marginBottom: 20,
    // width: '100%',
    // backgroundColor: 'white',
    // paddingLeft: 10,
    // color: 'black',
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

  navbarText: {
    color: 'grey',
    fontSize: 13,
    marginTop: 8,
  },
});

export default Home;
