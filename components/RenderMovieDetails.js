import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useAppearance } from './AppearanceContext';
import {
  detailsMovieUrl,
  apiKey,
  omdbApiKey,
  basePosterUrl,
  baseProfileUrl,
} from '../settings/api';
import ProgressiveBackdrop from './ProgressiveBackdrop';
import { FontAwesome5 } from '@expo/vector-icons';
import Loader from './Loader';
import * as Haptics from 'expo-haptics';
import i18n from '../language/i18n';
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
import noImage from '../assets/no-image.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import imdbLogo from '../assets/imdb-logo.png';
import tmdbLogo from '../assets/tmdb-logo-small.png';
import freshNegative from '../assets/freshNegative.png';
import freshPositive from '../assets/freshPositive.png';
import PosterGalleryModal from './PosterGalleryModal';
import { monthNames, formatDate } from '../utils/dateUtils';

const RenderDetails = ({ navigation, id }) => {
  const [loader, setLoader] = useState(true);
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(false);
  const [videos, setVideos] = useState([]);
  const [movieExist, setMovieExist] = useState();
  const [sessionId, setSessionId] = useState();
  const [stateFinish, setStateFinish] = useState(true);
  const [digitalRelease, setDigitalRelease] = useState();
  const [releaseNote, setReleaseNote] = useState();
  const [omdb, setOmdb] = useState();
  const [rottenTomato, setRottenTomato] = useState();
  const [imdbVotes, setImdbVotes] = useState();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const { colorScheme } = useAppearance();
  const { width, isTablet } = useResponsive();
  const scrollBarTheme = colorScheme === 'light' ? 'black' : 'white';
  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const backdropHeight = isTablet ? 560 : 250;
  const posterImgW = isTablet ? 200 : 120;
  const posterImgH = posterImgW * 1.5;
  const videoWidth = isTablet ? Math.min(width * 0.4, 400) : Math.min(width * 0.52, 320);
  const videoHeight = videoWidth / 1.78;
  const castSize = isTablet ? 110 : Math.min(width / 4.5, 100);
  const posterW = isTablet ? 140 : Math.min(width / 4.5, 130);
  const posterH = posterW * 1.5;
  const thumbW = isTablet ? 64 : 44;
  useEffect(() => {
    setStateFinish(false);
    const getMovie = async () => {
      try {
        const videos = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos${apiKey}&language=en-US`
        );
        const sessionId = await AsyncStorage.getItem('sessionId');
        const response = await axios.get(
          `${
            detailsMovieUrl +
            id +
            apiKey +
            '&append_to_response=translations,recommendations,similar,credits,release_dates,images&include_image_language=en,null'
          }`
        );
        setVideos(videos.data.results);
        getOmdbInfo(response.data.imdb_id);
        setMovie(response.data);
        setSessionId(sessionId);
        const usRelease = response.data.release_dates.results
          .filter((region) => region.iso_3166_1 === 'US')[0]
          ?.release_dates.filter((type) => type.type === 4)[0];
        if (usRelease) {
          setDigitalRelease(usRelease.release_date);
          setReleaseNote(usRelease.note);
        }

        if (sessionId) {
          getMovieState(sessionId);
        }
      } catch (e) {
        console.error('Failed to fetch movie:', e);
        setError(true);
        setLoader(false);
      }
    };
    getMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOmdbInfo = async (imdbId) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbId}`
      );
      setOmdb(response.data);
      if (response.data.imdbVotes && response.data.imdbVotes !== 'N/A') {
        setImdbVotes(JSON.parse(response.data.imdbVotes.replaceAll(',', '')));
      }
      const rtRating = response.data.Ratings?.find(
        (source) => source.Source === 'Rotten Tomatoes'
      );
      if (rtRating) {
        setRottenTomato(JSON.parse(rtRating.Value.replace('%', '')));
      }
      return response;
    } catch (e) {
      console.error('Failed to fetch OMDB info:', e);
    } finally {
      setLoader(false);
    }
  };

  const getMovieState = async (session) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/account_states${apiKey}&session_id=${session}`
      );
      setMovieExist(response.data.watchlist);
      return response;
    } catch (e) {
      console.error('Failed to fetch movie state:', e);
    } finally {
      setStateFinish(true);
    }
  };

  const watchListFunction = () => {
    if (sessionId) {
      setMovieExist(!movieExist);
      if (movieExist) {
        removeMovieToWatchlist();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        setMovieToWatchlist();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      Alert.alert(i18n.t('watchlistModalTex'), '', [{ text: i18n.t('close') }]);
    }
  };

  const setMovieToWatchlist = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.themoviedb.org/3/account/${id}/watchlist${apiKey}&session_id=${sessionId}`,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          media_type: 'movie',
          media_id: movie.id,
          watchlist: true,
        },
      });
      return response;
    } catch (e) {
      console.error('Failed to add movie to watchlist:', e);
    }
  };

  const removeMovieToWatchlist = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.themoviedb.org/3/account/${id}/watchlist${apiKey}&session_id=${sessionId}`,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        data: {
          media_type: 'movie',
          media_id: movie.id,
          watchlist: false,
        },
      });
      return response;
    } catch (e) {
      console.error('Failed to remove movie from watchlist:', e);
    }
  };

  // premiere
  let year = '';
  let releaseDate = '';
  if (movie.release_date) {
    let d = new Date(movie.release_date);
    year = d.getFullYear();
    let month = monthNames[d.getMonth()];
    let day = d.getDate();
    releaseDate = `${day}. ${month} ${year}`;
  }

  let digitalReleaseDate = '';
  if (digitalRelease) {
    digitalReleaseDate = formatDate(digitalRelease);
  }

  // Runtime
  let runtime = timeConvert(movie.runtime);
  function timeConvert(num) {
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    let hourNaming = i18n.t('hour');
    if (rhours > 1) {
      hourNaming = i18n.t('hours');
    }
    return rhours + hourNaming + rminutes + ' min';
  }

  const numFormatter = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed() + 'k';
    } else {
      return num;
    }
  };

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {loader ? (
        <Loader loadingStyle={styles.Loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, themeTextStyle]}>
            {i18n.t('errorLoading')}
          </Text>
        </View>
      ) : (
        <View style={styles.scrollViewWrapper}>
          <ScrollView indicatorStyle={scrollBarTheme}>
            <View style={styles.main}>
              <ProgressiveBackdrop
                backdropPath={movie.backdrop_path}
                height={backdropHeight}
                backgroundColor={colorScheme === 'light' ? backgroundColorLight : backgroundColorDark}
              />
              <View style={{ flexDirection: isTablet ? 'row' : 'column', paddingHorizontal: isTablet ? 22 : 0, marginTop: isTablet ? -backdropHeight * 0.6 : 0 }}>
                <View style={isTablet ? { alignItems: 'center' } : [styles.imageDiv, boxShadow]}>
                  <Pressable onPress={() => { if (movie.images?.posters?.length > 0) setGalleryVisible(true); }}>
                    <View style={boxShadow}>
                      <Image
                        source={
                          movie.poster_path
                            ? { uri: `${basePosterUrl}${movie.poster_path}` }
                            : noImage
                        }
                        placeholder={imageBlurhash}
                        placeholderContentFit='cover'
                        style={[styles.posterImg, { width: posterImgW, height: posterImgH, marginTop: isTablet ? 0 : -backdropHeight / 2, marginLeft: isTablet ? 0 : 20 }]}
                      />
                    </View>
                  </Pressable>
                  {!stateFinish && sessionId ? (
                    <Loader
                      loadingStyle={isTablet ? { marginTop: 12 } : styles.watchListLoader}
                      color={'white'}
                      size={'small'}
                    />
                  ) : (
                    <Pressable onPress={watchListFunction}>
                      <View style={isTablet ? { marginTop: 12, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' } : styles.watchListDiv}>
                        <FontAwesome5
                          name={'bookmark'}
                          solid={movieExist}
                          style={{ color: 'red', fontSize: 25 }}
                        />
                        <Text style={styles.watchListText}>
                          {i18n.t('watchlistBtn')}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
                <View style={isTablet ? { flex: 1, marginLeft: 22, flexDirection: 'row', gap: 32, alignItems: 'flex-start' } : undefined}>
                  <View style={isTablet ? { flexShrink: 0, maxWidth: 250 } : undefined}>
                    <Text style={[styles.title, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0, fontSize: 24, marginTop: 10, color: 'white' }]} selectable>
                      {movie.title}
                    </Text>
                    <View style={[styles.underTitleDiv, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {year}
                        </Text>
                      </View>
                      <Text style={[styles.separators, themeTextStyle]}>•</Text>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {runtime}
                        </Text>
                      </View>
                      <Text style={[styles.separators, themeTextStyle]}>•</Text>
                      <View style={styles.underTitleElem}>
                        <Text style={[styles.underTitle, themeTextStyle]}>
                          {omdb?.Rated}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.rating, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('releaseDate')}</Text>{' '}
                      {releaseDate}
                    </Text>
                    {digitalRelease ? (
                      <Text style={[styles.genre, styles.runtime, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                        <Text style={styles.category}>
                          {i18n.t('digitalReleaseDate')}
                        </Text>{' '}
                        {digitalReleaseDate} {releaseNote ? `(${releaseNote})` : null}
                      </Text>
                    ) : null}
                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('status')}</Text>{' '}
                      {movie.status}
                    </Text>
                    {Number.isFinite(movie.budget) && movie.budget !== 0 ? (
                      <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                        <Text style={styles.category}>{i18n.t('budget')}</Text> $
                        {movie.budget.toLocaleString()}
                      </Text>
                    ) : null}
                    {Number.isFinite(movie.revenue) && movie.revenue !== 0 ? (
                      <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                        <Text style={styles.category}>{i18n.t('revenue')}</Text> $
                        {movie.revenue.toLocaleString()}
                      </Text>
                    ) : null}
                    {movie.credits?.crew?.find((c) => c.job === 'Director') ? (
                      <Text
                        style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}
                        onPress={() => {
                          const director = movie.credits.crew.find((c) => c.job === 'Director');
                          navigation.push('PersonDetails', {
                            id: director.id,
                            creditId: director.credit_id,
                            headerTitle: director.name,
                          });
                        }}
                      >
                        <Text style={styles.category}>{i18n.t('director')}</Text>{' '}
                        {movie.credits.crew.find((c) => c.job === 'Director').name}
                      </Text>
                    ) : null}
                    <Text style={[styles.genre, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      <Text style={styles.category}>{i18n.t('genres')}</Text>{' '}
                      {movie.genres?.map((genre) => genre.name).join(', ')}
                    </Text>
                  </View>
                  <View style={isTablet ? { flex: 1, maxWidth: 500, marginTop: 52 } : undefined}>
                    <View style={[styles.rating, styles.ratingDiv, isTablet && { marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, flex: 0 }]}>
                      {movie.vote_average !== 0 ? (
                        <Pressable
                          style={[styles.ratingWrapper]}
                          onPress={() => WebBrowser.openBrowserAsync(`https://www.themoviedb.org/movie/${movie.id}`)}
                        >
                          <Image
                            source={tmdbLogo}
                            style={styles.tmdbLogo}
                            contentFit='contain'
                          />
                          <View style={styles.ratingElem}>
                            <Text style={[themeTextStyle]}>
                              {Math.floor((movie.vote_average * 100) / 10)}%{' '}
                            </Text>
                            <Text style={[styles.ratingCounter, themeTextStyle]}>
                              {numFormatter(movie.vote_count)}
                            </Text>
                          </View>
                        </Pressable>
                      ) : null}

                      {omdb ? (
                        <Pressable
                          style={[styles.ratingWrapper]}
                          onPress={() => WebBrowser.openBrowserAsync(`https://www.imdb.com/title/${movie.imdb_id}/`)}
                        >
                          <Image
                            source={imdbLogo}
                            style={styles.imdbLogo}
                            contentFit='contain'
                          />
                          <View style={styles.ratingElem}>
                            <Text style={[themeTextStyle]}>
                              {omdb.imdbRating && omdb.imdbRating !== 'N/A'
                                ? `${omdb.imdbRating}/10`
                                : '—'}
                            </Text>
                            {imdbVotes ? (
                              <Text style={[styles.ratingCounter, themeTextStyle]}>
                                {numFormatter(imdbVotes)}
                              </Text>
                            ) : null}
                          </View>
                        </Pressable>
                      ) : null}
                      {omdb ? (
                        <Pressable
                          style={[styles.ratingWrapper]}
                          onPress={() => WebBrowser.openBrowserAsync(`https://www.rottentomatoes.com/search?search=${encodeURIComponent(movie.title)}`)}
                        >
                          <Image
                            source={rottenTomato ? (rottenTomato > 60 ? freshPositive : freshNegative) : freshPositive}
                            style={styles.rottenLogo}
                          />
                          <View style={styles.ratingElem}>
                            <Text style={[themeTextStyle]}>
                              {rottenTomato ? `${rottenTomato}%` : '—'}
                            </Text>
                            {rottenTomato ? (
                              <Text style={[styles.ratingCounter, themeTextStyle]}>
                                {rottenTomato > 60 ? 'Fresh' : 'Rotten'}
                              </Text>
                            ) : null}
                          </View>
                        </Pressable>
                      ) : null}
                    </View>
                    <Text style={[styles.overview, themeTextStyle, isTablet && { marginLeft: 0, marginRight: 0 }]}>
                      {movie.overview}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {videos.filter((v) => v.type === 'Trailer' && v.site === 'YouTube').length > 0 ? (
              <View style={styles.trailerMain}>
                <Text style={[styles.trailerHeading, themeTextStyle]}>
                  {i18n.t('extras')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.trailerDiv}>
                    {videos
                      .filter(
                        (type) =>
                          type.type === 'Trailer' && type.site === 'YouTube'
                      )
                      .map((video, idx) => {
                        let maxLimit = 32;
                        return (
                          <View style={styles.videoDiv} key={idx}>
                            <Pressable
                              onPress={() => WebBrowser.openBrowserAsync(`https://www.youtube.com/watch?v=${video.key}`)}
                              style={[boxShadow, { width: videoWidth, height: videoHeight, borderRadius: borderRadius, overflow: 'hidden' }]}
                            >
                              <Image
                                source={{ uri: `https://img.youtube.com/vi/${video.key}/hqdefault.jpg` }}
                                style={{ width: videoWidth, height: videoHeight }}
                                placeholder={imageBlurhash}
                                placeholderContentFit='cover'
                                contentFit='cover'
                                transition={200}
                              />
                              <View style={styles.playOverlay}>
                                <View style={styles.playButton}>
                                  <FontAwesome5 name='play' solid style={styles.playIcon} />
                                </View>
                              </View>
                            </Pressable>
                            <Text style={[styles.videoText, themeTextStyle]}>
                              {video.name.length > maxLimit
                                ? video.name.substring(0, maxLimit - 3) + '...'
                                : video.name}
                            </Text>
                            <Text style={[styles.typeText, themeTextStyle]}>
                              {video.type}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                </ScrollView>
              </View>
            ) : null}
            <View style={styles.castMain}>
              <Text style={[styles.castHeading, themeTextStyle]}>
                {i18n.t('cast')}
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.castDiv}>
                  {movie.credits?.cast?.slice(0, 20).map((cast, idx) => {
                    const profilePicture = {
                      uri: `${baseProfileUrl + cast.profile_path}`,
                    };
                    return (
                      <Pressable
                        key={idx}
                        onPress={() =>
                          navigation.push('PersonDetails', {
                            id: cast.id,
                            creditId: cast.credit_id,
                            headerTitle: cast.name,
                          })
                        }
                      >
                        <View style={[styles.castCard, { width: castSize }]}>
                          <View style={boxShadow}>
                            <Image
                              style={[styles.profileImage, { width: castSize, height: castSize }]}
                              source={
                                cast.profile_path ? profilePicture : noImage
                              }
                              placeholder={imageBlurhash}
                              placeholderContentFit='cover'
                            />
                          </View>
                          <Text style={[styles.textName, themeTextStyle]}>
                            {cast.name}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={[styles.textCharacter, themeTextStyle]}
                          >
                            {cast.character}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
            {movie.recommendations?.results?.length > 0 ? (
              <View style={styles.moviesMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('recommendations')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.moviesDiv}>
                    {movie.recommendations.results
                      .slice(0, 50)
                      .map((item, idx) => (
                            <Pressable
                              style={styles.moviesCard}
                              key={item.id || idx}
                              onPress={() =>
                                navigation.push('Details', {
                                  id: item.id,
                                  headerTitle: item.title,
                                })
                              }
                            >
                              <View style={boxShadow}>
                                <Image
                                  style={[styles.posterImage, { width: posterW, height: posterH }]}
                                  source={
                                    item.poster_path
                                      ? { uri: `${basePosterUrl}${item.poster_path}` }
                                      : noImage
                                  }
                                  placeholder={imageBlurhash}
                                  placeholderContentFit='cover'
                                />
                              </View>
                              <View style={styles.ratingDivRec}>
                                <Image
                                  source={tmdbLogo}
                                  style={styles.tmdbLogoRec}
                                  contentFit='contain'
                                />
                                <Text
                                  style={[styles.textRating, themeTextStyle]}
                                >
                                  {Math.floor((item.vote_average * 100) / 10)}%
                                </Text>
                              </View>
                            </Pressable>
                      ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}
            {movie.similar?.results?.length > 0 ? (
              <View style={styles.moviesMain}>
                <Text style={[styles.moviesHeading, themeTextStyle]}>
                  {i18n.t('similar')}
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.moviesDiv}>
                    {movie.similar.results.slice(0, 50).map((item, idx) => (
                          <Pressable
                            style={styles.moviesCard}
                            key={item.id || idx}
                            onPress={() =>
                              navigation.push('Details', {
                                id: item.id,
                                headerTitle: item.title,
                              })
                            }
                          >
                            <View style={boxShadow}>
                              <Image
                                style={[styles.posterImage, { width: posterW, height: posterH }]}
                                source={
                                  item.poster_path
                                    ? { uri: `${basePosterUrl}${item.poster_path}` }
                                    : noImage
                                }
                                placeholder={imageBlurhash}
                                placeholderContentFit='cover'
                              />
                            </View>
                            <View style={styles.ratingDivRec}>
                              <Image
                                source={tmdbLogo}
                                style={styles.tmdbLogoRec}
                                contentFit='contain'
                              />
                              <Text style={[styles.textRating, themeTextStyle]}>
                                {Math.floor((item.vote_average * 100) / 10)}%
                              </Text>
                            </View>
                          </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
      <PosterGalleryModal
        visible={galleryVisible}
        onClose={() => setGalleryVisible(false)}
        images={movie.images?.posters}
        index={galleryIndex}
        onIndexChange={setGalleryIndex}
        thumbW={thumbW}
      />
    </View>
  );
};

const globalFontsize = 17;
const globalPadding = 5;
const normalFontWeight = '300';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchListLoader: {
    marginTop: -48,
    marginRight: 65,
  },
  scrollViewWrapper: {
    marginBottom: 45,
  },
  main: {
    width: '100%',
    justifyContent: 'center',
  },
  Loader: {
    marginBottom: 300,
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
    borderRadius: borderRadius,
  },
  imageDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  watchListDiv: {
    marginTop: -40,
    marginRight: 50,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchListText: {
    fontWeight: '600',
    fontSize: 19,
    color: 'white',
    marginLeft: 10,
  },
  title: {
    marginTop: 30,
    marginBottom: 12,
    marginLeft: 22,
    marginRight: 22,
    fontSize: 19,
    fontWeight: 'bold',
  },
  underTitleDiv: {
    marginLeft: 22,
    marginRight: 22,
    flex: 1,
    flexDirection: 'row',
  },
  underTitleElem: {},
  separators: {
    opacity: 0.6,
    marginRight: 7.5,
    marginLeft: 7.5,
  },
  underTitle: {
    opacity: 0.6,
    fontWeight: '400',
    fontSize: 14.5,
  },
  overview: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    lineHeight: 29,
  },
  genre: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: globalPadding,
    marginBottom: globalPadding,
    lineHeight: 29,
  },
  runtime: {
    marginBottom: globalPadding * 4,
  },
  rating: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: globalFontsize,
    fontWeight: normalFontWeight,
    marginTop: 20,
    marginBottom: globalPadding,
  },
  ratingDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingElem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 4,
  },
  ratingCounter: {
    opacity: 0.7,
  },
  imdbLogo: {
    width: 40,
    height: 18,
    marginRight: 7,
  },
  tmdbLogo: {
    width: 40,
    height: 17,
    marginRight: 7,
  },
  rottenLogo: {
    width: 25,
    height: 25,
    marginRight: 7,
  },
  tagline: {
    marginLeft: 22,
    opacity: 0.7,
    fontSize: 16,
  },
  category: {
    opacity: 0.7,
  },
  trailerMain: {
    marginTop: 35 + globalPadding,
    marginBottom: 25 + globalPadding,
    marginLeft: 22,
  },
  trailerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  trailerDiv: {
    flex: 1,
    flexDirection: 'row',
  },
  videoDiv: {
    marginRight: 16,
  },
  videoText: {
    fontWeight: '600',
    fontSize: 13,
    marginTop: 10,
  },
  typeText: {
    paddingTop: 5,
    opacity: 0.7,
  },
  videoElem: {
    marginBottom: 10,
    marginRight: 30,
    borderRadius: borderRadius,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: 'white',
    fontSize: 18,
    marginLeft: 3,
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
    textAlign: 'center',
  },
  profileImage: {
    marginBottom: 8,
    borderRadius: 50,
  },
  textName: {
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  textCharacter: {
    paddingTop: 5,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
  castHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  homepageButton: {
    fontSize: 17,
    fontWeight: '600',
    padding: 8,
  },
  homepageButtonMain: {
    alignItems: 'flex-start',
  },
  homepageButtonDiv: {
    marginLeft: 22,
    marginTop: globalPadding * 7,
    marginBottom: globalPadding * 3,
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
    marginBottom: 13,
    borderRadius: borderRadius,
  },
  textRating: {
    // paddingTop: 8,
    marginLeft: 6,
    fontSize: 12,
  },
  ratingDivRec: {
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tmdbLogoRec: {
    width: 25,
    height: 12,
  },
  moviesHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default RenderDetails;
