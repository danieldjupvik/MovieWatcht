import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { detailsMovieUrl, apiKey, basePosterUrl } from '../settings/api';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import axios from 'axios';

const Details = ({ route }) => {
  const { id } = route.params;

  const [movie, setMovie] = useState([]);
  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get(`${detailsMovieUrl + id + apiKey}`);
        setMovie(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getMovie();
  }, []);

  var d = new Date(movie.release_date);
  var year = d.getFullYear();
  let runtime = timeConvert(movie.runtime);
  function timeConvert(num) {
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    let hourNaming = ' hr ';
    if (rhours > 1) {
      hourNaming = ' hrs ';
    }
    return rhours + hourNaming + rminutes + ' min';
  }

  const iconStar = (
    <FontAwesome5 name={'star'} solid style={{ color: 'red' }} />
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.main}>
            <ImageBackground
              source={{
                uri: `${basePosterUrl + movie.backdrop_path}`,
              }}
              style={styles.backdrop}
              blurRadius={4}
            >
              <View style={styles.child} />
            </ImageBackground>
            <Image
              source={{
                uri: `${basePosterUrl + movie.poster_path}`,
              }}
              style={styles.posterImg}
            />
            <Text style={styles.title}>
              {movie.title} <Text>({year})</Text>
            </Text>
            {movie.tagline ? (
              <Text style={styles.tagline}>{movie.tagline}</Text>
            ) : null}
            <Text style={styles.rating}>
              {iconStar} {movie.vote_average}/10 from {movie.vote_count} users
            </Text>
            <Text style={styles.genre}>{runtime}</Text>
            <Text style={styles.genre}>
              {movie.genres?.map((genre) => genre.name + ' ')}
            </Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    // justifyContent: 'center',
    color: 'white',
  },
  main: {
    width: Dimensions.get('window').width,
  },
  backdrop: {
    width: '100%',
    height: 260,
  },
  posterImg: {
    width: 120,
    height: 180,
    marginTop: -250 / 2,
    marginLeft: 20,
  },
  title: {
    color: 'white',
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 22,
    fontSize: 18,
    fontWeight: 'bold',
  },
  overview: {
    color: 'white',
    marginLeft: 22,
    marginRight: 22,
  },
  genre: {
    color: 'white',
    marginLeft: 22,
    marginBottom: 30,
  },
  child: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  rating: {
    color: 'white',
    marginTop: 8,
    marginLeft: 22,
    marginTop: 30,
    marginBottom: 30,
  },
  tagline: {
    color: 'white',
    marginLeft: 22,
    marginTop: 6,
    opacity: 0.7,
  },
});
export default Details;
