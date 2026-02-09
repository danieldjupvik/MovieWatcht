import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from './AppearanceContext';
import {
  detailsSeriesUrl,
  apiKey,
  basePosterUrl,
  baseBackdropUrl,
  baseProfileUrl,
  baseStillImageUrl,
} from '../settings/api';
import Loader from '../components/Loader';
import i18n from 'i18n-js';
import axios from 'axios';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
  primaryButton,
} from '../colors/colors';
import { borderRadius, boxShadow } from '../styles/globalStyles';
import ButtonStyles from '../styles/buttons';
import posterLoader from '../assets/poster-loader.jpg';
import noImage from '../assets/no-image.jpg';

export const monthNames = [
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
const RenderSeason = ({ navigation, id, season }) => {
  const [loader, setLoader] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const { colorScheme } = useAppearance();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  useEffect(() => {
    let isCancelled = false;
    const getSeason = async () => {
      try {
        const response = await axios.get(
          `${detailsSeriesUrl + id + `/season/${season}` + apiKey}`
        );
        setEpisodes(response.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    getSeason();
    return () => {
      isCancelled = true;
    };
  }, []);

  const numFormatter = (num) => {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed() + 'k';
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num < 900) {
      return num;
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader loadingStyle={styles.Loader} />
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme}>
            <View style={styles.main}>
              <View style={[styles.imageDiv, boxShadow]}>
                <Image
                  source={{
                    uri: `${basePosterUrl + episodes.poster_path}`,
                  }}
                  placeholder={posterLoader}
                  style={styles.posterImg}
                />
              </View>
              <View style={styles.cardsDiv}>
                {episodes.episodes.map((episode, idx) => {
                  var d = new Date(episode.air_date);

                  var year = d.getFullYear();
                  var month = monthNames[d.getMonth()];
                  var day = d.getDate();
                  var releaseDate = `${day}. ${month} ${year}`;
                  return (
                    <View key={idx} style={styles.cards}>
                      <View style={styles.stillImgDiv}>
                        <Image
                          source={{
                            uri: `${baseStillImageUrl + episode.still_path}`,
                          }}
                          placeholder={posterLoader}
                          style={styles.stillImg}


                        />
                      </View>
                      <View style={styles.infoDiv}>
                        <Text style={[styles.episodeName, themeTextStyle]}>
                          {episode.episode_number} - {episode.name}
                        </Text>
                        <Text style={[styles.releaseDate, themeTextStyle]}>
                          {releaseDate}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={[styles.overview, themeTextStyle]}
                        >
                          {episode.overview}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '300';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

console.log(deviceWidth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewWrapper: {
    paddingBottom: 45,
    height: '100%',
  },
  main: {
    marginLeft: 22,
    marginRight: 22,
  },
  cardsDiv: {
    marginTop: 20,
  },
  cards: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  posterImg: {
    width: 140,
    height: 200,
    marginTop: 20,
    borderRadius: borderRadius,
  },
  stillImg: {
    width: deviceWidth / 3,
    height: deviceWidth / 5,
    borderRadius: borderRadius,
  },
  stillImgDiv: {},
  infoDiv: {
    width: deviceWidth - 185,
    marginLeft: 15,
  },
  imageDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  episodeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  releaseDate: {
    marginTop: 6,
    opacity: 0.7,
    fontSize: 13,
  },
  overview: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
  },
  Loader: {
    marginBottom: deviceHeight / 9,
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
  lightThemeBtnBackground: {
    backgroundColor: 'lightgrey',
  },
  darkThemeBtnBackground: {
    backgroundColor: '#4a4b4d',
  },
  darkThemeBox: {
    backgroundColor: '#313337',
  },
  lightThemeBox: {
    backgroundColor: '#bfc5ce',
  },
});

export default RenderSeason;
