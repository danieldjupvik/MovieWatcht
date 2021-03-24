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
import { backgroundColor } from '../pages/Home';
import Loader from '../components/Loader';
import * as WebBrowser from 'expo-web-browser';

import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

const RenderDetails = ({ navigation, id }) => {
  const [loader, setLoader] = useState(true);
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get(
          `${
            detailsMovieUrl +
            id +
            apiKey +
            '&append_to_response=credits,recommendations'
          }`
        );
        setMovie(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          setLoader(false);
        }, 500);
      }
    };
    getMovie();
  }, [movie]);

  console.log(movie);

  var d = new Date(movie.release_date);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = d.getFullYear();
  var month = monthNames[d.getMonth()];
  var day = d.getDate();
  var releaseDate = `${day}. ${month} ${year}`;

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
    <FontAwesome5
      name={'star'}
      solid
      style={{ color: 'red', fontSize: globalFontsize }}
    />
  );

  const goToWebsite = () => {
    WebBrowser.openBrowserAsync(movie.homepage);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {loader ? (
          <Loader />
        ) : (
          <ScrollView indicatorStyle={'white'}>
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
                {iconStar} {movie.vote_average}/10 ({movie.vote_count} votes)
              </Text>
              <Text style={styles.genre}>
                <Text style={styles.category}>Release Date</Text> {releaseDate}
              </Text>
              <Text style={[styles.genre, styles.runtime]}>
                <Text style={styles.category}>Runtime</Text> {runtime}
              </Text>
              <Text style={styles.genre}>
                <Text style={styles.category}>Status</Text> {movie.status}
              </Text>
              <Text style={styles.genre}>
                <Text style={styles.category}>Budget</Text> $
                {movie.budget.toLocaleString()}
              </Text>
              <Text style={styles.genre}>
                <Text style={styles.category}>Revenue</Text> $
                {movie.revenue.toLocaleString()}
              </Text>
              <Text style={styles.genre}>
                <Text style={styles.category}>Genres</Text>{' '}
                {movie.genres?.map((genre) => genre.name + ' ')}
              </Text>
              {movie.homepage ? (
                <View>
                  <TouchableOpacity
                    style={styles.homepageButtonDiv}
                    onPress={goToWebsite}
                  >
                    <Text style={styles.homepageButton}>Homepage</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <Text style={styles.overview}>{movie.overview}</Text>
            </View>
            <View style={styles.castMain}>
              <Text style={styles.castHeading}>Cast</Text>
              <ScrollView horizontal={true} indicatorStyle={'white'}>
                <View style={styles.castDiv}>
                  {movie.credits.cast.slice(0, 10).map((cast, idx) => {
                    if (cast.profile_path !== null) {
                      return (
                        <View style={styles.castCard} key={idx}>
                          <Image
                            style={styles.profileImage}
                            source={{
                              uri: `${basePosterUrl + cast.profile_path}`,
                            }}
                          />
                          <Text style={styles.textName}>{cast.name}</Text>
                          <Text style={styles.textCharacter}>
                            {cast.character}
                          </Text>
                        </View>
                      );
                    }
                  })}
                </View>
              </ScrollView>
            </View>
            <View style={styles.moviesMain}>
              <Text style={styles.moviesHeading}>Recommendations</Text>
              <ScrollView horizontal={true} indicatorStyle={'white'}>
                <View style={styles.moviesDiv}>
                  {movie.recommendations.results
                    .slice(0, 10)
                    .map((movie, idx) => {
                      if (movie.poster_path !== null) {
                        return (
                          <TouchableOpacity
                            style={styles.moviesCard}
                            key={idx}
                            onPress={() =>
                              navigation.navigate('Details', {
                                id: movie.id,
                                headerTitle: movie.title,
                              })
                            }
                          >
                            <Image
                              style={styles.posterImage}
                              source={{
                                uri: `${basePosterUrl + movie.poster_path}`,
                              }}
                            />
                            <Text style={styles.textTitle}>
                              {movie.original_title}
                            </Text>
                            <Text style={styles.textRating}>
                              <FontAwesome5
                                name={'star'}
                                solid
                                style={{ color: 'red', fontSize: 13 }}
                              />{' '}
                              {movie.vote_average}/10
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    })}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};

const globalFontsize = 19;
const globalPadding = 5;
const normalFontWeight = '300';
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    width: deviceWidth,
    justifyContent: 'center',
  },
  backdrop: {
    width: '100%',
    height: 250,
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
    marginRight: 22,
    fontSize: 20,
    fontWeight: 'bold',
  },
  overview: {
    color: 'white',
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
  },
  genre: {
    color: 'white',
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: globalPadding,
    marginBottom: globalPadding,
  },
  runtime: {
    marginBottom: globalPadding * 4,
  },
  child: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  rating: {
    color: 'white',
    marginLeft: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    marginBottom: globalPadding,
  },
  tagline: {
    color: 'white',
    marginLeft: 22,
    opacity: 0.7,
    fontSize: 16,
  },
  category: {
    opacity: 0.6,
  },
  castMain: {
    marginTop: 25 + globalPadding,
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  castDiv: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  castCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  profileImage: {
    width: deviceWidth / 4.5,
    height: deviceWidth / 4.5,
    marginBottom: 5,
    borderRadius: 50,
  },
  textName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textCharacter: {
    paddingTop: 8,
    fontSize: 12,
    color: 'white',
  },
  castHeading: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  homepageButton: {
    color: 'white',
    fontSize: globalFontsize,
    fontWeight: '600',
  },
  homepageButtonDiv: {
    borderRadius: 10,
    marginLeft: 22,
    marginTop: globalPadding,
    marginBottom: globalPadding,
  },
  moviesMain: {
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  moviesDiv: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 30,
  },
  moviesCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  posterImage: {
    width: deviceWidth / 4.5,
    height: deviceWidth / 3,
    marginBottom: 13,
    // borderRadius: 50,
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textRating: {
    paddingTop: 8,
    fontSize: 12,
    color: 'white',
  },
  moviesHeading: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
});

export default RenderDetails;
