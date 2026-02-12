import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from './AppearanceContext';
import {
  detailsSeriesUrl,
  apiKey,
  basePosterUrl,
  baseStillImageUrl,
} from '../settings/api';
import Loader from '../components/Loader';
import axios from 'axios';
import {
  backgroundColorDark,
  backgroundColorLight,
  textColorDark,
  textColorLight,
} from '../colors/colors';
import { borderRadius, boxShadow } from '../styles/globalStyles';
import { imageBlurhash } from '../settings/imagePlaceholder';
import useResponsive from '../hooks/useResponsive';

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
  const { width, isTablet } = useResponsive();
  const stillWidth = isTablet ? 280 : Math.min(width / 3, 160);
  const stillHeight = stillWidth / 1.6;
  const seasonPosterW = isTablet ? 180 : 140;
  const seasonPosterH = isTablet ? 257 : 200;
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  useEffect(() => {
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
  }, [id, season]);

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader loadingStyle={styles.Loader} />
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme} contentContainerStyle={{ paddingBottom: isTablet ? 0 : 50 }}>
            <View style={styles.main}>
              <View style={[styles.imageDiv, boxShadow]}>
                <Image
                  source={{
                    uri: `${basePosterUrl + (episodes?.poster_path ?? '')}`,
                  }}
                  placeholder={imageBlurhash}
                  placeholderContentFit='cover'
                  style={[styles.posterImg, { width: seasonPosterW, height: seasonPosterH }]}
                />
              </View>
              {isTablet ? (
                <View style={styles.cardsDiv}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row' }}>
                      {(episodes?.episodes ?? []).map((episode, idx) => {
                        let releaseDate = '';
                        if (episode.air_date) {
                          let d = new Date(episode.air_date);
                          let year = d.getFullYear();
                          let month = monthNames[d.getMonth()];
                          let day = d.getDate();
                          releaseDate = `${day}. ${month} ${year}`;
                        }
                        return (
                          <View key={idx} style={{ width: stillWidth, marginRight: 20 }}>
                            <Image
                              source={{
                                uri: `${baseStillImageUrl + (episode.still_path ?? '')}`,
                              }}
                              placeholder={imageBlurhash}
                              placeholderContentFit='cover'
                              style={[styles.stillImg, { width: stillWidth, height: stillHeight }]}
                            />
                            <Text style={[styles.episodeName, themeTextStyle, { marginTop: 10 }]}>
                              {episode.episode_number} - {episode.name}
                            </Text>
                            <Text style={[styles.releaseDate, themeTextStyle]}>
                              {releaseDate}
                            </Text>
                            <Text
                              numberOfLines={3}
                              style={[styles.overview, themeTextStyle]}
                            >
                              {episode.overview}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.cardsDiv}>
                  {(episodes?.episodes ?? []).map((episode, idx) => {
                    let releaseDate = '';
                    if (episode.air_date) {
                      let d = new Date(episode.air_date);
                      let year = d.getFullYear();
                      let month = monthNames[d.getMonth()];
                      let day = d.getDate();
                      releaseDate = `${day}. ${month} ${year}`;
                    }
                    return (
                      <View key={idx} style={styles.cards}>
                        <View style={styles.stillImgDiv}>
                          <Image
                            source={{
                              uri: `${baseStillImageUrl + (episode.still_path ?? '')}`,
                            }}
                            placeholder={imageBlurhash}
                            placeholderContentFit='cover'
                            style={[styles.stillImg, { width: stillWidth, height: stillHeight }]}
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
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewWrapper: {
    marginBottom: 45,
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
    marginTop: 20,
    borderRadius: borderRadius,
  },
  stillImg: {
    borderRadius: borderRadius,
  },
  stillImgDiv: {},
  infoDiv: {
    flex: 1,
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
    marginBottom: 80,
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
